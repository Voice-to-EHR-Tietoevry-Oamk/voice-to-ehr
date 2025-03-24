'use client';

import Auth from './components/Auth';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Voice-to-EHR</h1>
        <Auth />
      </div>
    </div>
  );
}
