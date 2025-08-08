"use client";
import React, { useState } from 'react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = fd.get('email');
    const password = fd.get('password');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || '/admin';
        window.location.replace(redirect);
      } else {
        const data = await res.json();
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch {
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'monospace' }}>
      <h1>Login</h1>
      <form id="login-form" className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required className="block w-full border p-2" />
        </div>
        <div>
          <label className="block mb-1" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full border p-2" />
        </div>
        {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
        <button disabled={loading} className="border px-4 py-2 mt-2 disabled:opacity-50">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
