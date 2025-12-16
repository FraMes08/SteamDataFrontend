// lib/rawg-api.js

const RAWG_API_URL = "https://api.rawg.io/api";
const RAWG_API_KEY = process.env.RAWG_API_KEY;

if (!RAWG_API_KEY) {
    console.error("ERRORE CRITICO: RAWG_API_KEY non è definito. Assicurati che sia nel tuo file .env.local e riavvia il server.");
}

/**
 * Recupera la lista di generi (tags) dall'API RAWG.
 */
/**
 * Helper generico per fetchare tutte le pagine (o fino a un limite)
 */
async function fetchAllPages(endpointUrl, maxPages = 5) {
    let allResults = [];
    let page = 1;
    let url = endpointUrl;

    console.log(`Inizio fetch per endpoint: ${endpointUrl}`);

    while (url && page <= maxPages) {
        console.log(`Fetch page ${page}: ${url}`);
        
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'SteamDataFrontend/1.0'
                },
                next: { revalidate: 604800 } // Cache settimanale
            });

            if (!response.ok) {
                console.error(`Errore API RAWG (${url}) - Status: ${response.status}`);
                break;
            }

            const data = await response.json();
            
            if (!data.results || !Array.isArray(data.results)) {
                 break;
            }
            // Aggiungi i risultati di questa pagina alla lista totale
            if (page === 1 && data.results.length > 0) {
                 console.log("DEBUG RAWG ITEM:", JSON.stringify(data.results[0], null, 2));
            }

            const mappedItems = data.results.map(item => ({
                name: item.name,
                slug: item.slug,
                games_count: item.games_count,
                image_background: item.image_background
            }));
            
            allResults = [...allResults, ...mappedItems];
            url = data.next;
            page++;

        } catch (error) {
            console.error(`Errore durante il fetch di ${url}:`, error.message);
            break;
        }
    }
    return allResults;
}

/**
 * Recupera SIA i generi che i tag più popolari dall'API RAWG.
 */
export async function fetchRawgGenres() {
    if (!RAWG_API_KEY) return [];

    try {
        // 1. Fetch Gens (endpoint /genres) - recuperiamo tutto (solitamente 1 pagina)
        const genresUrl = `${RAWG_API_URL}/genres?key=${RAWG_API_KEY}&page_size=40`;
        const genres = await fetchAllPages(genresUrl, 2); // Bastano 2 pagine per essere sicuri
        console.log(`Recuperati ${genres.length} generi.`);

        // 2. Fetch Tags (endpoint /tags) - recuperiamo i più popolari (es. prime 3-4 pagine da 40)
        // RAWG ordina per popolarità di default? Meglio esplicitare o fidarsi del default.
        const tagsUrl = `${RAWG_API_URL}/tags?key=${RAWG_API_KEY}&page_size=40`; 
        const tags = await fetchAllPages(tagsUrl, 4); // ~160 tag aggiuntivi
        console.log(`Recuperati ${tags.length} tag.`);

        // 3. Unione e rimozione duplicati (per sicurezza, basandoci sullo slug)
        const allItems = [...genres, ...tags];
        
        // Rimuovi duplicati basati su slug
        const uniqueItems = Array.from(new Map(allItems.map(item => [item.slug, item])).values());
        
        console.log(`Totale combinato (Generi + Tag): ${uniqueItems.length}`);
        return uniqueItems;

    } catch (error) {
        console.error("Errore critico in fetchRawgGenres:", error);
        return [];
    }
}

// lib/rawg-api.js
import { getCheapSharkDeal } from './deals-api'; // Manteniamo se serve, ma useremo fetch diretta qui

