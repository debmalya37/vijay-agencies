// app/auth/signup/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function SignUpPage() {
  const [form, setForm] = useState({ usermail: '', username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const submit = async () => {
    try {
      const res = await axios.post('/api/auth/signup', form);
      if (res.data.ok) {
        router.push('/auth/signin');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md text-gray-100">
        <h2 className="text-2xl mb-6">Create Account</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        {['usermail','username','password'].map(k => (
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
          onClick={submit}
          className="w-full py-2 bg-green-600 rounded hover:bg-green-500"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
