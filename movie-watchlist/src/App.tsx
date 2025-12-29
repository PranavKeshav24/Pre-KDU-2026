import { Search, Trash2, Sun, Moon } from "lucide-react";
import { useMovieWatchlist } from "../hooks/use-movie-watchlist";
import { MovieForm } from "../components/movie-form";
import { MovieItem } from "../components/movie-item";
import { useColorMode } from "../components/theme-registry";
import { MovieListEmpty } from "../components/movie-list-empty";

export default function WatchlistPage() {
  const {
    movies,
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
  } = useMovieWatchlist();
  const { toggleColorMode, mode } = useColorMode();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-8 flex flex-col items-end justify-between gap-4 md:flex-row">
        <div className="text-center md:text-left w-full md:w-auto">
          <h1 className="mb-1 text-3xl font-normal text-gray-900 dark:text-white">
            Watchlist
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your personal collection of cinematic masterpieces.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center text-right">
            <div className="flex flex-col items-end">
              <span className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                {stats.watched}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                watched
              </span>
            </div>
            <div className="mx-4 h-8 w-[1px] bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                {stats.watchlist}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                to watch
              </span>
            </div>
          </div>

          <button
            onClick={toggleColorMode}
            className="ml-2 rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 transition-colors"
          >
            {mode === "dark" ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-2xl bg-white/50 p-6 shadow-sm border border-gray-100 dark:bg-white/5 dark:border-gray-800">
          <div className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            ADD NEW FEATURE
          </div>
          <MovieForm onAdd={addMovie} />
        </div>

        <div>
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-[300px]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#1e1e1e] dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
              />
            </div>

            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {[
                { label: "ALL", value: "all" },
                { label: "PENDING", value: "watchlist" },
                { label: "WATCHED", value: "watched" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value as any)}
                  className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 ${
                    filter === tab.value
                      ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <hr className="my-6 border-gray-200 dark:border-gray-800" />

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                {movies.length} {movies.length === 1 ? "RESULT" : "RESULTS"}{" "}
                FOUND
              </span>
              {movies.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors opacity-70 hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </button>
              )}
            </div>

            {movies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center sm:justify-items-start">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="w-full flex justify-center sm:justify-start"
                  >
                    <MovieItem
                      movie={movie}
                      onToggleWatched={toggleWatched}
                      onRemove={removeMovie}
                      onUpdate={updateMovie}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <MovieListEmpty isSearch={!!searchQuery} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
