// app/components/GameCard.js (VERSIONE AGGIORNATA)
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
  const isOnSale = discount > 0;
  
  // Rating Metacritic
  const metacriticScore = parseInt(deal.metacriticScore) || 0;
  
  // Determina il colore del rating
  let ratingColor = "bg-gray-600"; // Default
  if (metacriticScore > 0) {
      if (metacriticScore >= 80) ratingColor = "bg-green-600";
      else if (metacriticScore >= 60) ratingColor = "bg-yellow-600";
      else ratingColor = "bg-red-600";
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden hover:shadow-blue-500/50 transition duration-300 transform hover:-translate-y-1 min-h-[450px] flex flex-col relative">

      {/* Badge Rating (Posizionato sopra l'immagine) */}
      {metacriticScore > 0 && (
          <div className={`absolute top-2 right-2 z-10 ${ratingColor} text-white font-bold px-2 py-1 rounded shadow-md text-sm`}>
              {metacriticScore}
          </div>
      )}

      <div className="relative h-48 w-full group">
        <Image 
          src={deal.thumb}
          alt={`${deal.title} cover`} 
          width={400} 
          height={225}
          className="object-cover w-full h-full transition duration-500 ease-in-out group-hover:scale-105"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold leading-tight text-white mb-2">{deal.title}</h3>
        
        {/* Tags / Generi */}
        <div className="flex flex-wrap gap-1 mb-2">
            {deal.genres && deal.genres.slice(0, 3).map((genre, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded-full border border-gray-600">
                    {genre}
                </span>
            ))}
        </div>

        <div className="mt-auto">
          {/* Data di Rilascio */}
          {deal.releaseDate && (
              <p className="text-xs text-gray-500 mb-2 text-right">
                  Uscita: {deal.releaseDate}
              </p>
          )}

          {/* Prezzi Layout Orizzontale */}
          <div className="flex justify-end items-center gap-2 mb-3">
            {isFree ? (
              <span className="text-green-400 font-bold text-lg">Gratis</span>
            ) : (
              isOnSale ? (
                <>
                  {/* Sconto */}
                  <div className="bg-red-600 px-2 py-0.5 rounded text-xs font-bold text-white">
                    -{discount}%
                  </div>
                  {/* Prezzi affiancati: Prezzo Scontato a sinistra del base (o viceversa? User: "non sopra il base, ma alla sua sinistra") 
                      User quote: "se sono presenti offerte non vengano poste SOPRA il prezzo base, ma alla sua SINISTRA"
                      Quindi: [Offerta] [Base] ? Di solito si legge [Base] -> [Offerta].
                      Ma se dice "non sopra il base, ma alla sua sinistra", forse intende che l'offerta deve stare A SINISTRA del prezzo base.
                      Quindi: [Offerta] [Base].
                  */}
                  <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-green-400">
                        ${deal.salePrice}
                      </p>
                      <p className="text-sm text-gray-500 line-through">
                        ${deal.normalPrice}
                      </p>
                  </div>
                </>
              ) : (
                <p className="text-xl font-bold text-white">
                  ${deal.normalPrice}
                </p>
              )
            )}
          </div>
        
          <a 
            href={getDealLink(deal.dealID)}
            target="_blank"
            rel="noopener noreferrer"
            className='block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded transition duration-150'
          >
            Vedi Offerta su Steam
          </a>
        </div>
      </div>
    </div>
  );
}