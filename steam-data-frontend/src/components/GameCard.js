// app/components/GameCard.js (AGGIORNATO)
import Image from 'next/image';

export default function GameCard({ deal }) {
  const originalPrice = parseFloat(deal.normalPrice);
  const salePrice = parseFloat(deal.salePrice);
  const discount = Math.round(parseFloat(deal.savings));
  const isFree = originalPrice === 0 || deal.salePrice === '0.00';

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden hover:shadow-blue-500/50 transition duration-300 transform hover:-translate-y-1">
      <div className="relative h-40 w-full">
        {/* L'API CheapShark fornisce un URL dell'immagine (thumb) */}
        <Image 
          src={deal.thumb} 
          alt={`${deal.title} cover`} 
          width={280} // Imposta larghezza e altezza per l'Image Component di Next.js
          height={160}
          objectFit="cover" 
          className="transition duration-500 ease-in-out hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold truncate text-white mb-2">{deal.title}</h3>

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
          href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
          target="_blank"
          rel="noopener noreferrer"
          className='block mt-4 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded transition duration-150'
        >
          Vedi Offerta su Steam
        </a>
      </div>
    </div>
  );
}