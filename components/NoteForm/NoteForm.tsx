'use client';

import { useRouter } from 'next/navigation';
import css from './NoteForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useNoteStore } from '../../lib/stores/noteStore';
import { useEffect } from 'react';

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.back();
    },
  });

  
  useEffect(() => {
   
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createNoteMutation.mutate(draft);
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
          className={css.input}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          rows={8}
          value={draft.content}
          onChange={(e) => setDraft({ content: e.target.value })}
          className={css.textarea}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          value={draft.tag}
          onChange={(e) => setDraft({ tag: e.target.value })}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={!draft.title.trim() || createNoteMutation.isPending}
        >
          {createNoteMutation.isPending ? 'Creating...' : 'Create Note'}
        </button>
      </div>
    </form>
  );
}
