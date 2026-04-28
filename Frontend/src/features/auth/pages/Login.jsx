import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router';


/**
 * UI Layer — Login page
 * Design: Minimal, breathable, split-panel (Aether design system)
 */
const Login = () => {
  const { login, loading, error, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const [ form, setForm ] = useState({ username: '', password: '' });

  // Clear API error when user starts typing
  useEffect(() => {
    if (error) clearAuthError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ form.username, form.password ]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [ e.target.name ]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex font-['Inter',sans-serif] bg-white">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 border-r border-[#f0f0f0]">
        {/* Wordmark */}
        <span className="text-[#111] text-lg font-semibold tracking-tight">
          MINIMA
        </span>

        {/* Centre tagline */}
        <div>
          <p className="text-[#737373] text-sm italic leading-relaxed max-w-xs">
            &ldquo;The quieter you become,<br />
            the more you can hear.&rdquo;
          </p>
        </div>

        {/* Bottom tagline */}
        <p className="text-[#b0b0b0] text-xs tracking-widest uppercase">
          Connect in the quiet.
        </p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm">
          {/* Mobile wordmark */}
          <span className="block lg:hidden text-[#111] text-lg font-semibold tracking-tight mb-12">
            MINIMA
          </span>

          <h1 className="text-[#111] text-2xl font-semibold tracking-tight mb-2">
            Sign in
          </h1>
          <p className="text-[#737373] text-sm mb-10">
            Welcome back. Good to see you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs text-[#737373] mb-1.5 tracking-wide uppercase"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={form.username}
                onChange={handleChange}
                placeholder="your_username"
                className="w-full bg-[#f5f5f5] text-[#111] placeholder-[#c0c0c0] text-sm px-4 py-3.5 outline-none border-b-2 border-transparent focus:border-[#111] transition-colors duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs text-[#737373] mb-1.5 tracking-wide uppercase"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#f5f5f5] text-[#111] placeholder-[#c0c0c0] text-sm px-4 py-3.5 outline-none border-b-2 border-transparent focus:border-[#111] transition-colors duration-200"
              />
            </div>

            {/* API Error */}
            {error && (
              <p className="text-[#ba1a1a] text-xs pt-1">{error}</p>
            )}

            {/* CTA */}
            <button
              type="submit"
              disabled={loading || !form.username || !form.password}
              className="w-full bg-[#111] text-white text-sm font-medium py-3.5 mt-2 tracking-wide disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2a2a2a] transition-colors duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-sm text-[#737373]">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-[#111] underline underline-offset-4 hover:text-[#444] transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;