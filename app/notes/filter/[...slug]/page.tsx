import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

type Props = {
  params: Promise<{ slug: string[] }>;
};


export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tag = slug[0];

  return {
    title: `Notes sorted in "${tag}" category`,
    description: `This page include all your notes in "${tag}" category`,
    openGraph: {
      title: `Notes sorted in "${tag}" category`,
      description: `This page include all your notes in "${tag}" category`,
      url: `https://08-zustand-zeta.vercel.app/notes/filter/${tag}`,
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


const NotesByCategory = async ({ params }: Props) => {
  const { slug } = await params;
  const category = slug[0] === 'all' ? undefined : slug[0];
  const data = await fetchNotes('', 1, category);

  return (
    <div>
      <NotesClient initialData={data} tag={category} />
    </div>
  );
};

export default NotesByCategory;
