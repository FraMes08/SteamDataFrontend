const CHEAPSHARK_API_URL = 'https://www.cheapshark.com/api/1.0/deals';

async function testCalendar() {
    const params = new URLSearchParams({
        storeID: '1',
        sortBy: 'Release',
        pageSize: '50'
    });
    const url = `${CHEAPSHARK_API_URL}?${params.toString()}`;
    console.log("Fetching:", url);
    const res = await fetch(url);
    const data = await res.json();
    
    const now = Date.now() / 1000;
    const upcoming = data.filter(d => d.releaseDate > now);
    const recent = data.filter(d => d.releaseDate <= now);
    
    console.log(`Total: ${data.length}`);
    console.log(`Upcoming: ${upcoming.length}`);
    console.log(`Recent: ${recent.length}`);
    
    if (recent.length > 0) {
        console.log("Recent Sample:", JSON.stringify(recent.slice(0, 3), null, 2));
    } else {
        console.log("No recent games found in the first 50 results.");
    }
}

testCalendar();
