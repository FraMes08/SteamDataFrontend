
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const appid = searchParams.get('appid');

    if (!appid) {
        return NextResponse.json({ error: 'Missing appid' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appid}`, {
            next: { revalidate: 60 } // Cache for 1 minute
        });
        
        if (response.status === 404 || response.status === 400) {
             // Se Steam non trova il gioco, non è un errore server grave.
             return NextResponse.json({ response: { player_count: null, result: 0 } });
        }

        if (!response.ok) {
            throw new Error(`Steam API error: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.warn(`Steam Proxy Warning for AppID ${appid}:`, error.message);
        // Ritorniamo sempre 200 con null per evitare errori rossi in console client
        return NextResponse.json({ response: { player_count: null, result: 0 } });
    }
}
