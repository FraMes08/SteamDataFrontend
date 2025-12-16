"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';



export default function GameCard({ deal }) {
  const [playerCount, setPlayerCount] = useState(null);
  const originalPrice = parseFloat(deal.normalPrice);
  const salePrice = parseFloat(deal.salePrice);
  const discount = Math.round(parseFloat(deal.savings));
  const isFree = originalPrice === 0 || deal.salePrice === '0.00';
  const isOnSale = discount > 0;
  
  // Rating Metacritic
  const metacriticScore = parseInt(deal.metacriticScore) || 0;
  
  // Fetch Real-Time Players
  useEffect(() => {
      if (deal.steamAppID) {
          fetch(`/api/steam/players?appid=${deal.steamAppID}`)
            .then(res => res.json())
            .then(data => {
                if (data.response && data.response.player_count !== undefined) {
                    setPlayerCount(data.response.player_count);
                }
            })
            .catch(err => console.error("Player count fetch failed", err));
      }
  }, [deal.steamAppID]);
  
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

      {/* Badge Players (Posizionato sopra l'immagine a sinistra) */}
      {playerCount !== null && (
          <div className="absolute top-2 left-2 z-10 bg-black/70 backdrop-blur-sm text-blue-300 font-bold px-2 py-1 rounded shadow-md text-xs flex items-center border border-blue-500/30">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
              {playerCount.toLocaleString()} Playing
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
                  {/* Prezzi affiancati */}
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
        
          
          {/* Calcolo Link Smart: Direct Steam > CheapShark Redirect > Search Fallback */}
          {(() => {
            let storeLink;
            if (deal.steamAppID) {
                storeLink = `https://store.steampowered.com/app/${deal.steamAppID}`;
            } else if (deal.dealID) {
                storeLink = `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`;
            } else {
                storeLink = `https://store.steampowered.com/search/?term=${encodeURIComponent(deal.title)}`;
            }

            return (
              <a 
                href={storeLink}
                target="_blank"
                rel="noopener noreferrer"
                className='block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded transition duration-150'
              >
                Vedi Offerta su Steam
              </a>
            );
          })()}
        </div>
      </div>
    </div>
  );
}