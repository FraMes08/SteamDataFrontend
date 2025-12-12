/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    reactCompiler: true,
    
    // Configurazione delle immagini per autorizzare i domini esterni
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'shared.fastly.steamstatic.com',
            },
            {
                protocol: 'https',
                hostname: 'cdn.akamai.steamstatic.com', 
            },
            {
                protocol: 'https',
                hostname: 'steamcdn-a.akamaihd.net', 
            },
            {
                protocol: 'https',
                hostname: 'assets.cheapshark.com', 
            },
            {
                protocol: 'https',
                hostname: 'media.rawg.io', // 💡 Aggiunto per RAWG
            },
        ],
    },
};

export default nextConfig;