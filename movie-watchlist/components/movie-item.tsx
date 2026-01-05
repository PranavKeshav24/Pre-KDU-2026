import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Star, X, CheckCircle, Circle, Trash } from "lucide-react";
import type { Movie, Rating as RatingType } from "../lib/types";
import { omdb } from "../lib/tmdb";

const StarRating = ({
  value,
  onChange,
  readOnly = false,
  size = "sm",
}: {
  value?: number;
  onChange?: (val: number) => void;
  readOnly?: boolean;
  size?: "sm" | "lg";
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={(e) => {
            e.stopPropagation();
            onChange?.(star);
          }}
          className={`${
            readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
          } transition-transform focus:outline-none`}
        >
          <Star
            className={`
              ${size === "lg" ? "w-8 h-8" : "w-3.5 h-3.5"} 
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

interface MovieItemProps {
  movie: Movie;
  onToggleWatched: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Movie>) => void;
}

export function MovieItem({
  movie,
  onToggleWatched,
  onRemove,
  onUpdate,
}: MovieItemProps) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(movie.notes || "");
  const [rating, setRating] = useState<RatingType | undefined>(movie.rating);
  const [hovered, setHovered] = useState(false);
  const [counter, setCounter] = useState(60);

  function timer () {
    useEffect(() => {
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
      }, [counter]);
    
  }
  const handleOpen = () => {
    setNotes(movie.notes || "");
    setRating(movie.rating);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    onUpdate(movie.id, { notes, rating });
    setOpen(false);
  };

  const posterUrl = omdb.getImageUrl(movie.posterPath || "");
  const releaseYear = movie.releaseDate ? movie.releaseDate : null;
  const [timeLeft, setTimeLeft] = useState(10);
  const [isRunning, setIsRunning] = useState(false)

  const startCountdown = () => {
    setHovered(true);
    if (timeLeft === 0) {
      // Redirect to a premium content page
      window.location.href = "/premium-content-1";
    }
  };
  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -4, transition: { duration: 0.18 } }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={handleOpen}
        className="group relative flex h-[320px] min-w-[180px] max-w-[220px] cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-[#1e1e1e] dark:hover:border-blue-700 w-full"
      >
        <div
          className="relative pt-[120%] bg-gray-100 dark:bg-gray-800 bg-cover bg-center"
          style={{ backgroundImage: posterUrl ? `url(${posterUrl})` : "none" }}
        >
          {!posterUrl && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
              <span className="font-bold text-gray-500 dark:text-gray-400 line-clamp-2">
                {movie.name}
              </span>
            </div>
          )}

          <div
            className={`absolute inset-0 flex flex-col justify-end p-2 transition-opacity duration-300 ${
              hovered ? "opacity-100" : "opacity-0"
            } bg-gradient-to-t from-black/80 via-transparent to-transparent`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatched(movie.id);
              }}
              className={`flex w-full items-center justify-center gap-2 rounded px-2 py-1.5 text-xs font-medium shadow-sm transition-colors ${
                movie.isWatched
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-white text-gray-900 hover:bg-gray-50"
              }`}
            >
              {movie.isWatched ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
              {movie.isWatched ? "Watched" : "Mark Watched"}
            </button>

            {/* Add countdown when hovered on a premium title */}
            {movie.isPremium && (
              <button className="absolute px-2 py-1 top-2 left-2 z-10 flex items-center justify-center rounded-full bg-yellow-800 shadow-md" onClick={}>
                Start countdown
              </button>
            )}
          </div>

          {movie.isWatched && (
            <div className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-green-600 shadow-md">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}

        </div>

        <div className="flex flex-1 flex-col gap-1 p-3">
          <div>
            <h3 className="line-clamp-2 text-base font-bold leading-tight text-gray-900 dark:text-white">
              {movie.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {releaseYear || "Unknown Year"}
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between">
            {movie.rating ? (
              <div className="flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 dark:bg-amber-900/20">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-600 dark:text-amber-500">
                  {movie.rating}
                </span>
              </div>
            ) : (
              <span className="text-xs italic text-gray-400">No rating</span>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(movie.id);
              }}
              className={`text-red-500 transition-all duration-200 hover:text-red-600 ${
                hovered
                  ? "translate-x-0 opacity-100"
                  : "translate-x-2 opacity-0"
              }`}
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ margin: 0 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#1e1e1e] flex flex-col md:flex-row max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative md:w-2/5 bg-black h-[200px] md:h-auto shrink-0">
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={movie.name}
                    className="h-full w-full object-cover opacity-90"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-8 text-center text-white">
                    <h2 className="text-2xl font-bold">{movie.name}</h2>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
              </div>

              <div className="flex flex-1 flex-col p-6 md:p-10 overflow-y-auto">
                <div className="mb-8">
                  <span
                    className={`inline-block mb-3 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      movie.isWatched
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {movie.isWatched ? "Watched" : "To Watch"}
                  </span>
                  <h2 className="mb-2 text-3xl md:text-4xl font-extrabold leading-tight text-gray-900 dark:text-white">
                    {movie.name}
                  </h2>
                  <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                    {releaseYear}
                  </p>
                </div>

                <div className="mb-8">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Your Rating
                  </span>
                  <StarRating
                    size="lg"
                    value={rating}
                    onChange={(val) => setRating(val as RatingType)}
                  />
                </div>

                <div className="flex-1 min-h-0 mb-8">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Notes
                  </span>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write your thoughts..."
                    className="w-full rounded-xl bg-gray-50 p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/5 dark:text-white dark:placeholder-gray-500 resize-none"
                  />{" "}
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <button
                    onClick={() => {
                      onRemove(movie.id);
                      handleClose();
                    }}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="font-medium">Remove Movie</span>
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="rounded-lg bg-blue-600 px-6 py-2 font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-600/40 active:transform active:scale-95 transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
