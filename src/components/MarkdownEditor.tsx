"use client";
import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownEditorProps {
  name: string;
  initialValue?: string;
  label?: string;
  required?: boolean;
  rows?: number;
}

const buttons: { label: string; title: string; insert: (selected: string) => { before: string; after: string; placeholder?: string } }[] = [
  { label: 'B', title: 'Negrita', insert: sel => ({ before: '**', after: '**', placeholder: sel || 'bold' }) },
  { label: 'I', title: 'Cursiva', insert: sel => ({ before: '*', after: '*', placeholder: sel || 'italic' }) },
  { label: 'H1', title: 'Heading 1', insert: sel => ({ before: '# ', after: '', placeholder: sel || 'Título' }) },
  { label: 'H2', title: 'Heading 2', insert: sel => ({ before: '## ', after: '', placeholder: sel || 'Subtítulo' }) },
  { label: 'Link', title: 'Enlace', insert: sel => ({ before: '[', after: `](${sel ? 'url' : 'https://...'})`, placeholder: sel || 'texto' }) },
  { label: 'Code', title: 'Código', insert: sel => ({ before: '`', after: '`', placeholder: sel || 'code' }) },
  { label: 'Lista', title: 'Lista', insert: sel => ({ before: '- ', after: '', placeholder: sel || 'item' }) },
];

export default function MarkdownEditor({ name, initialValue = '', label = 'Contenido', required, rows = 14 }: MarkdownEditorProps) {
  const [value, setValue] = useState(initialValue);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const applyFormat = (ins: typeof buttons[number]) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const { before, after, placeholder } = ins.insert(selected);
    const insertion = before + (selected || placeholder || '') + after;
    const newValue = value.slice(0, start) + insertion + value.slice(end);
    setValue(newValue);
    requestAnimationFrame(() => {
      const pos = start + insertion.length;
      ta.focus();
      ta.setSelectionRange(pos, pos);
    });
  };

  return (
    <div className="markdown-editor border rounded">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 dark:bg-gray-800">
        {buttons.map(b => (
          <button
            key={b.label}
            type="button"
            title={b.title}
            onClick={() => applyFormat(b)}
            className="px-2 py-1 text-xs border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >{b.label}</button>
        ))}
        <button
          type="button"
          onClick={() => setShowPreview(p => !p)}
          className="ml-auto px-2 py-1 text-xs border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >{showPreview ? 'Editar' : 'Preview'}</button>
      </div>
      <div className="p-2">
        <label className="block mb-1 font-semibold" htmlFor={name}>{label}</label>
        {!showPreview && (
          <textarea
            ref={textareaRef}
            id={name}
            name={name}
            required={required}
            rows={rows}
            className="w-full border p-2 font-mono text-sm bg-white dark:bg-gray-900"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        )}
        {showPreview && (
          <div className="prose dark:prose-invert max-w-none border p-3 bg-white dark:bg-gray-900 overflow-auto">
            <ReactMarkdown>{value || '*Sin contenido*'}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
