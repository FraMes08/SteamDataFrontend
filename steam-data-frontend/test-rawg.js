const RAWG_API_KEY = "1b4206f56a884d10a5d8250a23715285"; // Hardcoded for test
const RAWG_API_URL = "https://api.rawg.io/api";

async function testFetch() {
    const url = `${RAWG_API_URL}/games?key=${RAWG_API_KEY}&page_size=1`;
    console.log("Fetching:", url);
    const res = await fetch(url);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
        const game = data.results[0];
        console.log("Name:", game.name);
        console.log("Short Description:", game.short_description); // Check this field
        console.log("Keys:", Object.keys(game));
    } else {
        console.log("No results");
    }
}

testFetch();