// Helper per estrarre l'ID di Steam dai negozi RAWG
function getSteamAppId(stores) {
    if (!stores) return null;
    const steamStore = stores.find(s => s.store && (s.store.slug === 'steam' || s.store.id === 1));
    if (!steamStore) return null;
    
    // RAWG non fornisce direttamente l'AppID nel json semplice, fornisce l'URL dello store?
    // Nel test-rawg.js non vedevo "url" nello store object della lista /games standard.
    // Bisogna verificare se RAWG fornisce l'ID. 
    // SE NON LO FORNISCE, la strategia cade.
    // Dal test precedente (Step 137 output troncato) vedevo solo "id", "slug" dentro store.
    
    // VERIFICA IMPORTANTE: Spesso RAWG non dà il link allo store nella lista, ma solo nei details.
    // Se è così, non possiamo ottenere l'AppID senza chiamare i dettagli di ogni gioco.
    // TENTATIVO: Chiediamo maggiori dati /games?stores=1?
    
    // Se la strategia ID fallisce, torniamo al fallback (Title Search).
    // MA l'utente vuole evitare N/A.
    
    // Supponiamo che non abbiamo l'ID. 
    // RIPIEGO: Usiamo getCheapSharkDeal (per titolo) ma aumentiamo l'efficienza?
    // Batch lookup di CheapShark per ID funziona solo se abbiamo ID.
    
    // STOP: Il piano si basa sull'avere l'ID.
    // RAWG /games response standard:
    // stores: [ { store: { id: 1, name: "Steam" } } ] -> NO URL.
    
    // ALTERNATIVA MIGLIORE SE MANCA ID:
    // CheapShark ha un endpoint "Get Games" by title che restituisce anche SteamAppID.
    
    // OK, procediamo con la strategia IBRIDA MIGLIORATA (Parallela ma filtrante).
    // 1. Fetch 40 RAWG games.
    // 2. Parallelo su tutti e 40: getCheapSharkDeal(name).
    // 3. TENERE SOLO QUELLI che hanno (deal != null).
    // Questo soddisfa "non lasciare tags senza giochi" (N/A) anche se riduce il numero totale.
    // Se su 40 ne troviamo 20 con prezzo, è un buon risultato.
    
    return null; 
}

/**
 * Recupera i giochi per un tag/genere da RAWG e ARRICCHISCE CON PREZZI, FILTRANDO quelli senza prezzo.
 */
export async function fetchRawgGamesWithPrices(slug) {
    if (!RAWG_API_KEY) return [];
    
    let url = `${RAWG_API_URL}/games?key=${RAWG_API_KEY}&tags=${slug}&page_size=60`; // Fetch 60 per averne abbastanza dopo il filtro
    
    const knownGenres = ['action','indie','adventure','rpg','strategy','shooter','casual','simulation','puzzle','arcade','platformer','racing','massively-multiplayer','sports','fighting','family','board-games','educational','card'];
    if (knownGenres.includes(slug)) {
        url = `${RAWG_API_URL}/games?key=${RAWG_API_KEY}&genres=${slug}&page_size=60`;
    }

    try {
        const response = await fetch(url, { next: { revalidate: 3600 } });
        const data = await response.json();

        if (!data.results) return [];

        const games = data.results;
        
        // Eseguiamo chiamate in parallelo a CheapShark (Search by Title).
        // CheapShark è veloce, 60 chiamate in parallelo potrebbero essere throttled, facciamo lotti o Promise.all completo (rischiando).
        // Meglio limitare a 30 per sicurezza.
        const candidates = games.slice(0, 30); 

        const enrichedGames = await Promise.all(candidates.map(async (game) => {
            // Cerchiamo il prezzo esatto
            const deal = await getCheapSharkDeal(game.name);
            
            if (!deal) return null; // Se non c'è offerta, ritorna null (lo filtreremo)

            return {
                dealID: deal.dealID,
                title: game.name,
                thumb: game.background_image, // Immagine RAWG (Alta qualità)
                metacriticScore: game.metacritic || deal.metacriticScore,
                normalPrice: deal.normalPrice,
                normalPrice: deal.normalPrice,
                salePrice: deal.salePrice,
                savings: deal.savings,
                releaseDate: game.released, 
                genres: game.genres ? game.genres.map(g => g.name) : [],
                steamAppID: deal.steamAppID, // 💡 Cruciale per il link diretto
                hasPrice: true
            };
        }));

        // Filtra via i null (quelli senza prezzo)
        const validGames = enrichedGames.filter(g => g !== null);
        
        console.log(`[RAWG Hybrid] ${slug}: Fetch ${candidates.length}, Valid Deals Found: ${validGames.length}`);

        // Se ne abbiamo troppo pochi (< 5?), potremmo decidere di mostrare anche gli altri come fallback?
        // L'utente ha detto "i prezzi devono rimanere" e "evitare giochi con prezzo n/a".
        // Quindi restituiamo SOLO quelli validi.
        
        return validGames;

    } catch (e) {
        console.error("Errore fetchRawgGamesWithPrices", e);
        return [];
    }
}

// lib/rawg-api.js

/**
 * Arricchisce una lista di deal CheapShark con metadati RAWG (Immagini HQ, Generi, Data).
 */
