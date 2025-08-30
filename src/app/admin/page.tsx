import React from 'react';
import { getCurrentUser } from '@/libs/auth';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import BotonGrandeProps from '@/components/ButonGrande';


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
      <div className='flex flex-col 
      bg-[#FFFFDE] 
      p-5 
      mt-3 
      rounded-md 
      border-7 
      border-b-amber-900
      border-r-amber-900
      border-t-amber-300
      border-l-amber-300'>
        <BotonGrandeProps url='/admin/users' text='Usuarios' />
        <BotonGrandeProps url='/admin/posts' text='Posts' />
        <BotonGrandeProps url='/admin/portfolio' text='Portfolio' />
        <BotonGrandeProps url='/admin/university' text='Universidad' />
      </div>
    </div>
  );
}