// app/calendar/page.js
import { fetchCalendarData } from '@/lib/deals-api'; 
import { fetchRawgRecentReleases } from '@/lib/rawg-api'; // 💡 Importato
import HorizontalGameCard from '../../components/HorizontalGameCard'; 
import Header from '../../components/Header'; 

// Server Component Async
export default async function CalendarPage() {
  let upcomingReleases = [];
  let recentReleases = [];
  let error = null;

  try {
    // 1. Prossime Uscite (CheapShark va bene per il futuro)
    const cheapSharkData = await fetchCalendarData(40);
    const now = Date.now() / 1000;
    
    upcomingReleases = cheapSharkData
        .filter(game => game.releaseDate && game.releaseDate > now)
        .sort((a, b) => a.releaseDate - b.releaseDate)
        .slice(0, 10);

    // 2. Rilasci Recenti (Usa RAWG per precisione su "ultimi 30 giorni")
    // La funzione fetchRawgRecentReleases è già ordinata per data decrescente.
    // Viene recuperato un numero abbondante (40) per poi filtrare.
    const rawRecent = await fetchRawgRecentReleases();

    // 3. Bilanciamento Liste: Prendiamo la lunghezza minima tra le due per averle pari
    const minLength = Math.min(upcomingReleases.length, rawRecent.length, 10); // Max 10 comunque

    upcomingReleases = upcomingReleases.slice(0, minLength);
    recentReleases = rawRecent.slice(0, minLength);

  } catch (err) {
    error = err.message || "Si è verificato un errore sconosciuto nel caricamento del calendario.";
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header /> 
      
      <div className="container mx-auto px-4 py-8">
        
        {/* Intestazione Pagina (Stile Wireframe) */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-700 pb-4">
            <div>
                <h1 className="text-4xl font-extrabold text-blue-400">🗓 Calendario Uscite</h1>
                <p className="text-gray-400 mt-2">Pianifica i tuoi acquisti su Steam.</p>
            </div>
        </div>

        {error ? (
          <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg text-red-300">
            {error}
          </div>
        ) : (
          /* GRID LAYOUT: 2 Colonne su Desktop */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* COLONNA 1: Prossime Uscite (Upcoming) */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    🚀 Giochi in arrivo
                </h2>
                <div className="flex flex-col gap-4">
                    {upcomingReleases.length > 0 ? (
                        upcomingReleases.map((game) => (
                            <HorizontalGameCard key={game.dealID} game={game} />
                        ))
                    ) : (
                        <p className="text-gray-500 italic">Nessuna uscita futura trovata.</p>
                    )}
                </div>
            </div>

            {/* COLONNA 2: Rilasci Recenti (Recent) */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    ✅ Nuovi giochi
                </h2>
                <div className="flex flex-col gap-4">
                    {recentReleases.length > 0 ? (
                        recentReleases.map((game) => (
                            <HorizontalGameCard key={game.dealID} game={game} />
                        ))
                    ) : (
                        <p className="text-gray-500 italic">Nessun rilascio recente trovato.</p>
                    )}
                </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}