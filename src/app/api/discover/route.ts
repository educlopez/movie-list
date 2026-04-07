import { type NextRequest, NextResponse } from "next/server";
import { API_KEY, TMDB_ENDPOINT } from "@/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "movie";
  const mode = searchParams.get("mode") || "new";
  const genre = searchParams.get("genre") || "";
  const year = searchParams.get("year") || "";
  const rating = searchParams.get("rating") || "";
  const page = searchParams.get("page") || "1";

  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000)
    .toISOString()
    .slice(0, 10);
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);

  try {
    const types = type === "all" ? ["movie", "tv"] : [type];
    const fetches = types.map(async (mediaType) => {
      const dateField =
        mediaType === "movie" ? "primary_release_date" : "first_air_date";
      const yearField =
        mediaType === "movie" ? "primary_release_year" : "first_air_date_year";
      let url = `${TMDB_ENDPOINT}/discover/${mediaType}?api_key=${API_KEY}&page=${page}&sort_by=popularity.desc`;

      if (mode === "new") {
        url += `&${dateField}.gte=${thirtyDaysAgo}&${dateField}.lte=${today}`;
      } else {
        url += `&${dateField}.gte=${tomorrow}`;
      }

      if (genre) {
        url += `&with_genres=${genre}`;
      }
      if (year) {
        url += `&${yearField}=${year}`;
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

    const results = await Promise.all(fetches);
    const merged = results.flat();
    merged.sort((a, b) =>
      (b.release_date as string).localeCompare(a.release_date as string)
    );

    return NextResponse.json({
      results: merged.slice(0, 20),
      page: Number(page),
      total_pages: 10,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
