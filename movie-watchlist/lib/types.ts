export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Movie {
  id: string;
  name: string;
  rating?: Rating;
  isWatched: boolean;
  createdAt: number;
  description?: string;
  notes?: string;
  imdbId?: string;
  imdbRating?: string;
  posterPath?: string | null;
  releaseDate?: string;
}

export type FilterType = "all" | "watched" | "watchlist";
