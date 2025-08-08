"use client";
import React, { useState } from 'react';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  return (
    <button
      onClick={async () => {
        if (loading) return;
        setLoading(true);
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
          window.location.replace('/');
        } finally {
          setLoading(false);
        }
      }}
      className='border px-3 py-1 mt-2'
      disabled={loading}
    >{loading ? 'Cerrando...' : 'Salir'}</button>
  );
}
