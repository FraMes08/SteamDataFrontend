const CHEAPSHARK_API_URL = 'https://www.cheapshark.com/api/1.0/deals';

async function testBatch() {
    // Normal deals fetch (like Sales page)
    const url = `${CHEAPSHARK_API_URL}?storeID=1&pageSize=5`;
    
    console.log("Fetching:", url);
    const res = await fetch(url);
    const data = await res.json();
    console.log("Count:", data.length);
    if (data.length > 0) {
        data.forEach(d => {
            console.log(`Title: ${d.title} | Methacritic: ${d.metacriticScore} | SteamRating: ${d.steamRatingPercent}`);
        });
    }
}

testBatch();
