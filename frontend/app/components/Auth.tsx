'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // In a real app, store token in localStorage or cookies
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold">Authentication</h2>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md w-full">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Dummy username"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Dummy password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
} 