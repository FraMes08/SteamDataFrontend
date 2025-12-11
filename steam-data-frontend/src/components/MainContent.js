export default function MainContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Card 1: Offerte del Giorno */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-blue-400 mb-4">🔥 Offerte del Giorno</h2>
        <p className="text-gray-400">Qui caricherai e mostrerai i giochi in saldo. Per esempio, usando le API per ottenere le attuali promozioni.</p>
        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150">
          Vedi tutto
        </button>
      </div>

      {/* Card 2: Nuove Uscite Popolari */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-blue-400 mb-4">✨ Nuove Uscite</h2>
        <p className="text-gray-400">Elenco dei giochi rilasciati recentemente che hanno ricevuto recensioni positive.</p>
        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150">
          Esplora
        </button>
      </div>
      
      {/* Card 3: Giochi Più Giocati Ora */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-blue-400 mb-4">📊 Più Giocati</h2>
        <p className="text-gray-400">Mostra le statistiche in tempo reale dei giochi più popolari su Steam in questo momento.</p>
        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150">
          Statistiche
        </button>
      </div>
    </div>
  );
}