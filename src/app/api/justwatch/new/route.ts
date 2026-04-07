import { type NextRequest, NextResponse } from "next/server";
import { API_KEY, TMDB_ENDPOINT } from "@/utils";

const JUSTWATCH_API = "https://apis.justwatch.com/graphql";

const NEW_TITLES_QUERY = `
query GetNewTitles($country: Country!, $first: Int!, $after: String, $date: Date, $package: String) {
  newTitles(country: $country, first: $first, after: $after, date: $date, package: $package) {
    totalCount
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
        }
        offers(country: $country, platform: WEB) {
          monetizationType
          package { clearName packageId shortName icon }
          dateCreated
        }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = (searchParams.get("country") || "US").toUpperCase();
  const date =
    searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const packages = searchParams.get("packages"); // comma-separated short names like "nfx,dnp"
  const after = searchParams.get("after") || null;

  try {
    const variables: Record<string, unknown> = {
      country,
      first: 30,
      date,
    };
    if (after) {
      variables.after = after;
    }
    if (packages) {
      variables.package = packages.split(",")[0];
    }

    const res = await fetch(JUSTWATCH_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: NEW_TITLES_QUERY, variables }),
    });

    const json = await res.json();
    const data = json.data?.newTitles;

    if (!data) {
      return NextResponse.json(
        { error: "No data from JustWatch" },
        { status: 502 }
      );
    }

    // Group by package (platform)
    const providerMap: Record<
      string,
      {
        packageId: number;
        clearName: string;
        shortName: string;
        icon: string;
        items: Array<Record<string, unknown>>;
      }
    > = {};

    for (const edge of data.edges) {
      const node = edge.node;
      const content = node.content;
      if (!content) {
        continue;
      }

      // Find which packages this was added to on this date
      const addedOffers = (node.offers || []).filter(
        (o: Record<string, unknown>) =>
          (o.dateCreated as string)?.startsWith(date)
      );

      // Determine media_type from objectType
      const mediaType = node.objectType === "MOVIE" ? "movie" : "tv";

      // Parse tmdbId
      let tmdbId = 0;
      const rawTmdbId = content.externalIds?.tmdbId;
      if (rawTmdbId) {
        const parsed =
          typeof rawTmdbId === "string" && rawTmdbId.includes(":")
            ? Number.parseInt(rawTmdbId.split(":")[0], 10)
            : Number.parseInt(rawTmdbId, 10);
        if (!isNaN(parsed)) {
          tmdbId = parsed;
        }
      }

      const item = {
        id: tmdbId || node.objectId,
        title: content.title || "",
        media_type: mediaType,
        poster_path: content.posterUrl || null,
        release_date: date,
        vote_average: 0,
        year: content.originalReleaseYear || 0,
        genre_ids: [],
        jw_id: node.id,
      };

      // Get unique packages for this item
      const seenPackages = new Set<string>();
      for (const offer of addedOffers) {
        const pkg = offer.package;
        if (!pkg || seenPackages.has(pkg.shortName)) {
          continue;
        }
        seenPackages.add(pkg.shortName);

        const key = pkg.shortName;
        if (!providerMap[key]) {
          providerMap[key] = {
            packageId: pkg.packageId,
            clearName: pkg.clearName,
            shortName: pkg.shortName,
            icon: pkg.icon || "",
            items: [],
          };
        }
        // Avoid duplicate items in same provider
        if (
          !providerMap[key].items.some(
            (i: Record<string, unknown>) =>
              i.id === item.id && i.media_type === item.media_type
          )
        ) {
          providerMap[key].items.push(item);
        }
      }

      // If no offers matched the date filter, add to first available package
      if (addedOffers.length === 0 && node.offers?.length > 0) {
        const pkg = node.offers[0].package;
        if (pkg) {
          const key = pkg.shortName;
          if (!providerMap[key]) {
            providerMap[key] = {
              packageId: pkg.packageId,
              clearName: pkg.clearName,
              shortName: pkg.shortName,
              icon: pkg.icon || "",
              items: [],
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

    // Enrich items with TMDB data (poster + rating) — batch up to 20 items
    const allItems = Object.values(providerMap).flatMap((p) => p.items);
    const uniqueItems = new Map<string, Record<string, unknown>>();
    for (const item of allItems) {
      const key = `${item.media_type}-${item.id}`;
      if (item.id && !uniqueItems.has(key)) {
        uniqueItems.set(key, item);
      }
    }

    const tmdbFetches = Array.from(uniqueItems.values())
      .filter((item) => item.id && item.id !== 0)
      .slice(0, 20)
      .map(async (item) => {
        try {
          const res = await fetch(
            `${TMDB_ENDPOINT}/${item.media_type}/${item.id}?api_key=${API_KEY}`
          );
          if (res.ok) {
            const tmdb = await res.json();
            item.poster_path = tmdb.poster_path || item.poster_path;
            item.vote_average = tmdb.vote_average || 0;
          }
        } catch {
          // Keep JustWatch data as fallback
        }
      });

    await Promise.all(tmdbFetches);

    const providers = Object.values(providerMap)
      .filter((p) => p.items.length > 0)
      .sort((a, b) => b.items.length - a.items.length);

    return NextResponse.json({
      date,
      totalCount: data.totalCount,
      providers,
      hasNextPage: data.pageInfo?.hasNextPage,
      endCursor: data.pageInfo?.endCursor || null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
