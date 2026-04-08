import { type NextRequest, NextResponse } from "next/server";
import { enrichWithTmdb } from "@/lib/tmdb-cache";

const JUSTWATCH_API = "https://apis.justwatch.com/graphql";

function jwIcon(icon: string): string {
  if (!icon) {
    return "";
  }
  return `https://images.justwatch.com${icon.replace("{profile}", "s100").replace("{format}", "webp")}`;
}

const NEW_TITLES_QUERY = `
query GetNewTitles($country: Country!, $first: Int!, $after: String, $date: Date, $package: String, $filter: TitleFilter) {
  newTitles(country: $country, first: $first, after: $after, date: $date, package: $package, filter: $filter) {
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
          retailPrice(language: "es")
          lastChangeRetailPrice(language: "es")
          lastChangePercent
          currency
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
  const monetization = searchParams.get("monetization"); // comma-separated: "BUY,RENT"
  const after = searchParams.get("after") || null;

  try {
    const packageFilter = packages ? packages.split(",")[0] : undefined;

    // Fetch all pages from JustWatch (max 100 per page)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let allEdges: Array<Record<string, any>> = [];
    let cursor: string | null = after;
    let totalCount = 0;
    const maxPages = 5; // Safety limit

    for (let page = 0; page < maxPages; page++) {
      const variables: Record<string, unknown> = {
        country,
        first: 100,
        date,
      };
      if (cursor) {
        variables.after = cursor;
      }
      if (packageFilter) {
        variables.package = packageFilter;
      }
      if (monetization) {
        variables.filter = {
          monetizationTypes: monetization.split(","),
        };
      }

      const res = await fetch(JUSTWATCH_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: NEW_TITLES_QUERY, variables }),
      });

      const json = await res.json();
      const pageData = json.data?.newTitles;

      if (!pageData) {
        if (page === 0) {
          return NextResponse.json(
            { error: "No data from JustWatch" },
            { status: 502 }
          );
        }
        break;
      }

      totalCount = pageData.totalCount;
      allEdges = allEdges.concat(pageData.edges || []);

      if (!pageData.pageInfo?.hasNextPage) {
        break;
      }
      cursor = pageData.pageInfo.endCursor;
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

    for (const edge of allEdges) {
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

      // Extract best price info from offers (for deals mode)
      const buyRentOffers = (node.offers || []).filter(
        (o: Record<string, unknown>) =>
          o.monetizationType === "BUY" || o.monetizationType === "RENT"
      );
      const bestOffer = buyRentOffers.length > 0
        ? buyRentOffers.reduce(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (best: any, o: any) => {
              const pct = o.lastChangePercent ?? 0;
              return pct < (best.lastChangePercent ?? 0) ? o : best;
            },
            buyRentOffers[0]
          )
        : null;

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
        ...(monetization && bestOffer
          ? {
              retailPrice: bestOffer.retailPrice,
              lastChangeRetailPrice: bestOffer.lastChangeRetailPrice,
              lastChangePercent: bestOffer.lastChangePercent,
              currency: bestOffer.currency,
            }
          : {}),
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
            icon: jwIcon(pkg.icon || ""),
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
              icon: jwIcon(pkg.icon || ""),
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

    // Enrich items with TMDB data (poster + rating) — cached LRU
    const allItems = Object.values(providerMap).flatMap((p) => p.items);
    await enrichWithTmdb(allItems);

    const providers = Object.values(providerMap)
      .filter((p) => p.items.length > 0)
      .sort((a, b) => b.items.length - a.items.length);

    return NextResponse.json(
      {
        date,
        totalCount,
        providers,
        hasNextPage: false,
        endCursor: null,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
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
