import Header from '../components/Header';
import HorizontalGameCard from '../components/HorizontalGameCard';
import { fetchMostPlayed, fetchPopularNewReleases, fetchTrending, enrichDealsWithRawg } from '../lib/rawg-api';
import { fetchSalesDataFromAPI } from '../lib/deals-api';

// Helper component per le sezioni
function GameSection({ title, games, color }) {
  const badgeColors = {
    blue: "bg-blue-900 text-blue-300 border-blue-700",
    green: "bg-green-900 text-green-300 border-green-700",
    purple: "bg-purple-900 text-purple-300 border-purple-700",
    red: "bg-red-900 text-red-300 border-red-700"
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        {title}
      </h2>
      <div className="flex flex-col gap-4">
        {games.length > 0 ? (
          games.map((game, i) => (
             // Usiamo dealID se c'è, altrimenti una chiave unica fallback
             <HorizontalGameCard key={game.dealID || `game-${i}-${game.title}`} game={game} />
          ))
        ) : (
          <p className="text-gray-500 italic">Nessun gioco trovato.</p>
        )}
      </div>
    </div>
  );
}

export default async function HomePage() {
  // 1. Fetch prioritario per Highest Sales (CheapShark) + Arricchimento RAWG
  // Copiamo la logica della pagina /sales come richiesto (ordinamento default: dealrating)
  const rawHighestSales = await fetchSalesDataFromAPI(10); 
  const highestSales = await enrichDealsWithRawg(rawHighestSales);

  // 2. Fetch parallelo delle altre sezioni
  const [mostPlayed, popular, trending] = await Promise.all([
      fetchMostPlayed(10),
      fetchPopularNewReleases(10),
      fetchTrending(10)
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        
        {/* Intestazione */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-700 pb-4">
            <div>
                <h1 className="text-4xl font-extrabold text-blue-400">🏠 Home Dashboard</h1>
                <p className="text-gray-400 mt-2">Le tendenze e le migliori offerte, tutto in un colpo d'occhio.</p>
            </div>
        </div>

        {/* GRIGLIA 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            
            {/* QUADRANTE 1: Most Played */}
            <GameSection 
                title="🔥 Top 10 Most Played" 
                games={mostPlayed} 
                color="blue"
            />

            {/* QUADRANTE 2: Popular Releases */}
            <GameSection 
                title="💎 Popular Releases" 
                games={popular} 
                color="purple"
            />

            {/* QUADRANTE 3: Highest Sales */}
            <GameSection 
                title="📉 Highest Sales" 
                games={highestSales} 
                color="green"
            />

            {/* QUADRANTE 4: Trending */}
            <GameSection 
                title="📈 Trending Now" 
                games={trending} 
                color="red"
            />
            
        </div>
      </div>
    </div>
  );
}