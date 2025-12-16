
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
        
        if (!response.ok) {
            throw new Error(`Steam API error: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Steam Proxy Error:", error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
