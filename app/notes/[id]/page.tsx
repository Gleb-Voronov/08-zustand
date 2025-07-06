import type { Metadata } from 'next';
import { fetchNoteById } from '@/lib/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { title, content, tag } = await fetchNoteById(Number(id));

  return {
    title: title,
    description: `${tag}: ${content.slice(0, 30)}...`,
    openGraph: {
      title: title,
      description: `${tag}: ${content.slice(0, 30)}...`,
      url: `https://08-zustand-zeta.vercel.app/notes/filter/${id}`,
      images: [
        {
          url: '/notehub-og-meta',
          width: 1200,
          height: 630,
          alt: 'NoteHub styling card',
        },
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub styling card',
        },
      ],
    },
  };
}

const NoteDetails = async ({ params }: Props) => {
  const resolvedParams = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', resolvedParams.id],
    queryFn: () => fetchNoteById(Number(resolvedParams.id)),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
};

export default NoteDetails;
