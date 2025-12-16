"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

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
  const [playerCount, setPlayerCount] = useState(null);
  
  const releaseDate = formatDate(game.releaseDate);
  const isReleased = true; 

  // Fetch Real-Time Players (Client-Side)
  useEffect(() => {
      if (game.steamAppID) {
          fetch(`/api/steam/players?appid=${game.steamAppID}`)
            .then(res => res.json())
            .then(data => {
                if (data.response && data.response.player_count !== undefined) {
                    setPlayerCount(data.response.player_count);
                }
            })
            .catch(err => console.error("Player count fetch failed", err));
      }
  }, [game.steamAppID]);
  
  // Link Logic
  let storeLink;
  if (game.steamAppID) {
      storeLink = `https://store.steampowered.com/app/${game.steamAppID}`;
  } else if (game.dealID) {
      storeLink = `https://www.cheapshark.com/redirect?dealID=${game.dealID}`;
  } else {
      storeLink = `https://store.steampowered.com/search/?term=${encodeURIComponent(game.title)}`;
  }
  
  return (
    <div className="group bg-gray-800 rounded-lg shadow-lg overflow-hidden flex h-40 hover:bg-gray-700 transition duration-300 transform hover:-translate-y-1">
      
      {/* SEZIONE SINISTRA: Immagine */}
      <div className="relative w-48 h-full flex-shrink-0">
        <Image
          src={game.thumb || "https://via.placeholder.com/300x200?text=No+Image"}
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
            {parseFloat(game.savings) > 0 && (
                <span className="text-xs font-bold text-white bg-red-600 px-1.5 py-0.5 rounded mb-1">
                    -{Math.round(game.savings)}%
                </span>
            )}
            
            <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold text-base">
                    {parseFloat(game.salePrice) > 0 ? `$${parseFloat(game.salePrice).toFixed(2)}` : "Free"}
                </span>

                {parseFloat(game.normalPrice) > parseFloat(game.salePrice) && (
                    <span className="text-gray-500 text-xs line-through">
                        ${parseFloat(game.normalPrice).toFixed(2)}
                    </span>
                )}
            </div>
          </div>
        </div>

        {/* RIGA INFERIORE: Data + Link */}
        <div className="flex justify-between items-end mt-2">
          
          {/* Colonna Sinistra: Data + Players Real-Time */}
          <div className="flex flex-col gap-1">
             {/* Data */}
             <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-wide">Released</span>
                <span className="text-xs font-medium text-gray-300">{releaseDate}</span>
             </div>

             {/* Players Real-Time */}
             {playerCount !== null && (
                 <div className="flex items-center text-xs text-blue-300 font-semibold mt-1" title="Giocatori Attuali in gioco (Live Steam Data)">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5 box-content border-2 border-green-500/30 animate-pulse"></div>
                    {playerCount.toLocaleString()} In-Game
                 </div>
             )}
          </div>



          {/* Colonna Destra: Bottone Store */}
          <div className="flex items-end">
            <a 
                href={storeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded transition-colors shadow-md"
             >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.556 12.87c.074.654-.366 1.256-1.02 1.33-.654.074-1.256-.366-1.33-1.02-.074-.654.366-1.256 1.02-1.33.653-.075 1.256.365 1.33 1.02zM8.384 12.38c-.375-3.327 1.957-6.37 5.284-6.745 3.327-.375 6.37 1.957 6.745 5.284.375 3.327-1.957 6.37-5.284 6.745-3.327.375-6.37-1.957-6.745-5.284zM6.611 15.61c.654.074 1.256-.366 1.33-1.02.074-.654-.366-1.256-1.02-1.33-.654-.074-1.256.366-1.33 1.02.075.654-.365 1.256 1.02 1.33z" /></svg>
                Steam
             </a>
          </div>
        </div>
      </div>
    </div>
  );
}
