import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner.jsx';
import { getMovieById } from '../services/omdbService.js';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError('');
        const data = await getMovieById(id);
        if (!isCancelled) {
          setMovie(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Failed to fetch movie details.');
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
  }, [id]);

  if (isLoading) {
    return (
      <div className="container-xl pb-10">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-xl pb-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-neutral-300 hover:text-white"
        >
          ← Back
        </button>
        <div className="rounded border border-red-700 bg-red-900/20 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container-xl pb-10">
        <p className="mt-6 text-sm text-neutral-300">Movie not found.</p>
      </div>
    );
  }

  return (
    <div className="container-xl pb-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-neutral-300 hover:text-white"
      >
        ← Back
      </button>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)] md:items-start">
        <div className="overflow-hidden rounded-md bg-neutral-900 shadow-lg shadow-black/70">
          {movie.Poster && movie.Poster !== 'N/A' ? (
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-80 items-center justify-center text-sm text-neutral-400">
              No image
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold md:text-3xl">{movie.Title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-300">
              {movie.Year && <span>{movie.Year}</span>}
              {movie.Runtime && (
                <>
                  <span>•</span>
                  <span>{movie.Runtime}</span>
                </>
              )}
              {movie.Rated && (
                <>
                  <span>•</span>
                  <span>{movie.Rated}</span>
                </>
              )}
            </div>
          </div>

          {movie.imdbRating && movie.imdbRating !== 'N/A' && (
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-3 py-1 text-sm text-yellow-300">
              <span className="text-base">★</span>
              <span className="font-semibold">{movie.imdbRating}</span>
              <span className="text-xs text-neutral-300">IMDB</span>
            </div>
          )}

          {movie.Plot && movie.Plot !== 'N/A' && (
            <p className="text-sm leading-relaxed text-neutral-200 md:text-base">{movie.Plot}</p>
          )}

          <dl className="space-y-2 text-sm text-neutral-200 md:text-base">
            {movie.Genre && movie.Genre !== 'N/A' && (
              <div>
                <dt className="font-semibold text-neutral-100">Genre</dt>
                <dd className="text-neutral-300">{movie.Genre}</dd>
              </div>
            )}
            {movie.Actors && movie.Actors !== 'N/A' && (
              <div>
                <dt className="font-semibold text-neutral-100">Actors</dt>
                <dd className="text-neutral-300">{movie.Actors}</dd>
              </div>
            )}
            {movie.Director && movie.Director !== 'N/A' && (
              <div>
                <dt className="font-semibold text-neutral-100">Director</dt>
                <dd className="text-neutral-300">{movie.Director}</dd>
              </div>
            )}
          </dl>

          <div className="pt-2 text-sm text-neutral-400">
            <span>Data from </span>
            <Link
              to="https://www.omdbapi.com/"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-200 underline"
            >
              OMDB
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;

