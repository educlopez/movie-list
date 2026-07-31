import { type NextRequest, NextResponse } from "next/server";
import { enrichWithTmdb } from "@/lib/tmdb-cache";

const JUSTWATCH_API = "https://apis.justwatch.com/graphql";

function jwIcon(icon: string): string {
  if (!icon) {
    return "";
  }
  return `https://images.justwatch.com${icon.replace("{profile}", "s100").replace("{format}", "webp")}`;
}

const UPCOMING_TITLES_QUERY = `
query GetUpcoming($country: Country!, $first: Int!, $after: String, $filter: TitleFilter, $sortBy: PopularTitlesSorting!) {
  popularTitles(country: $country, first: $first, after: $after, filter: $filter, sortBy: $sortBy) {
    totalCount
    pageInfo { hasNextPage endCursor }
    edges {
      node {
        id
        objectType
        objectId
        content(country: $country, language: "es") {
          title
          originalReleaseYear
          shortDescription
          posterUrl
          fullPath
          externalIds { imdbId tmdbId }
          upcomingReleases {
            releaseDate
            package { clearName shortName icon packageId }
          }
        }
        offers(country: $country, platform: WEB) {
          monetizationType
          package { clearName packageId shortName icon }
        }
      }
    }
  }
}`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = (searchParams.get("country") || "US").toUpperCase();
  const after = searchParams.get("after") || null;

  const currentYear = new Date().getFullYear();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let allEdges: Record<string, any>[] = [];
    let cursor: string | null = after;
    let totalCount = 0;
    const maxPages = 5;

    for (let page = 0; page < maxPages; page++) {
      const variables: Record<string, unknown> = {
        country,
        filter: {
          releaseYear: { min: currentYear },
        },
        first: 100,
        sortBy: "POPULAR",
      };
      if (cursor) {
        variables.after = cursor;
      }

      const res = await fetch(JUSTWATCH_API, {
        body: JSON.stringify({ query: UPCOMING_TITLES_QUERY, variables }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const json = await res.json();
      const pageData = json.data?.popularTitles;

      if (!pageData) {
        if (page === 0) {
          return NextResponse.json(
            { error: "No data from JustWatch" },
            { status: 502 }
          );
        }
        break;
      }

      ({ totalCount } = pageData);
      allEdges = allEdges.concat(pageData.edges || []);

      if (!pageData.pageInfo?.hasNextPage) {
        break;
      }
      cursor = pageData.pageInfo.endCursor;
    }

    // Group by provider — use both upcomingReleases and offers
    const providerMap: Record<
      string,
      {
        packageId: number;
        clearName: string;
        shortName: string;
        icon: string;
        items: Record<string, unknown>[];
      }
    > = {};

    for (const edge of allEdges) {
      const { node } = edge;
      const { content } = node;
      if (!content) {
        continue;
      }

      const mediaType = node.objectType === "MOVIE" ? "movie" : "tv";

      let tmdbId = 0;
      const rawTmdbId = content.externalIds?.tmdbId;
      if (rawTmdbId) {
        const parsed =
          typeof rawTmdbId === "string" && rawTmdbId.includes(":")
            ? Number.parseInt(rawTmdbId.split(":")[0], 10)
            : Number.parseInt(rawTmdbId, 10);
        if (!Number.isNaN(parsed)) {
          tmdbId = parsed;
        }
      }

      // Determine the release date from upcomingReleases or fallback to year
      const upcomingReleases = content.upcomingReleases || [];
      const futureReleases = upcomingReleases.filter(
        (r: { releaseDate: string }) =>
          r.releaseDate >= new Date().toISOString().slice(0, 10)
      );

      const item = {
        genre_ids: [],
        id: tmdbId || node.objectId,
        jw_id: node.id,
        media_type: mediaType,
        poster_path: content.posterUrl || null,
        release_date:
          futureReleases[0]?.releaseDate || `${content.originalReleaseYear}`,
        title: content.title || "",
        vote_average: 0,
        year: content.originalReleaseYear || 0,
      };

      // Add to providers from upcoming releases
      if (futureReleases.length > 0) {
        const seenPackages = new Set<string>();
        for (const release of futureReleases) {
          const pkg = release.package;
          if (!pkg || seenPackages.has(pkg.shortName)) {
            continue;
          }
          seenPackages.add(pkg.shortName);

          const key = pkg.shortName;
          if (!providerMap[key]) {
            providerMap[key] = {
              clearName: pkg.clearName,
              icon: jwIcon(pkg.icon || ""),
              items: [],
              packageId: pkg.packageId,
              shortName: pkg.shortName,
            };
          }
          if (
            !providerMap[key].items.some(
              (i: Record<string, unknown>) =>
                i.id === item.id && i.media_type === item.media_type
            )
          ) {
            providerMap[key].items.push({
              ...item,
              release_date: release.releaseDate,
            });
          }
        }
      }

      // If no upcoming releases, use existing offers
      if (futureReleases.length === 0 && node.offers?.length > 0) {
        const seenPackages = new Set<string>();
        for (const offer of node.offers) {
          const pkg = offer.package;
          if (!pkg || seenPackages.has(pkg.shortName)) {
            continue;
          }
          seenPackages.add(pkg.shortName);

          const key = pkg.shortName;
          if (!providerMap[key]) {
            providerMap[key] = {
              clearName: pkg.clearName,
              icon: jwIcon(pkg.icon || ""),
              items: [],
              packageId: pkg.packageId,
              shortName: pkg.shortName,
            };
          }
          if (
            !providerMap[key].items.some(
              (i: Record<string, unknown>) =>
                i.id === item.id && i.media_type === item.media_type
            )
          ) {
            providerMap[key].items.push(item);
          }
        }
      }
    }

    // Enrich items with TMDB data (poster + rating) — cached LRU
    const allItems = Object.values(providerMap).flatMap((p) => p.items);
    await enrichWithTmdb(allItems);

    const providers = Object.values(providerMap)
      .filter((p) => p.items.length > 0)
      .sort((a, b) => b.items.length - a.items.length);

    return NextResponse.json(
      {
        date: new Date().toISOString().slice(0, 10),
        endCursor: null,
        hasNextPage: false,
        providers,
        totalCount,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
