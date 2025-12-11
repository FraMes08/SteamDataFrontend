// app/sales/page.js (AGGIORNATO)
import { fetchSalesDataFromAPI } from '@/lib/deals-api'; 
import GameCard from '../../components/GameCard';
import Header from '../../components/Header'; // Assicurati di importare l'Header

// Server Component Async
export default async function SalesPage() {
  let salesDeals = [];
  let error = null;

  try {
    // Carica i dati prima del rendering (ottieni le prime 40 offerte)
    salesDeals = await fetchSalesDataFromAPI(40);
  } catch (err) {
    // L'errore viene gestito qui
    error = err.message || "Si è verificato un errore sconosciuto durante il caricamento delle offerte.";
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* L'header è incluso qui o nel layout principale */}
      <Header /> 
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-2">🔥 Offerte Live da Steam</h1>
        <p className="text-gray-400 mb-8">
          Offerte attuali fornite tramite CheapShark (filtrate per Steam Store). Non ordinate per popolarità.
        </p>

        {error ? (
          <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg text-red-300">
            <p className="font-bold mb-2">Errore di Caricamento:</p>
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {salesDeals.length > 0 ? (
              salesDeals.map((deal) => (
                <GameCard key={deal.dealID} deal={deal} />
              ))
            ) : (
              <p className="md:col-span-5 text-center text-gray-400">
                Al momento non sono disponibili offerte attive su Steam.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}