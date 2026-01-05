import React from "react";
import type { Movie } from "../lib/types";
import { motion } from "framer-motion";
import { useParams } from "react-router";


export default function PremiumMovie() {
    const movieId = useParams().id;
    const [Movie, setMovie] = React.useState<Movie | null>(null);

    React.useEffect(() => {
        const fetchMovie = () => {
            const storedMovies = localStorage.getItem("movie-track-watchlist");
            if (storedMovies) {
                const movies: Movie[] = JSON.parse(storedMovies);
                const foundMovie = movies.find((m) => m.id === movieId && m.isPremium);
                if (foundMovie) {
                    setMovie(foundMovie);
                }
            }
        };
        fetchMovie();
    }, [movieId]);
  return (
    <div>
      <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ margin: 0 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#1e1e1e] flex flex-col md:flex-row max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="relative md:w-2/5 bg-black h-[200px] md:h-auto shrink-0">
                {Movie?.posterPath ? (
                  <img
                    src={Movie?.posterPath}
                    alt={Movie?.name}
                    className="h-full w-full object-cover opacity-90"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-8 text-center text-white">
                    <h2 className="text-2xl font-bold">{Movie?.name}</h2>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
              </div>

              <div className="flex flex-1 flex-col p-6 md:p-10 overflow-y-auto">
                <div className="mb-8">
                  <span
                    className={`inline-block mb-3 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      Movie?.isWatched
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {Movie?.isWatched ? "Watched" : "To Watch"}
                  </span>
                  <h2 className="mb-2 text-3xl md:text-4xl font-extrabold leading-tight text-gray-900 dark:text-white">
                    {Movie?.name}
                  </h2>
                  <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                    {Movie?.releaseDate}
                  </p>
                </div>

                <div className="mb-8">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Now Playing
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
    </div>
  );
}