const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || "";
const OMDB_BASE_URL = "https://www.omdbapi.com/";

export interface OMDbMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export const omdb = {
  searchMovies: async (query: string): Promise<OMDbMovie[]> => {
    if (!OMDB_API_KEY) return [];
    try {
      const response = await fetch(
        `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(
          query
        )}&type=movie`
      );
      if (!response.ok) throw new Error("Failed to fetch movies");
      const data = await response.json();
      return data.Search || [];
    } catch (error) {
      console.error("OMDb Search Error:", error);
      return [];
    }
  },
  getImageUrl: (poster: string) => {
    if (!poster || poster === "N/A") return null;
    return poster;
  },
  getMovieDetails: async (imdbId: string) => {
    if (!OMDB_API_KEY) return null;
    try {
      const response = await fetch(
        `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=short`
      );
      if (!response.ok) throw new Error("Failed to fetch movie details");
      return await response.json();
    } catch (error) {
      console.error("OMDb Detail Error:", error);
      return null;
    }
  },
};
