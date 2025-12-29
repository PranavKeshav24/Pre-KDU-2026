import { useState, useCallback, useMemo, useEffect } from "react";
import type { Movie, FilterType } from "../lib/types";

const STORAGE_KEY = "movie-track-watchlist";

export function useMovieWatchlist() {
  const [movies, setMovies] = useState<Movie[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  }, [movies]);

  const addMovie = useCallback(
    (movieData: Partial<Movie> & { name: string }) => {
      if (!movieData.name.trim()) return;

      const newMovie: Movie = {
        id: crypto.randomUUID(),
        rating: movieData.rating,
        isWatched: false,
        createdAt: Date.now(),
        ...movieData,
        name: movieData.name.trim(),
      };
      setMovies((prev) => [newMovie, ...prev]);
    },
    []
  );

  const toggleWatched = useCallback((id: string) => {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === id ? { ...movie, isWatched: !movie.isWatched } : movie
      )
    );
  }, []);

  const updateMovie = useCallback((id: string, updates: Partial<Movie>) => {
    setMovies((prev) =>
      prev.map((movie) => (movie.id === id ? { ...movie, ...updates } : movie))
    );
  }, []);

  const removeMovie = useCallback((id: string) => {
    setMovies((prev) => prev.filter((movie) => movie.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setMovies([]);
  }, []);

  const filteredMovies = useMemo(() => {
    return movies
      .filter((movie) => {
        const matchesSearch = movie.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesFilter =
          filter === "all" ||
          (filter === "watched" && movie.isWatched) ||
          (filter === "watchlist" && !movie.isWatched);

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [movies, searchQuery, filter]);

  const stats = useMemo(() => {
    return {
      total: movies.length,
      watched: movies.filter((m) => m.isWatched).length,
      watchlist: movies.filter((m) => !m.isWatched).length,
    };
  }, [movies]);

  return {
    movies: filteredMovies,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    addMovie,
    updateMovie,
    toggleWatched,
    removeMovie,
    clearAll,
    stats,
  };
}
