// app/tags/[tag_slug]/page.js
import { fetchRawgGamesWithPrices } from '@/lib/rawg-api'; // 💡 Nuova funzione ibrida
import Link from 'next/link';
import GameCard from '../../../components/GameCard'; 
import Header from '../../../components/Header'; 

// Server Component (riceve i parametri dinamici)
export default async function TagFilterPage({ params }) {
  const resolvedParams = await params;
  
  const tagSlug = resolvedParams.tag_slug; 

  if (!tagSlug) {
      return (
          <div className="min-h-screen bg-gray-900 text-white">
              <Header />
              <div className="container mx-auto px-4 py-8 text-center text-red-400">
                  <h1 className="text-3xl">Errore: Tag non specificato.</h1>
                  <p className="mt-4"><Link href="/tags" className="text-blue-400 hover:underline">Torna alla lista dei Tag.</Link></p>
              </div>
          </div>
      );
  }
  const tagName = tagSlug.charAt(0).toUpperCase() + tagSlug.slice(1);
  
  let games = [];
  let error = null;

  try {
    // 💡 Usa la funzione RAWG + CheapShark
    games = await fetchRawgGamesWithPrices(tagSlug); 
  } catch (err) {
    error = err.message || `Impossibile caricare i giochi per il tag ${tagName}.`;
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header /> 
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-2">
          Giochi Tag: {tagName}
        </h1>
        <p className="text-gray-400 mb-8">
          Giochi {tagName} più popolari.
        </p>

        {error ? (
          <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg text-red-300">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {games.length > 0 ? (
              games.map((game, index) => (
                <div key={index}>
                  {/* Rating spostato dentro la card */}
                  <GameCard deal={game} />
                </div>
              ))
            ) : (
              <p className="md:col-span-5 text-center text-gray-400">
                Nessun gioco con prezzo trovato per il tag &quot;{tagName}&quot;.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}