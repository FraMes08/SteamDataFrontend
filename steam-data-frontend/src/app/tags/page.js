// app/tags/page.js (VERSIONE COMPLETAMENTE DINAMICA CON RAWG)
import Link from 'next/link';
import Header from '../../components/Header'; 
import { fetchRawgGenres } from '@/lib/rawg-api'; // 💡 Import della nuova funzione

// Funzione per raggruppare e ordinare i tag (rimane la stessa logica)
function groupAndSortTags(tags) {
    // 1. Ordina alfabeticamente per nome
    const sortedTags = tags.sort((a, b) => a.name.localeCompare(b.name)); 

    // 2. Raggruppa i tag per la loro prima lettera
    return sortedTags.reduce((acc, tag) => {
        const initial = tag.name[0].toUpperCase();
        // Ignora tag che non iniziano con una lettera (es. simboli)
        if (!initial.match(/[A-Z]/)) return acc; 
        
        if (!acc[initial]) {
            acc[initial] = [];
        }
        acc[initial].push(tag);
        return acc;
    }, {});
}


export default async function TagsPage() { // Server Component Asincrono
    // 💡 Chiama la nuova API dinamica
    const ALL_TAGS = await fetchRawgGenres(); 
    const groupedTags = groupAndSortTags(ALL_TAGS);
    
    const initials = Object.keys(groupedTags).sort();

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header /> 
            
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-extrabold text-blue-400 mb-2">🏷 Sfoglia per Genere e Tag</h1>
                <p className="text-gray-400 mb-10">
                    Scegli un genere per vedere i giochi ordinati in base al rating Metacritic.
                </p>
                
                {ALL_TAGS.length === 0 ? (
                    <p className="text-red-400 text-center">
                        Errore: Impossibile caricare i generi. Controlla la chiave RAWG e la connessione.
                    </p>
                ) : (
                    <div className="space-y-8">
                        {initials.map((initial) => (
                            <div key={initial}>
                                {/* Lettera Iniziale (A, B, C...) */}
                                <h2 className="text-5xl font-extrabold text-gray-600 mb-4 border-b border-gray-700 pb-2">
                                    {initial}
                                </h2>

                                {/* Elenco dei Tag per quella lettera */}
                                <div className="flex flex-wrap gap-3">
                                    {groupedTags[initial].map((tag) => (
                                        <Link 
                                            key={tag.slug} 
                                            // 💡 IMPORTANTE: Il filtro del gioco [tag_slug] DEVE usare lo SLUG RAWG
                                            href={`/tags/${tag.slug}`} 
                                            className="px-4 py-2 bg-gray-700 hover:bg-blue-600 rounded-full shadow-md transition duration-200 text-sm font-medium border border-gray-600 hover:border-blue-500"
                                        >
                                            {tag.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}