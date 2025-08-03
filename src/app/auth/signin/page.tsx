// app/auth/signin/page.tsx
'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [form, setForm] = useState({ usermail: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCredentials = async () => {
    const res = await signIn<'credentials'>('credentials', {
      redirect: false,
      usermail: form.usermail,
      password: form.password,
    });
    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md text-gray-100">
        <h2 className="text-2xl mb-6">Sign In</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        {['usermail','password'].map(k => (
          <div key={k} className="mb-4">
            <label className="block mb-1 capitalize">{k}</label>
            <input
            title='input'
              type={k==='password' ? 'password' : 'text'}
              value={(form as any)[k]}
              onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>
        ))}

        <button
          onClick={handleCredentials}
          className="w-full py-2 bg-blue-600 rounded hover:bg-blue-500 mb-4"
        >
          Sign In
        </button>

        <button
          onClick={() => signIn('google')}
          className="w-full py-2 bg-red-600 rounded hover:bg-red-500"
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
}
