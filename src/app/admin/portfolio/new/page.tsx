import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/libs/auth';
import PortfolioForm from '@/components/PortfolioForm';

export default async function NewPortfolioPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-pokemon mb-8 text-center">Nuevo Proyecto</h1>
      <PortfolioForm />
    </div>
  );
}
