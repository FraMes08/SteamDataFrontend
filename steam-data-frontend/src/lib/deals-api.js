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