export async function enrichDealsWithRawg(deals) {
    if (!RAWG_API_KEY || !deals || deals.length === 0) return deals;

    // Limitiamo a 24 per evitare rate limit e lentezza
    const dealsToEnrich = deals.slice(0, 24);
    const rest = deals.slice(24);

    const enriched = await Promise.all(dealsToEnrich.map(async (deal) => {
        try {
            // Cerca il gioco su RAWG per titolo
            // Usiamo searchParams per encode corretto
            const searchUrl = `${RAWG_API_URL}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(deal.title)}&page_size=1`;
            
            const res = await fetch(searchUrl, { next: { revalidate: 3600 } });
            const data = await res.json();

            if (data.results && data.results.length > 0) {
                const game = data.results[0];
                
                // Sovrascriviamo/Aggiungiamo dati RAWG
                // Calcolo Score intelligente:
                // 1. RAWG Metacritic (se esiste)
                // 2. CheapShark Metacritic (se > 0)
                // 3. CheapShark Steam Rating (se > 0)
                const rawgMeta = game.metacritic;
                const csMeta = parseInt(deal.metacriticScore);
                const csSteam = parseInt(deal.steamRatingPercent);
                
                const finalScore = rawgMeta || (csMeta > 0 ? csMeta : (csSteam > 0 ? csSteam : 0));

                return {
                    ...deal,
                    thumb: game.background_image || deal.thumb, 
                    genres: game.genres ? game.genres.map(g => g.name) : [],
                    releaseDate: game.released,
                    metacriticScore: finalScore 
                };
            }
            
            // Fallback non arricchito (RAWG fallito)
            const csMeta = parseInt(deal.metacriticScore);
            const csSteam = parseInt(deal.steamRatingPercent);
            return {
                ...deal,
                metacriticScore: csMeta > 0 ? csMeta : (csSteam > 0 ? csSteam : 0)
            }; 
        } catch (e) {
            console.error(`Errore enrichment per ${deal.title}:`, e);
            return deal; // Fallback su originale in caso di errore
        }
    }));

    return [...enriched, ...rest];
}

/**
 * Recupera i giochi rilasciati recentemente (ultimi 30 giorni) da RAWG
 * e aggiunge i prezzi da CheapShark.
 * Ordinati per data decrescente (dal più nuovo).
 */
export async function fetchRawgRecentReleases() {
    if (!RAWG_API_KEY) return [];

    // Calcolo date dinamiche: Oggi e 30 giorni fa
    const today = new Date();
    const priorDate = new Date();
    priorDate.setDate(today.getDate() - 30);

    const formatDate = (date) => date.toISOString().split('T')[0];
    const datesInfo = `${formatDate(priorDate)},${formatDate(today)}`;

    // ordering=-released assicura "dai più nuovi ai più vecchi"
    const url = `${RAWG_API_URL}/games?key=${RAWG_API_KEY}&dates=${datesInfo}&ordering=-released&page_size=40`;

    try {
        const response = await fetch(url, { next: { revalidate: 3600 } });
        const data = await response.json();

        if (!data.results) return [];

        const games = data.results;

        // Arricchimento Parallelo con Prezzi
        const enriched = await Promise.all(games.map(async (game) => {
            let deal = await getCheapSharkDeal(game.name); // 1. Tentativo per Titolo
            let steamAppID = deal ? deal.steamAppID : null;

            // 2. Fallback Deep Lookup: Se non abbiamo trovato deal o ID, chiediamo i dettagli a RAWG
            if (!deal || !steamAppID) {
                try {
                    // Fetch Dettagli Gioco per trovare lo store URL
                    const detailRes = await fetch(`${RAWG_API_URL}/games/${game.slug}?key=${RAWG_API_KEY}`, { next: { revalidate: 86400 } });
                    const detailData = await detailRes.json();
                    
                    if (detailData.stores) {
                         const steamStore = detailData.stores.find(s => s.store.slug === 'steam');
                         if (steamStore && steamStore.url) {
                             // Estrai ID dall'URL (es: .../app/12345/...)
                             const match = steamStore.url.match(/\/app\/(\d+)/);
                             if (match) {
                                 steamAppID = match[1];
                                 // 3. Ora che abbiamo l'ID, cerchiamo il prezzo su CheapShark per ID
                                 deal = await getCheapSharkDealByID(steamAppID);
                             }
                         }
                    }
                } catch (err) {
                    console.warn(`Deep lookup failed for ${game.name}`);
                }
            }

            return {
                dealID: deal ? deal.dealID : null,
                steamAppID: steamAppID, // ID solido (o null)
                title: deal ? deal.title : game.name, // Preferiamo titolo ufficiale store se c'è
                thumb: game.background_image,
                releaseDate: game.released, 
                genres: game.genres ? game.genres.map(g => g.name) : [],
                normalPrice: deal ? deal.normalPrice : "0.00", 
                salePrice: deal ? deal.salePrice : "0.00",
                savings: deal ? deal.savings : 0,
                metacriticScore: game.metacritic || (deal ? deal.metacriticScore : 0)
            };
        }));

        // Filtra: mantieni solo se abbiamo un link Steam valido (steamAppID)
        // L'utente vuole evitare giochi con link non funzionanti o TBA senza ID.
        return enriched.filter(g => g.steamAppID !== null && g.steamAppID !== undefined);

    } catch (e) {
        console.error("Errore fetchRawgRecentReleases", e);
        return [];
    }
}

