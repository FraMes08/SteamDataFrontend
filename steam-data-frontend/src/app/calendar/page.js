// app/calendar/page.js
import { fetchCalendarData } from '@/lib/deals-api'; 
import ReleaseCard from '../../components/ReleaseCard';
import Header from '../../components/Header'; 

// Server Component Async
export default async function CalendarPage() {
  let releaseGames = [];
  let error = null;

  try {
    // Carica i dati ordinati per data di rilascio
    releaseGames = await fetchCalendarData(50);
  } catch (err) {
    error = err.message || "Si è verificato un errore sconosciuto nel caricamento del calendario.";
  }
  
  // Filtriamo i risultati in due sezioni per chiarezza: Appena Usciti e Prossime Uscite
  const now = Date.now() / 1000; // Tempo corrente in secondi
  
  const recentReleases = releaseGames
    .filter(game => game.releaseDate && game.releaseDate <= now)
    .slice(0, 15); // Mostra solo gli ultimi 15 rilasciati

  const upcomingReleases = releaseGames
    .filter(game => game.releaseDate && game.releaseDate > now)
    .sort((a, b) => a.releaseDate - b.releaseDate); // Riordina in senso crescente per "Prossime Uscite"

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header /> 
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-2">🗓 Calendario Uscite Steam</h1>
        <p className="text-gray-400 mb-8">
          Monitora gli ultimi rilasci e le uscite future su Steam.
        </p>

        {error ? (
          <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg text-red-300">
            {error}
          </div>
        ) : (
          <>
            {/* Sezione Prossime Uscite */}
            <h2 className="text-3xl font-bold text-white mt-10 mb-4 border-b border-gray-700 pb-2">🚀 Prossime Uscite ({upcomingReleases.length})</h2>
            {upcomingReleases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingReleases.map((game) => (
                  // Usiamo il dealID come key univoca
                  <ReleaseCard key={game.dealID} game={game} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Nessuna uscita futura trovata al momento.</p>
            )}

            {/* Sezione Rilasci Recenti */}
            <h2 className="text-3xl font-bold text-white mt-10 mb-4 border-b border-gray-700 pb-2">✅ Rilasci Recenti ({recentReleases.length})</h2>
            {recentReleases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentReleases.map((game) => (
                  <ReleaseCard key={game.dealID} game={game} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Nessun rilascio recente trovato.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}