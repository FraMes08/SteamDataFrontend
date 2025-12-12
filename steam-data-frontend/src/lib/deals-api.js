// lib/deals-api.js (Versione COMPLETA)

const CHEAPSHARK_API_URL = 'https://www.cheapshark.com/api/1.0/deals';

/**
 * 1. RECUPERO OFFERTE (Pagina /sales)
 * Recupera i giochi attualmente in offerta tramite l'API CheapShark (filtrati per Steam).
 * @param {number} limit - Numero massimo di offerte da recuperare.
 * @returns {Promise<Array>} Lista di oggetti offerta.
 */
export async function fetchSalesDataFromAPI(limit = 40) {
  const params = new URLSearchParams({
    storeID: '1', // Steam Store ID
    pageNumber: '0',
    pageSize: String(limit),
    sortBy: 'dealrating' // Ordina per 'deal rating'
  });

  const url = `${CHEAPSHARK_API_URL}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 } 
    });

    if (!response.ok) {
      throw new Error(`Errore API CheapShark: ${response.status} ${response.statusText}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Errore durante il recupero dei dati di vendita:", error.message);
    throw new Error("Si è verificato un problema nel caricamento delle offerte.");
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