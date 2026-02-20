import { useEffect, useMemo, useState } from 'react';
import MovieCard from '../components/MovieCard.jsx';
import Spinner from '../components/Spinner.jsx';
import { searchMovies } from '../services/omdbService.js';

const SKELETON_ITEMS = Array.from({ length: 10 });

function Home() {
  const [query, setQuery] = useState('avengers');
  const [debouncedQuery, setDebouncedQuery] = useState('avengers');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 500);

    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      if (!debouncedQuery) {
        setMovies([]);
        setError('');
        return;
      }
      try {
        setIsLoading(true);
        setError('');
        const results = await searchMovies(debouncedQuery);
        if (!isCancelled) {
          setMovies(results);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Failed to fetch movies.');
          setMovies([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  const hasResults = useMemo(() => movies && movies.length > 0, [movies]);

  return (
    <div className="container-xl pb-16">
      <section className="mt-6 space-y-4 md:mt-10 md:space-y-6">
        <div className="max-w-xl space-y-3">
          <h1 className="text-3xl font-semibold md:text-4xl">Welcome back</h1>
          <p className="text-sm text-neutral-300 md:text-base">
            Search for your favorite movies powered by the OMDB API, wrapped in a Netflix-inspired
            experience.
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:mt-6 md:flex-row md:items-center md:gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for a movie..."
              className="w-full rounded bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-netflix-red md:text-base"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-neutral-400 md:text-sm">
              Press Enter or wait
            </span>
          </div>
        </div>
      </section>

      <section className="mt-6 md:mt-8">
        <div className="mb-3 flex items-center justify-between text-sm text-neutral-300 md:mb-4">
          <p>
            Showing results for{' '}
            <span className="font-semibold text-white">
              {debouncedQuery || '—'}
            </span>
          </p>
          {hasResults && (
            <p className="hidden text-xs text-neutral-400 sm:inline">
              {movies.length} movie{movies.length === 1 ? '' : 's'} found
            </p>
          )}
        </div>

        {isLoading && (
          <>
            <Spinner />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {SKELETON_ITEMS.map((_, index) => (
                <div
                  key={index}
                  className="h-48 animate-pulse rounded-md bg-neutral-800/80 sm:h-60 md:h-64"
                />
              ))}
            </div>
          </>
        )}

        {!isLoading && error && (
          <div className="mt-6 rounded border border-red-700 bg-red-900/20 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {!isLoading && !error && !hasResults && debouncedQuery && (
          <p className="mt-6 text-sm text-neutral-300">
            No movies found for <span className="font-semibold text-white">{debouncedQuery}</span>.
            Try another search term.
          </p>
        )}

        {!isLoading && hasResults && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;

