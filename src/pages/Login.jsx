import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = {
  email: '',
  password: '',
  rememberMe: true
};

function Login() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const storedEmail = localStorage.getItem('nf_last_email');
    if (storedEmail) {
      setForm((prev) => ({ ...prev, email: storedEmail }));
    }
  }, []);

  const validate = () => {
    const nextErrors = {};
    if (!form.email) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!form.password) {
      nextErrors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await login({ email: form.email, password: form.password });
      if (form.rememberMe) {
        localStorage.setItem('nf_last_email', form.email);
      } else {
        localStorage.removeItem('nf_last_email');
      }
      const redirectTo = location.state?.from?.pathname || '/home';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setSubmitError(error.message || 'Failed to login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#3b0e0e,_#000)]">
      <div className="w-full max-w-md rounded-md bg-black/80 p-8 shadow-2xl shadow-black/60">
        <h1 className="mb-6 text-3xl font-semibold">Sign In</h1>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm text-neutral-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded bg-neutral-800 px-3 py-2 text-sm outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-netflix-red"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm text-neutral-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded bg-neutral-800 px-3 py-2 text-sm outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-netflix-red"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-300">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-netflix-red focus:ring-netflix-red"
              />
              <span>Remember me</span>
            </label>
            <span className="text-neutral-400">Need help?</span>
          </div>

          {submitError && (
            <p className="rounded bg-red-900/40 px-3 py-2 text-xs text-red-200">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded bg-netflix-red py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-900"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-sm text-neutral-400">
          <p>New to Netflix?</p>
          <Link
            to="/signup"
            className="inline-block w-full rounded bg-neutral-700 py-2 text-center text-sm font-semibold text-white transition hover:bg-neutral-600"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

