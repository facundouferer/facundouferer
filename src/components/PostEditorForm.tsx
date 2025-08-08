"use client";
import React, { useState } from 'react';
import MarkdownEditor from '@/components/MarkdownEditor';

interface PostEditorFormProps {
  action: (formData: FormData) => void; // server action passed from parent
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  submitLabel?: string;
}

export default function PostEditorForm({ action, initialTitle = '', initialContent = '', initialTags = [], submitLabel = 'Guardar' }: PostEditorFormProps) {
  const [tagsInput, setTagsInput] = useState(initialTags.join(', '));
  return (
    <form action={action} className='space-y-4 mt-6'>
      <div>
        <label className='block mb-1'>Título</label>
        <input name='title' defaultValue={initialTitle} required className='border p-2 w-full' />
      </div>
      <MarkdownEditor name='content' initialValue={initialContent} required label='Contenido (Markdown)' />
      <div>
        <label className='block mb-1'>Tags (separadas por coma)</label>
        <input
          name='tags'
          value={tagsInput}
          onChange={e => setTagsInput(e.target.value)}
          className='border p-2 w-full'
          placeholder='blog, personal'
        />
      </div>
      <button className='border px-4 py-2'>{submitLabel}</button>
    </form>
  );
}
