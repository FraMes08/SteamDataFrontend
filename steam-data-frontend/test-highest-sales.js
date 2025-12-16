const CHEAPSHARK_API_URL = 'https://www.cheapshark.com/api/1.0/deals';

async function testHighestSavings() {
    const params = new URLSearchParams({
        storeID: '1',
        sortBy: 'Savings',
        pageSize: '25',
        pageNumber: '0'
    });

    const url = `${CHEAPSHARK_API_URL}?${params.toString()}`;
    console.log("Fetching:", url);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Error:", response.status, response.statusText);
            return;
        }
        const data = await response.json();
        console.log("Data length:", data.length);
        if (data.length > 0) {
            console.log("First item:", JSON.stringify(data[0], null, 2));
        }
    } catch (e) {
        console.error("Exception:", e);
    }
}

testHighestSavings();
