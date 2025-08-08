import React from 'react';
import { getCurrentUser } from '@/libs/auth';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'monospace' }}>
      <h1>Panel de Administración</h1>
      <p>Bienvenido, {user.name || user.email}</p>
      <LogoutButton />
      <section style={{ marginTop: 32 }}>
        <h2>Gestión de Usuarios (sencilla)</h2>
        <UserList />
      </section>
      <section style={{ marginTop: 32 }}>
        <h2>Gestión de Posts</h2>
        <p className='mb-2'>Crear, editar o eliminar publicaciones.</p>
        <a href='/admin/posts' className='border px-3 py-1 inline-block'>Ir al administrador de posts</a>
      </section>
    </div>
  );
}

async function fetchUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/users`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

interface AdminUser { _id: string; email: string; role: string; name?: string }
async function UserList() {
  const users: AdminUser[] = await fetchUsers();
  return (
    <ul style={{ listStyle: 'disc', paddingLeft: 24 }}>
      {users.map((u) => (<li key={u._id}>{u.email} - {u.role}</li>))}
    </ul>
  );
}
