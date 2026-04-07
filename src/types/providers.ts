export interface TMDBWatchProvider {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

export interface TMDBCountryProviders {
  buy?: TMDBWatchProvider[];
  flatrate?: TMDBWatchProvider[];
  link: string;
  rent?: TMDBWatchProvider[];
}

export interface TMDBWatchProvidersResponse {
  id: number;
  results: Record<string, TMDBCountryProviders>;
}

export interface WatchProvidersData {
  alternatives: AlternativeCountry[];
  buy: TMDBWatchProvider[];
  country: string;
  flatrate: TMDBWatchProvider[];
  link: string;
  rent: TMDBWatchProvider[];
}

export interface AlternativeCountry {
  country: string;
  providers: TMDBWatchProvider[];
}

export interface TMDBAvailablePlatform {
  display_priorities: Record<string, number>;
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

export interface TMDBAvailablePlatformsResponse {
  results: TMDBAvailablePlatform[];
}

export interface AvailablePlatformsData {
  platforms: TMDBAvailablePlatform[];
}
