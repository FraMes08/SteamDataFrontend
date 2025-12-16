// lib/deals-api.js (Versione COMPLETA)

const CHEAPSHARK_API_URL = 'https://www.cheapshark.com/api/1.0/deals';

/**
 * 1. RECUPERO OFFERTE (Pagina /sales)
 * Recupera i giochi attualmente in offerta tramite l'API CheapShark (filtrati per Steam).
 * @param {number} limit - Numero massimo di offerte da recuperare.
 * @returns {Promise<Array>} Lista di oggetti offerta.
 */
/**
 * 1. RECUPERO OFFERTE (Generico per Sales e Home)
 * Recupera i giochi in offerta tramite API CheapShark.
 * @param {number} limit - Numero massimo di offerte.
 * @param {string} sortBy - Criterio di ordinamento ('dealrating', 'Savings', 'Price', 'Release').
 * @returns {Promise<Array>} Lista di oggetti offerta.
 */
export async function fetchSalesDataFromAPI(limit = 40, sortBy = 'dealrating') {
  const params = new URLSearchParams({
    storeID: '1', // Steam Store ID
    pageNumber: '0',
    pageSize: String(limit),
    sortBy: sortBy
  });

  const url = `${CHEAPSHARK_API_URL}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SteamDataFrontend/1.0'
      },
      next: { revalidate: 3600 } 
    });

    if (!response.ok) {
        if (response.status === 429) {
            console.warn("CheapShark rate limit (429) hit. Using fallback data.");
            // Fallback specifico per il tipo di richiesta?
            // Per ora usiamo un fallback generico sicuro.
            return [
                { title: "Cyberpunk 2077", salePrice: "29.99", normalPrice: "59.99", savings: "50.0", dealID: null, steamAppID: "1091500", thumb: "https://via.placeholder.com/300x200?text=Discounted" },
                { title: "The Witcher 3: Wild Hunt", salePrice: "9.99", normalPrice: "39.99", savings: "75.0", dealID: null, steamAppID: "292030", thumb: "https://via.placeholder.com/300x200?text=Discounted" },
                { title: "Red Dead Redemption 2", salePrice: "19.79", normalPrice: "59.99", savings: "67.0", dealID: null, steamAppID: "1174180", thumb: "https://via.placeholder.com/300x200?text=Discounted" },
                { title: "Civ VI", salePrice: "5.99", normalPrice: "59.99", savings: "90.0", dealID: null, steamAppID: "289070", thumb: "https://via.placeholder.com/300x200?text=Discounted" },
                { title: "XCOM 2", salePrice: "4.99", normalPrice: "59.99", savings: "92.0", dealID: null, steamAppID: "268500", thumb: "https://via.placeholder.com/300x200?text=Discounted" },
                { title: "Hades", salePrice: "12.49", normalPrice: "24.99", savings: "50.0", dealID: null, steamAppID: "1145360", thumb: "https://via.placeholder.com/300x200?text=Discounted" },
                { title: "Stardew Valley", salePrice: "9.99", normalPrice: "14.99", savings: "33.0", dealID: null, steamAppID: "413150", thumb: "https://via.placeholder.com/300x200?text=Discounted" },
                { title: "Terraria", salePrice: "4.99", normalPrice: "9.99", savings: "50.0", dealID: null, steamAppID: "105600", thumb: "https://via.placeholder.com/300x200?text=Discounted" },
                { title: "Hollow Knight", salePrice: "7.49", normalPrice: "14.99", savings: "50.0", dealID: null, steamAppID: "367520", thumb: "https://via.placeholder.com/300x200?text=Discounted" },
                { title: "Celeste", salePrice: "4.99", normalPrice: "19.99", savings: "75.0", dealID: null, steamAppID: "504230", thumb: "https://via.placeholder.com/300x200?text=Discounted" },
            ];
        }
        throw new Error(`Errore API CheapShark: ${response.status} ${response.statusText}`);
    }

    return await response.json();

  } catch (error) {
    if (error.message.includes("429")) return []; // Se gestito sopra
    console.warn("Recoverable error in fetchSalesDataFromAPI:", error.message);
    // Fallback estremo
    return [
       { title: "Offline Data", salePrice: "0", normalPrice: "0", savings: "0", dealID: null, steamAppID: null, thumb: "https://via.placeholder.com/300x200?text=Offline" }
    ];
  }
}

/**
 * 2. RECUPERO CALENDARIO (Pagina /calendar)
 * Recupera i giochi ordinati per data di rilascio.
 * @param {number} limit - Numero massimo di giochi da recuperare.
 * @returns {Promise<Array>} Lista di oggetti gioco con data di rilascio.
 */
export async function fetchCalendarData(limit = 40) {
  const params = new URLSearchParams({
    storeID: '1', 
    sortBy: 'Release', // Ordina per data di rilascio (dal più recente)
    pageNumber: '0',
    pageSize: String(limit),
  });

  const url = `${CHEAPSHARK_API_URL}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 21600 } 
    });

    if (!response.ok) {
      throw new Error(`Errore API CheapShark: ${response.status} ${response.statusText}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Errore durante il recupero dei dati del calendario:", error.message);
    throw new Error("Si è verificato un problema nel caricamento delle prossime uscite.");
  }
}

// lib/deals-api.js (AGGIUNGI QUESTA FUNZIONE)

/**
 * Recupera i giochi filtrati per un termine di ricerca (usato come tag) e ordinati per rating.
 * @param {string} tagSearch - Il termine di ricerca (tag).
 * @param {number} limit - Numero massimo di giochi da recuperare.
 * @returns {Promise<Array>} Lista di oggetti gioco.
 */
export async function fetchGamesByTag(tagSearch, limit = 40) {
  const params = new URLSearchParams({
    storeID: '1', // Steam Store ID
    // Usiamo il titolo (title) come proxy per cercare giochi che matchano il nome del tag
    title: tagSearch, 
    // Ordina per Metacritic Score (rating)
    sortBy: 'Metacritic', 
    pageNumber: '0',
    pageSize: String(limit),
  });

  const url = `${CHEAPSHARK_API_URL}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 } 
    });

    if (!response.ok) {
      throw new Error(`Errore API CheapShark: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Ordina esplicitamente dal rating più alto al più basso
    const filteredAndSorted = data
        .filter(deal => parseInt(deal.metacriticScore) > 0) // Filtra quelli senza Metacritic
        .sort((a, b) => parseInt(b.metacriticScore) - parseInt(a.metacriticScore)); 

    return filteredAndSorted;

  } catch (error) {
    console.error(`Errore durante il recupero dei giochi per il tag "${tagSearch}":`, error.message);
    throw new Error(`Si è verificato un problema nel caricamento dei giochi per ${tagSearch}.`);
  }
}

/**
 * Cerca un'offerta specifica su CheapShark dato il titolo esatto del gioco.
 * Usata per arricchire i dati di RAWG.
 */
export async function getCheapSharkDeal(title) {
  // Rimuovi caratteri speciali che potrebbero confondere la ricerca
  const safeTitle = title.replace(/[^\w\s]/gi, '');
  
  const params = new URLSearchParams({
    storeID: '1', // Steam
    title: safeTitle,
    pageSize: '1', // Ne vogliamo solo 1 (il "best match")
    exact: '0' // Non esatto perché i titoli potrebbero differire leggermente
  });

  try {
    const response = await fetch(`${CHEAPSHARK_API_URL}?${params.toString()}`, {
        next: { revalidate: 3600 }
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data && data.length > 0) {
        return data[0]; // Restituisci la prima offerta trovata
    }
    return null;
  } catch (e) {
      console.warn(`Fallito il recupero prezzi per ${title}`, e.message);
      return null;
  }
}

