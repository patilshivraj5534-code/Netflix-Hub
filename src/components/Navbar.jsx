import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-20 bg-gradient-to-b from-black/90 via-black/80 to-transparent">
      <nav className="container-xl flex items-center justify-between py-3">
        <Link to="/home" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-netflix-red flex items-center justify-center font-black text-lg">
            N
          </div>
          <span className="text-2xl font-semibold tracking-tight text-netflix-red">Netflix</span>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden text-sm text-neutral-300 sm:inline">
              Signed in as <span className="font-medium text-white">{user.email}</span>
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded bg-netflix-red px-4 py-2 text-sm font-semibold text-white shadow-md shadow-netflix-red/40 transition hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/60"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

