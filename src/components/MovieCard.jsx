import { useNavigate } from 'react-router-dom';

function MovieCard({ movie }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.imdbID}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative overflow-hidden rounded-md bg-neutral-900/80 shadow-lg shadow-black/60 transition hover:-translate-y-1 hover:scale-[1.03] hover:bg-neutral-800/90 hover:shadow-xl hover:shadow-black"
    >
      <div className="aspect-[2/3] w-full overflow-hidden bg-neutral-800">
        {movie.Poster && movie.Poster !== 'N/A' ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110 group-hover:opacity-80"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
            No image
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition group-hover:opacity-90" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 px-3 pb-3 pt-8 text-left">
        <h3 className="line-clamp-2 text-sm font-semibold md:text-base">{movie.Title}</h3>
        <p className="text-xs text-neutral-300 md:text-sm">{movie.Year}</p>
      </div>
    </button>
  );
}

export default MovieCard;

