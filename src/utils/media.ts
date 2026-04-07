import type { TMDBLanguage } from "@/types/tmdb";

export function renderLanguage(languages: TMDBLanguage[]): string {
  if (languages.length === 0) {
    return "N/A";
  }
  return languages[0].name;
}

export function renderStatus(status: string | null | undefined): string {
  if (status) {
    return status;
  }
  return "N/A";
}
