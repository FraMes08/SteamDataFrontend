import Header from '../components/Header';
import MainContent from '../components/MainContent'; // Componente placeholder per il contenuto principale

// La tua API Key (è meglio gestirla tramite variabili d'ambiente in un progetto reale!)
const STEAM_API_KEY = 'CB695349A8A7F54F4F940A31431AEAD4';

export default function HomePage() {
  // Nota: Per un'applicazione Next.js moderna, i dati verranno probabilmente
  // caricati direttamente in questo componente (se è un Server Component)
  // o in un componente figlio.

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* L'API Key NON deve essere passata così se il componente viene renderizzato sul client!
          Usala solo per chiamate API sul lato server. */}
      <Header apiKey={STEAM_API_KEY} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Benvenuto su SteamDB Clone</h1>
        
        {/* Qui andranno i componenti per mostrare i dati di Steam, ad esempio "Giochi in Evidenza" o "Offerte del Giorno" */}
        <MainContent />
      </main>

      {/* Puoi aggiungere un Footer se necessario */}
    </div>
  );
}