import { Clapperboard, SearchX } from "lucide-react";

export function MovieListEmpty({ isSearch }: { isSearch?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center opacity-80">
      <div className="mb-3 flex rounded-full bg-black/5 p-4 dark:bg-white/5">
        {isSearch ? (
          <SearchX className="h-12 w-12 text-gray-500 opacity-50 dark:text-gray-400" />
        ) : (
          <Clapperboard className="h-12 w-12 text-gray-500 opacity-50 dark:text-gray-400" />
        )}
      </div>
      <h5 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
        {isSearch ? "No matches found" : "Your collection is empty"}
      </h5>
      <p className="mb-4 max-w-[300px] text-base leading-relaxed text-gray-500 dark:text-gray-400">
        {isSearch
          ? "We couldn't find any movies matching your search. Try a different keyword."
          : "Start building your personal movie library by adding a title above."}
      </p>
    </div>
  );
}