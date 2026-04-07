import { type NextRequest, NextResponse } from "next/server";
import { API_KEY, TMDB_ENDPOINT } from "@/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "movie";
  const mode = searchParams.get("mode") || "new";
  const date =
    searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const providers = searchParams.get("providers") || "";
  const genre = searchParams.get("genre") || "";
  const rating = searchParams.get("rating") || "";
  const country = searchParams.get("country") || "US";

  // If no providers specified, do a generic discover for the date
  const providerIds = providers ? providers.split(",") : [];

  try {
    const types = type === "all" ? ["movie", "tv"] : [type];
    const providerResults: Record<
      string,
      {
        provider_id: number;
        provider_name: string;
        logo_path: string;
        items: Array<Record<string, unknown>>;
      }
    > = {};

    if (providerIds.length === 0) {
      // No provider filter — just fetch all for the date
      const fetches = types.map(async (mediaType) => {
        const dateField =
          mediaType === "movie" ? "primary_release_date" : "first_air_date";
        let url = `${TMDB_ENDPOINT}/discover/${mediaType}?api_key=${API_KEY}&sort_by=popularity.desc&watch_region=${country}`;
        url += `&${dateField}.gte=${date}&${dateField}.lte=${date}`;
        if (genre) {
          url += `&with_genres=${genre}`;
        }
        if (rating) {
          url += `&vote_average.gte=${rating}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        return (data.results || []).map((item: Record<string, unknown>) => ({
          id: item.id,
          title: item.title || item.name || "",
          media_type: mediaType,
          poster_path: item.poster_path,
          release_date: (item.release_date ||
            item.first_air_date ||
            "") as string,
          vote_average: (item.vote_average || 0) as number,
          genre_ids: item.genre_ids || [],
        }));
      });
      const results = (await Promise.all(fetches)).flat();
      if (results.length > 0) {
        providerResults["all"] = {
          provider_id: 0,
          provider_name: "All Platforms",
          logo_path: "",
          items: results,
        };
      }
    } else {
      // Fetch per provider
      // First, get provider details (name + logo)
      const providerInfoRes = await fetch(
        `${TMDB_ENDPOINT}/watch/providers/movie?api_key=${API_KEY}&watch_region=${country}`
      );
      const providerInfoData = await providerInfoRes.json();
      const providerMap: Record<string, { name: string; logo: string }> = {};
      for (const p of providerInfoData.results || []) {
        providerMap[p.provider_id.toString()] = {
          name: p.provider_name,
          logo: p.logo_path,
        };
      }

      const perProviderFetches = providerIds.map(async (providerId) => {
        const allItems: Array<Record<string, unknown>> = [];

        for (const mediaType of types) {
          const dateField =
            mediaType === "movie" ? "primary_release_date" : "first_air_date";
          let url = `${TMDB_ENDPOINT}/discover/${mediaType}?api_key=${API_KEY}&sort_by=popularity.desc&watch_region=${country}`;
          url += `&with_watch_providers=${providerId}&with_watch_monetization_types=flatrate|rent|buy`;
          url += `&${dateField}.gte=${date}&${dateField}.lte=${date}`;
          if (genre) {
            url += `&with_genres=${genre}`;
          }
          if (rating) {
            url += `&vote_average.gte=${rating}`;
          }

          const res = await fetch(url);
          const data = await res.json();

          for (const item of data.results || []) {
            allItems.push({
              id: item.id,
              title: item.title || item.name || "",
              media_type: mediaType,
              poster_path: item.poster_path,
              release_date: (item.release_date ||
                item.first_air_date ||
                "") as string,
              vote_average: (item.vote_average || 0) as number,
              genre_ids: item.genre_ids || [],
            });
          }
        }

        if (allItems.length > 0) {
          const info = providerMap[providerId] || {
            name: `Provider ${providerId}`,
            logo: "",
          };
          providerResults[providerId] = {
            provider_id: Number(providerId),
            provider_name: info.name,
            logo_path: info.logo,
            items: allItems,
          };
        }
      });

      await Promise.all(perProviderFetches);
    }

    const providersArray = Object.values(providerResults).filter(
      (p) => p.items.length > 0
    );

    return NextResponse.json({
      date,
      providers: providersArray,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
