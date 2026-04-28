import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router';

/**
 * UI Layer — Register page
 * Design: Minimal, breathable, split-panel (Aether design system)
 */
const Register = () => {
  const { register, loading, error, clearAuthError } = useAuth();

  const [ form, setForm ] = useState({ username: '', email: '', password: '' });
  const [ localError, setLocalError ] = useState('');

  const navigate = useNavigate();

  // Clear API error when user starts typing
  useEffect(() => {
    if (error) clearAuthError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ form.username, form.email, form.password ]);

  const handleChange = (e) => {
    setLocalError('');
    setForm((prev) => ({ ...prev, [ e.target.name ]: e.target.value }));
  };

  const validate = () => {
    if (!form.username.trim()) return 'Username is required';
    if (!form.email.includes('@')) return 'Enter a valid email';
    if (form.password.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setLocalError(err);
      return;
    }
    register(form);
    navigate("/");
  };

  const displayError = localError || error;

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
            Create account
          </h1>
          <p className="text-[#737373] text-sm mb-10">
            Join the quiet. Start sharing.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Username */}
            <div>
              <label
                htmlFor="reg-username"
                className="block text-xs text-[#737373] mb-1.5 tracking-wide uppercase"
              >
                Username
              </label>
              <input
                id="reg-username"
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

            {/* Email */}
            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs text-[#737373] mb-1.5 tracking-wide uppercase"
              >
                Email
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-[#f5f5f5] text-[#111] placeholder-[#c0c0c0] text-sm px-4 py-3.5 outline-none border-b-2 border-transparent focus:border-[#111] transition-colors duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="reg-password"
                className="block text-xs text-[#737373] mb-1.5 tracking-wide uppercase"
              >
                Password
              </label>
              <input
                id="reg-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#f5f5f5] text-[#111] placeholder-[#c0c0c0] text-sm px-4 py-3.5 outline-none border-b-2 border-transparent focus:border-[#111] transition-colors duration-200"
              />
              <p className="text-[#b0b0b0] text-xs mt-1.5">Minimum 8 characters</p>
            </div>

            {/* Error */}
            {displayError && (
              <p className="text-[#ba1a1a] text-xs pt-1">{displayError}</p>
            )}

            {/* CTA */}
            <button
              type="submit"
              disabled={loading || !form.username || !form.email || !form.password}
              className="w-full bg-[#111] text-white text-sm font-medium py-3.5 mt-2 tracking-wide disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2a2a2a] transition-colors duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin" />
                  Creating…
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-sm text-[#737373]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#111] underline underline-offset-4 hover:text-[#444] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;