// app/tags/[tag_slug]/page.js
import { fetchGamesByTag } from '@/lib/deals-api'; 
import GameCard from '../../../components/GameCard'; // Riutilizziamo la card di /sales
import Header from '../../../components/Header'; 

// Server Component (riceve i parametri dinamici)
export default async function TagFilterPage({ params }) {
  const resolvedParams = await params;
  
  const tagSlug = resolvedParams.tag_slug; // Usa l'oggetto risolto

  if (!tagSlug) {
      // Se non c'è lo slug, reindirizza alla pagina principale dei tag o mostra un errore
      return (
          <div className="min-h-screen bg-gray-900 text-white">
              <Header />
              <div className="container mx-auto px-4 py-8 text-center text-red-400">
                  <h1 className="text-3xl">Errore: Tag non specificato.</h1>
                  <p className="mt-4"><a href="/tags" className="text-blue-400 hover:underline">Torna alla lista dei Tag.</a></p>
              </div>
          </div>
      );
  }
  const tagName = tagSlug.charAt(0).toUpperCase() + tagSlug.slice(1);
  
  let games = [];
  let error = null;

  try {
    // Il tagSlug viene usato come termine di ricerca nel titolo
    games = await fetchGamesByTag(tagName, 50); 
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
          Giochi trovati, ordinati per rating Metacritic (dal più alto).
        </p>

        {error ? (
          <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg text-red-300">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {games.length > 0 ? (
              games.map((deal) => (
                <div key={deal.dealID}>
                  {/* Visualizziamo anche il rating Metacritic (è nel campo `metacriticScore` di CheapShark) */}
                  <div className="text-center bg-green-600 text-white font-bold p-1 rounded-t">
                    Rating: {deal.metacriticScore}
                  </div>
                  <GameCard deal={deal} />
                </div>
              ))
            ) : (
              <p className="md:col-span-5 text-center text-gray-400">
                Nessun gioco trovato per il tag "{tagName}" con un rating Metacritic.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}