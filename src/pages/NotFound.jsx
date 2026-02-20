import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-center text-white">
      <h1 className="text-6xl font-bold tracking-tight text-netflix-red">404</h1>
      <p className="mt-4 text-lg text-neutral-200">This page could not be found.</p>
      <p className="mt-2 text-sm text-neutral-400">
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="mt-6 rounded bg-netflix-red px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        Go to login
      </Link>
    </div>
  );
}

export default NotFound;

