import { getCurrentUser } from '@/libs/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { conectionDB } from '@/libs/mongodb';
import Post, { IPost } from '@/models/post';

type AdminPost = { _id: string; title: string; slug: string };

async function fetchPosts(): Promise<AdminPost[]> {
  await conectionDB();
  const docs = await Post.find({}, 'title slug').sort({ createdAt: -1 }).lean<IPost[]>();
  return docs.map(d => ({ _id: String(d._id), title: d.title, slug: d.slug }));
}

export default async function AdminPostsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') redirect('/login');
  const posts = await fetchPosts();
  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'monospace' }}>
      <h1>Posts</h1>
      <div className='my-4 flex gap-3'>
        <Link href='/admin' className='underline'>Volver</Link>
        <Link href='/admin/posts/new' className='px-3 py-1 border'>Nuevo Post</Link>
      </div>
      <table className='w-full text-sm border-collapse'>
        <thead>
          <tr className='bg-gray-200 dark:bg-gray-700'>
            <th className='border p-2 text-left'>Título</th>
            <th className='border p-2 text-left'>Slug</th>
            <th className='border p-2'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p._id} className='hover:bg-gray-50 dark:hover:bg-gray-800'>
              <td className='border p-2'>{p.title}</td>
              <td className='border p-2'>{p.slug}</td>
              <td className='border p-2 space-x-2'>
                <Link className='underline' href={`/admin/posts/${p.slug}/edit`}>Editar</Link>
                <form action={`/admin/posts/${p.slug}/delete`} method='post' style={{ display: 'inline' }}>
                  <DeleteButton slug={p.slug} />
                </form>
              </td>
            </tr>))}
        </tbody>
      </table>
    </div>
  );
}

function DeleteButton({ slug }: { slug: string }) {
  return (
    <button formAction={async () => {
      'use server';
      await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/posts/${slug}`, { method: 'DELETE', headers: { 'X-API-KEY': process.env.API_SECRET_KEY || '' } });
      redirect('/admin/posts');
    }} className='text-red-600 underline'>Eliminar</button>
  );
}
