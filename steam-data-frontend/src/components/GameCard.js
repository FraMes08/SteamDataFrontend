// app/components/GameCard.js (VERSIONE CORRETTA E MODERNA)
import Image from 'next/image';

// Funzione per formattare l'URL per CheapShark/Steam
const getDealLink = (dealID) => {
  return `https://www.cheapshark.com/redirect?dealID=${dealID}`;
}

export default function GameCard({ deal }) {
  const originalPrice = parseFloat(deal.normalPrice);
  const salePrice = parseFloat(deal.salePrice);
  const discount = Math.round(parseFloat(deal.savings));
  const isFree = originalPrice === 0 || deal.salePrice === '0.00';
  
  // Ottieni il rating Metacritic (se disponibile, altrimenti usa 0)
  const metacriticScore = parseInt(deal.metacriticScore) || 0;

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden hover:shadow-blue-500/50 transition duration-300 transform hover:-translate-y-1">
      
      {/* Visualizzazione Rating Metacritic solo se > 0 */}
      {metacriticScore > 0 && (
          <div className={`text-center font-bold p-1 text-white text-sm 
              ${metacriticScore >= 80 ? 'bg-green-600' : 
                metacriticScore >= 60 ? 'bg-yellow-600' : 'bg-gray-600'}`}>
            Metacritic: {metacriticScore}
          </div>
      )}

      <div className="relative h-40 w-full">
        {/* Immagine con le prop width/height per prevenire Layout Shift (come da fix precedente) */}
        <Image 
          src={deal.thumb} // 👈 USA 'deal'
          alt={`${deal.title} cover`} 
          width={400} 
          height={225}
          className="object-cover w-full h-full transition duration-500 ease-in-out hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold truncate text-white mb-2">{deal.title}</h3>
        {/* ... (resto del contenuto) ... */}

        <div className="flex justify-between items-end">
          {/* Rating del Deal (da CheapShark) */}
          <div className="flex items-center text-sm text-gray-400">
            <span className='font-bold text-yellow-400'>{deal.dealRating} / 10.0</span>
            <span className='text-xs text-gray-500 ml-1'>Rating Offerta</span>
          </div>
          
          {/* Prezzi */}
          <div className="text-right">
            {isFree ? (
              <span className="text-green-400 font-bold text-lg">Gratis</span>
            ) : (
              <>
                <div className="bg-red-600 px-2 py-0.5 rounded-md text-sm font-bold mb-1">
                  -{discount}%
                </div>
                <p className="text-xs text-gray-500 line-through">
                  ${deal.normalPrice}
                </p>
                <p className="text-xl font-bold text-green-400">
                  ${deal.salePrice}
                </p>
              </>
            )}
          </div>
        </div>
        
        {/* Link per vedere l'offerta su CheapShark/Steam */}
        <a 
          href={getDealLink(deal.dealID)}
          target="_blank"
          rel="noopener noreferrer"
          className='block mt-4 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded transition duration-150'
        >
          Vedi Offerta
        </a>
      </div>
    </div>
  );
}