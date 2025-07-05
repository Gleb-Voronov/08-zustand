import { fetchNoteById } from '@/lib/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import type { Metadata } from 'next';

type NoteDetailsProps = {
  params: { id: string }; 
};

export async function generateMetadata({ params }: NoteDetailsProps): Promise<Metadata> {
  const note = await fetchNoteById(Number(params.id));

  const title = `${note.title} | NoteHub`;
  const description = note.content.length > 100
    ? note.content.slice(0, 100) + '...'
    : note.content;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.vercel.app/notes/${params.id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub Note Image',
        },
      ],
    },
  };
} 
const NoteDetails = async ({ params }: NoteDetailsProps) => {
  const queryClient = new QueryClient();
  const response = await params;

  await queryClient.prefetchQuery({
    queryKey: ['note', response.id],
    queryFn: () => fetchNoteById(Number(response.id)),
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetailsClient />
      </HydrationBoundary>
    </div>
  );
};

export default NoteDetails;
