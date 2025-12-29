import { useState, useEffect, useMemo, useRef } from "react";
import { Info, Plus, Search, Star, Film, Loader2 } from "lucide-react";
import type { Movie, Rating as MovieRating } from "../lib/types";
import { omdb, type OMDbMovie } from "../lib/tmdb";

const StarRating = ({
  value,
  onChange,
  readOnly = false,
  size = "sm",
}: {
  value?: number | null;
  onChange?: (val: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={(e) => {
            e.preventDefault();
            onChange?.(star);
          }}
          className={`${
            readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
          } transition-transform focus:outline-none`}
        >
          <Star
            className={`
              ${
                size === "lg"
                  ? "w-8 h-8"
                  : size === "md"
                  ? "w-6 h-6"
                  : "w-5 h-5"
              } 
              ${
                (value || 0) >= star
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300 dark:text-gray-600"
              }
            `}
          />
        </button>
      ))}
    </div>
  );
};

interface MovieFormProps {
  onAdd: (movie: Partial<Movie> & { name: string }) => void;
}

export function MovieForm({ onAdd }: MovieFormProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<OMDbMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<OMDbMovie | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchMovies = useMemo(
    () => async (input: string) => {
      if (input.length < 2) return;
      setLoading(true);
      try {
        const results = await omdb.searchMovies(input);
        setOptions(results);
        setOpen(true);
      } catch (error) {
        console.error("Failed to search movies", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue && !selectedMovie) {
        fetchMovies(inputValue);
      } else {
        setOptions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, fetchMovies, selectedMovie]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameToUse = selectedMovie ? selectedMovie.Title : inputValue;
    if (!nameToUse.trim()) return;

    let movieData: Partial<Movie> & { name: string } = {
      name: nameToUse,
      rating: (rating as MovieRating) || undefined,
    };

    if (selectedMovie) {
      setLoading(true);
      const details = await omdb.getMovieDetails(selectedMovie.imdbID);
      setLoading(false);

      movieData = {
        ...movieData,
        imdbId: selectedMovie.imdbID,
        releaseDate: selectedMovie.Year,
        posterPath: selectedMovie.Poster,
        description: details?.Plot !== "N/A" ? details?.Plot : undefined,
        imdbRating:
          details?.imdbRating !== "N/A" ? details?.imdbRating : undefined,
      };
    }

    onAdd(movieData);

    // Reset form
    setSelectedMovie(null);
    setInputValue("");
    setRating(null);
    setOptions([]);
    setOpen(false);
  };

  const handleSelect = (movie: OMDbMovie) => {
    setSelectedMovie(movie);
    setInputValue(movie.Title);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSelectedMovie(null);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-2 flex justify-between items-center">
        <h6 className="text-lg font-bold text-gray-900 dark:text-white">
          Add New Movie
        </h6>
        {!import.meta.env.VITE_OMDB_API_KEY && (
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400" />
            <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-gray-800 text-white text-xs rounded hidden group-hover:block z-10">
              Add VITE_OMDB_API_KEY to .env for rich data
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="relative flex-grow" ref={wrapperRef}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => {
                if (options.length > 0) setOpen(true);
              }}
              placeholder="Search by title..."
              className="w-full pl-10 pr-10 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-[#1e1e1e] dark:border-gray-700 dark:text-white dark:placeholder-gray-500 shadow-sm transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {loading && (
                <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
              )}
            </div>
          </div>

          {open && options.length > 0 && (
            <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-100 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-[#1e1e1e]">
              <ul className="max-h-60 overflow-auto py-1">
                {options.map((option) => (
                  <li
                    key={option.imdbID}
                    onClick={() => handleSelect(option)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    {option.Poster && option.Poster !== "N/A" ? (
                      <img
                        src={option.Poster}
                        alt={option.Title}
                        className="w-8 h-12 object-cover rounded bg-gray-200 dark:bg-gray-700 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-12 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-800 shrink-0">
                        <Film className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {option.Title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {option.Year}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="min-w-full md:min-w-[140px]">
          <div className="flex h-[54px] items-center justify-center px-4 rounded-xl border border-gray-200 bg-white dark:bg-[#1e1e1e] dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
            <StarRating size="md" value={rating} onChange={setRating} />
          </div>
        </div>

        <button
          type="submit"
          className="h-[54px] min-w-full md:min-w-[100px] rounded-xl bg-blue-600 px-6 text-base font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add</span>
        </button>
      </div>
    </form>
  );
}
