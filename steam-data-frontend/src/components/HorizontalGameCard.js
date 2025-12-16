import Image from "next/image";

const formatDate = (dateInput) => {
  if (!dateInput) return 'Data Sconosciuta';
  
  // Se è un numero (timestamp CheapShark in secondi)
  if (typeof dateInput === 'number') {
      return new Date(dateInput * 1000).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  
  // Se è una stringa (RAWG YYYY-MM-DD)
  const d = new Date(dateInput);
  if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  
  return 'Data Sconosciuta';
};

export default function HorizontalGameCard({ game }) {
  const releaseDate = formatDate(game.releaseDate);
  const isReleased = true; // Per i "Recent", assumiamo siano usciti.
  
  // Gestione Prezzo
  const price = parseFloat(game.normalPrice) > 0 
    ? `$${parseFloat(game.normalPrice).toFixed(2)}`
    : 'TBA'; 

  // Link: Link diretto a Steam (ID) > Steam Search (Titolo) > CheapShark
  let storeLink;
  if (game.steamAppID) {
      storeLink = `https://store.steampowered.com/app/${game.steamAppID}`;
  } else if (game.dealID) {
      storeLink = `https://www.cheapshark.com/redirect?dealID=${game.dealID}`;
  } else {
      // Fallback estremo: Cerca su Steam
      storeLink = `https://store.steampowered.com/search/?term=${encodeURIComponent(game.title)}`;
  }
  
  return (
    <div className="group bg-gray-800 rounded-lg shadow-lg overflow-hidden flex h-32 hover:bg-gray-700 transition duration-300 transform hover:-translate-y-1">
      
      {/* SEZIONE SINISTRA: Immagine */}
      <div className="relative w-48 h-full flex-shrink-0">
        <Image
          src={
            game.thumb || "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt={`${game.title} cover`}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* SEZIONE DESTRA: Contenuto */}
      <div className="flex flex-col flex-grow p-3 justify-between">
        {/* RIGA SUPERIORE: Titolo + Prezzo */}
        <div className="flex justify-between items-start">
          <h3
            className="text-white font-bold text-lg leading-tight line-clamp-2 pr-2"
            title={game.title}
          >
            {game.title}
          </h3>
          
          
          {/* Prezzi e Sconti */}
          <div className="flex flex-col items-end">
            {/* Badge Sconto Rosso (Style Match GameCard) */}
            {parseFloat(game.savings) > 0 && (
                <span className="text-xs font-bold text-white bg-red-600 px-1.5 py-0.5 rounded mb-1">
                    -{Math.round(game.savings)}%
                </span>
            )}
            
            <div className="flex items-center gap-2">
                {/* Prezzo Scontato (Verde) a SINISTRA come richiesto */}
                <span className="text-green-400 font-bold text-base">
                    {parseFloat(game.salePrice) > 0 ? `$${parseFloat(game.salePrice).toFixed(2)}` : "Free"}
                </span>

                {/* Prezzo Originale (Grigio Barrato) a DESTRA */}
                {parseFloat(game.normalPrice) > parseFloat(game.salePrice) && (
                    <span className="text-gray-500 text-xs line-through">
                        ${parseFloat(game.normalPrice).toFixed(2)}
                    </span>
                )}
            </div>
          </div>
        </div>

        {/* RIGA INFERIORE: Data + Store */}
        <div className="flex justify-between items-end mt-2">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Data Rilascio
            </span>
            <span
              className={`text-sm font-medium ${
                isReleased ? "text-gray-300" : "text-blue-400"
              }`}
            >
              {releaseDate}
            </span>
          </div>

          {/* Link allo store / Bottone */}
          <a
            href={storeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs text-gray-400 hover:text-white transition-colors"
          >
            {/* Icona Steam Semplificata (SVG) */}
            <svg
              className="w-5 h-5 mr-1"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.556 12.87c.074.654-.366 1.256-1.02 1.33-.654.074-1.256-.366-1.33-1.02-.074-.654.366-1.256 1.02-1.33.653-.075 1.256.365 1.33 1.02zM8.384 12.38c-.375-3.327 1.957-6.37 5.284-6.745 3.327-.375 6.37 1.957 6.745 5.284.375 3.327-1.957 6.37-5.284 6.745-3.327.375-6.37-1.957-6.745-5.284zM6.611 15.61c.654.074 1.256-.366 1.33-1.02.074-.654-.366-1.256-1.02-1.33-.654-.074-1.256.366-1.33 1.02.075.654-.365 1.256 1.02 1.33z" />
            </svg>
            Steam
          </a>
        </div>
      </div>
    </div>
  );
}