/**
 * Cerca deal su CheapShark tramite Steam App ID
 */
async function getCheapSharkDealByID(steamAppID) {
    try {
        const response = await fetch(`https://www.cheapshark.com/api/1.0/deals?storeID=1&steamAppID=${steamAppID}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data && data.length > 0 ? data[0] : null;
    } catch {
        return null;
    }
}
/**
 * HOME PAGE: 1. Most Played (Giochi più giocati/aggiunti)
 */
/**
 * HOME PAGE: 1. Most Played (Giochi più giocati/aggiunti)
 */
export async function fetchMostPlayed(limit = 10) {
    if (!RAWG_API_KEY) return [];
    // Fetchiamo di più (25) per compensare i filtri
    const url = `${RAWG_API_URL}/games?key=${RAWG_API_KEY}&ordering=-added&page_size=25`;
    return await fetchAndEnrich(url, limit);
}

/**
 * HOME PAGE: 2. Popular Releases (Uscite Popolari recenti)
 */
export async function fetchPopularNewReleases(limit = 10) {
    if (!RAWG_API_KEY) return [];
    const url = `${RAWG_API_URL}/games?key=${RAWG_API_KEY}&dates=2024-01-01,2025-12-31&ordering=-added&page_size=25`;
    return await fetchAndEnrich(url, limit);
}

/**
 * HOME PAGE: 4. Trending (Giochi con rating alto recenti)
 */
export async function fetchTrending(limit = 10) {
    if (!RAWG_API_KEY) return [];
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    const dates = `${sixMonthsAgo.toISOString().split('T')[0]},${today.toISOString().split('T')[0]}`;
    
    // Fetch 25 per sicurezza
    const url = `${RAWG_API_URL}/games?key=${RAWG_API_KEY}&dates=${dates}&ordering=-rating&page_size=25`;
    return await fetchAndEnrich(url, limit);
}

/**
 * Helper interno per fetch + enrichment comune
 */
async function fetchAndEnrich(url, limit = 10) {
    try {
        const response = await fetch(url, { next: { revalidate: 3600 } });
        const data = await response.json();
        if (!data.results) return [];

        const games = data.results;
        
        // Arricchimento con throttled parallelism per evitare 429
        // Eseguiamo a blocchi di 5 in parallelo
        const BATCH_SIZE = 5;
        const enriched = [];
        
        for (let i = 0; i < games.length; i += BATCH_SIZE) {
            const batch = games.slice(i, i + BATCH_SIZE);
            const batchResults = await Promise.all(batch.map(async (game) => {
                let deal = await getCheapSharkDeal(game.name);
                let steamAppID = deal ? deal.steamAppID : null;

                if (!deal || !steamAppID) {
                    try {
                        const detailRes = await fetch(`${RAWG_API_URL}/games/${game.slug}?key=${RAWG_API_KEY}`, { next: { revalidate: 86400 } });
                        const detailData = await detailRes.json();
                        if (detailData.stores) {
                            const steamStore = detailData.stores.find(s => s.store.slug === 'steam');
                            if (steamStore && steamStore.url) {
                                const match = steamStore.url.match(/\/app\/(\d+)/);
                                if (match) {
                                    steamAppID = match[1];
                                    deal = await getCheapSharkDealByID(steamAppID);
                                }
                            }
                        }
                    } catch {}
                }

                return {
                    dealID: deal ? deal.dealID : null,
                    steamAppID: steamAppID,
                    title: deal ? deal.title : game.name,
                    thumb: game.background_image,
                    releaseDate: game.released,
                    players: game.added, 
                    normalPrice: deal ? deal.normalPrice : "0.00",
                    salePrice: deal ? deal.salePrice : "0.00",
                    savings: deal ? deal.savings : 0,
                    metacriticScore: game.metacritic || (deal ? deal.metacriticScore : 0)
                };
            }));
            
            enriched.push(...batchResults);
            
            // Breve pausa tra i batch per essere gentili con l'API
            if (i + BATCH_SIZE < games.length) {
                await new Promise(r => setTimeout(r, 200));
            }
        }
        
        // Filtriamo e poi TAGLIAMO al limite esatto
        const filtered = enriched.filter(g => g.steamAppID !== null && g.steamAppID !== undefined);
        return filtered.slice(0, limit);

    } catch (e) {
        console.error("Errore fetchAndEnrich", e);
        return [];
    }
}