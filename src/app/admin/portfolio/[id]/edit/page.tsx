import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/libs/auth';
import PortfolioForm from '@/components/PortfolioForm';
import { IPortfolio } from '@/types/portfolio';

async function getPortfolioItem(id: string): Promise<IPortfolio | null> {
  try {
    // Directamente importamos desde la conexión a la base de datos
    const { Portfolio } = await import('@/models/portfolio');
    const { conectionDB } = await import('@/libs/mongodb');

    await conectionDB();
    const portfolio = await Portfolio.findById(id);
    return portfolio ? JSON.parse(JSON.stringify(portfolio)) : null;
  } catch (error) {
    console.error('Error loading portfolio item:', error);
    return null;
  }
}

type PageProps = {
  params: Promise<{ id: string }>
  // searchParams can be async in Next.js 15, not used here so keep it optional
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EditPortfolioPage(props: PageProps) {
  const { id } = await props.params;
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  const portfolioItem = await getPortfolioItem(id);
  if (!portfolioItem) {
    redirect('/admin/portfolio');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-pokemon mb-8 text-center">Editar Proyecto</h1>
      <PortfolioForm initialData={portfolioItem} isEditing={true} />
    </div>
  );
}
