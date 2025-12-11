// app/components/ReleaseCard.js
import Image from 'next/image';

const formatDate = (timestamp) => {
  if (!timestamp) return 'Data Sconosciuta';
  
  // CheapShark fornisce il timestamp in secondi (non millisecondi)
  const date = new Date(timestamp * 1000); 
  
  // Opzioni per la formattazione
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  return date.toLocaleDateString('it-IT', options);
};

export default function ReleaseCard({ game }) {
  const releaseDate = formatDate(game.releaseDate);
  const isReleased = game.releaseDate && (game.releaseDate * 1000) <= Date.now();
  
  // Otteniamo solo l'anno o un placeholder per il prezzo
  const priceDisplay = parseFloat(game.normalPrice) > 0 
    ? `$${parseFloat(game.normalPrice).toFixed(2)}`
    : 'Da annunciare';

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-xl flex items-center space-x-4 hover:bg-gray-700 transition duration-200">
      
      {/* Immagine */}
      <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden">
        <Image 
          src={game.thumb} 
          alt={`${game.title} cover`} 
          width={96}
          height={64}
          objectFit="cover" 
        />
      </div>

      {/* Dettagli */}
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-white mb-1 truncate">{game.title}</h3>
        
        {/* Data di Rilascio */}
        <p className={`text-sm font-semibold ${isReleased ? 'text-green-400' : 'text-blue-400'}`}>
          {isReleased ? 'Rilasciato il: ' : 'In Uscita: '}
          <span className='font-normal'>{releaseDate}</span>
        </p>
      </div>

      {/* Prezzo e Link */}
      <div className="text-right flex flex-col items-end">
        <span className="text-lg font-bold text-gray-300 mb-2">{priceDisplay}</span>
        <a 
          href={`https://www.cheapshark.com/redirect?dealID=${game.dealID}`}
          target="_blank"
          rel="noopener noreferrer"
          className='text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded transition duration-150'
        >
          Scheda
        </a>
      </div>
    </div>
  );
}