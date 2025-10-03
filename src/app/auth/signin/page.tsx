// app/auth/signin/page.tsx
'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleCredentials = async () => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        identifier: form.identifier,
        password: form.password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push('/');
      }
    } catch {
      setError('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch {
      setError('Google sign-in failed');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCredentials();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Sign in to your account
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Enter your credentials to continue
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email or Username
              </label>
              <input
                type="text"
                value={form.identifier}
                onChange={(e) => setForm(f => ({ ...f, identifier: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="mx-3 text-gray-400 text-sm">or continue with</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition"
          >
            {googleLoading ? 'Connecting...' : (
              <>
                <img src="/google-logo.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
              </>
            )}
          </button>

          {/* Links */}
          <div className="mt-6 flex justify-between text-sm text-gray-500">
            <button
              onClick={() => router.push('/auth/signup')}
              className="hover:text-indigo-600 transition"
            >
              Sign up
            </button>
            <button
              onClick={() => console.log('Forgot password clicked')}
              className="hover:text-indigo-600 transition"
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
