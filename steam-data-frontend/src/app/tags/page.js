// app/tags/page.js
import Link from 'next/link';
import Header from '../../components/Header'; 

// Lista semplificata dei tag per iniziare
const MAIN_TAGS = [
    { name: 'Azione', slug: 'action' },
    { name: 'Strategia', slug: 'strategy' },
    { name: 'Avventura', slug: 'adventure' },
    { name: 'GDR', slug: 'rpg' },
    { name: 'Simulazione', slug: 'simulation' },
    { name: 'Indie', slug: 'indie' },
    { name: 'Sparatutto', slug: 'shooter' },
    { name: 'Free-to-Play', slug: 'free' },
    { name: 'Horror', slug: 'horror' },
    { name: 'Mondo Aperto', slug: 'open-world' },
];

export default function TagsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header /> 
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-2">🏷 Esplora per Tag</h1>
        <p className="text-gray-400 mb-8">
          Scegli un genere o un tag per vedere i migliori giochi in base al rating Metacritic.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          {MAIN_TAGS.map((tag) => (
            <Link 
              key={tag.slug} 
              href={`/tags/${tag.slug}`}
              className="px-6 py-3 bg-gray-700 hover:bg-blue-600 rounded-lg shadow-md transition duration-200 text-lg font-semibold border-2 border-gray-600 hover:border-blue-500"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}