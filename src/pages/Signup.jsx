import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
};

function Signup() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) {
      nextErrors.name = 'Name is required.';
    }
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
    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your password.';
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password
      });
      navigate('/home', { replace: true });
    } catch (error) {
      setSubmitError(error.message || 'Failed to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#3b0e0e,_#000)]">
      <div className="w-full max-w-md rounded-md bg-black/80 p-8 shadow-2xl shadow-black/60">
        <h1 className="mb-6 text-3xl font-semibold">Sign Up</h1>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm text-neutral-300">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded bg-neutral-800 px-3 py-2 text-sm outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-netflix-red"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
          </div>

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
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded bg-neutral-800 px-3 py-2 text-sm outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-netflix-red"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-sm text-neutral-300">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded bg-neutral-800 px-3 py-2 text-sm outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-netflix-red"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          {submitError && (
            <p className="rounded bg-red-900/40 px-3 py-2 text-xs text-red-200">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded bg-netflix-red py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-900"
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-sm text-neutral-400">
          Already have an account?{' '}
          <Link to="/" className="text-white hover:underline">
            Sign in.
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;

