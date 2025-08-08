import { getCurrentUser } from '@/libs/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import PostEditorForm from '@/components/PostEditorForm';
import { conectionDB } from '@/libs/mongodb';
import Post, { IPost } from '@/models/post';
import slugify from 'slugify';

async function fetchPost(slug: string): Promise<IPost | null> {
  await conectionDB();
  const doc = await Post.findOne({ slug }).lean<IPost>();
  return doc || null;
}

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') redirect('/login');
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) redirect('/admin/posts');
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'monospace' }}>
      <h1>Editar Post</h1>
      <Link href='/admin/posts' className='underline'>Volver</Link>
      <PostEditorForm
        action={updatePost.bind(null, slug)}
        initialTitle={post.title}
        initialContent={post.content}
        initialTags={post.tags || []}
        submitLabel='Actualizar'
      />
    </div>
  );
}

async function updatePost(slug: string, formData: FormData) {
  'use server';
  const title = String(formData.get('title') || '').trim();
  const content = String(formData.get('content') || '').trim();
  const tags = String(formData.get('tags') || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);
  if (!title || !content) redirect('/admin/posts');
  await conectionDB();
  const newSlug = slugify(title, { lower: true, strict: true, trim: true });
  await Post.findOneAndUpdate({ slug }, { title, content, tags, slug: newSlug });
  redirect('/admin/posts');
}
