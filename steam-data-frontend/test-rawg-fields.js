
const RAWG_API_KEY = process.env.RAWG_API_KEY || '1b4206f56a884d10a5d8250a23715285'; // Hardcoded fallback for test
const RAWG_API_URL = "https://api.rawg.io/api";

async function testFetch() {
    const url = `${RAWG_API_URL}/games?key=${RAWG_API_KEY}&page_size=1`;
    console.log("Fetching:", url);
    const res = await fetch(url);
    const data = await res.json();
    if(data.results && data.results.length > 0) {
        console.log("Fields:", Object.keys(data.results[0]));
        console.log("Stats:", {
            added: data.results[0].added,
            added_by_status: data.results[0].added_by_status,
            playtime: data.results[0].playtime,
            suggestions_count: data.results[0].suggestions_count,
            ratings_count: data.results[0].ratings_count,
            metacritic: data.results[0].metacritic
        });
    }
}
testFetch();
