import Link from 'next/link';

// Componente per la Barra di Ricerca
const SearchBar = () => {
  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Cerca un gioco o un'app..."
        className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      />
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
    </div>
  );
};

export default function Header({ apiKey }) {
  // L'API Key non è usata qui, ma passarla è un esempio di come gestirla.
  const navItems = [
    { name: 'Offerte', href: '/sales' },
    { name: 'Calendario', href: '/calendar' },
    { name: 'Tag', href: '/tags' },
  ];

  return (
    <header className="bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        
        {/* Logo/Nome Sito */}
        <Link href="/" className="text-2xl font-extrabold text-blue-400 hover:text-blue-300 transition duration-150">
            SteamData
        </Link>
        
        {/* Barra di Ricerca */}
        <SearchBar />
        
        {/* Navigazione */}
        <nav>
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href} 
                  className="text-gray-300 hover:text-blue-400 font-medium transition duration-150"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}