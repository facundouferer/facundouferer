import { getCurrentUser } from '@/libs/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import PostEditorForm from '@/components/PostEditorForm';
import { conectionDB } from '@/libs/mongodb';
import Post from '@/models/post';
import slugify from 'slugify';

export default async function NewPostPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') redirect('/login');
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'monospace' }}>
      <h1>Nuevo Post</h1>
      <Link href='/admin/posts' className='underline'>Volver</Link>
      <PostEditorForm action={createPost} submitLabel='Guardar' />
    </div>
  );
}

async function createPost(formData: FormData) {
  'use server';
  const title = String(formData.get('title') || '').trim();
  const content = String(formData.get('content') || '').trim();
  const tags = String(formData.get('tags') || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);
  if (!title || !content) redirect('/admin/posts');
  await conectionDB();
  const doc = new Post({
    title,
    content,
    slug: slugify(title, { lower: true, strict: true, trim: true }),
    tags
  });
  await doc.save();
  redirect('/admin/posts');
}
