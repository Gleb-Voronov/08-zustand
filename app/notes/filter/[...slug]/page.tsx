import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import type { Metadata } from 'next';


type Props = {
  params: { slug: string[] }; 
};


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const tag = slug?.[0] || 'all';
  const category = tag === 'all' ? 'All notes' : `Notes in category "${tag}"`;

  const title = `${category} | NoteHub`;
  const description =
    tag === 'all'
      ? 'All notes.'
      : `All notes in "${tag}" NoteHub.`;

  return {
    title: 'Tag notes',
    description: 'Choose tag notes',
    openGraph: {
      title,
      description,
      url: `https://notehub.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub OG Image',
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
