// test-rawg-stores.js
require('dotenv').config({ path: '.env.local' });

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_API_URL = "https://api.rawg.io/api";

async function testGameDetails(slug) {
    if (!RAWG_API_KEY) {
        console.error("NO API KEY");
        return;
    }
    
    // Fetch details for a specific game (e.g., a recent one request by user or known)
    // Using a known recent game or just one from the list. 
    // "the-finals" or similar. Let's try "pioneers-of-pagonia" (from screenshot).
    const gameSlug = slug || "pioneers-of-pagonia";
    
    console.log(`Fetching details for: ${gameSlug}`);
    const url = `${RAWG_API_URL}/games/${gameSlug}?key=${RAWG_API_KEY}`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        
        console.log("Game:", data.name);
        
        if (data.stores) {
            console.log("Stores found:", data.stores.length);
            data.stores.forEach(s => {
                console.log(`- Store ID: ${s.store.id} (${s.store.name})`);
                console.log(`  URL: ${s.url}`); // This is what we hope for
            });
            
            const steamStore = data.stores.find(s => s.store.slug === 'steam');
            if (steamStore && steamStore.url) {
                 console.log("!!! FOUND STEAM URL:", steamStore.url);
                 // Try extracting ID
                 const match = steamStore.url.match(/\/app\/(\d+)/);
                 if (match) console.log("!!! EXTRACTED ID:", match[1]);
            }
        } else {
            console.log("No stores info found.");
        }
        
    } catch (e) {
        console.error("Error:", e);
    }
}

testGameDetails();
