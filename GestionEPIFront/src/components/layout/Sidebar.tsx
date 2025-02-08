export const Sidebar: React.FC<{
    activeItem: string;
    setActiveItem: (item: string) => void;
}> = ({ activeItem, setActiveItem }) => {
    return (
        <aside className="w-64 min-h-screen bg-gray-800 text-white">
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-8">GestEPI</h1>
            <nav>
            <ul className="space-y-2">
                <li>
                <button
                    onClick={() => setActiveItem('epi')}
                    className={`w-full px-4 py-2 text-left rounded transition-colors ${
                    activeItem === 'epi' 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-700'
                    }`}
                >
                    Liste EPI
                </button>
                </li>
                <li>
                <button
                    onClick={() => setActiveItem('controles')}
                    className={`w-full px-4 py-2 text-left rounded transition-colors ${
                    activeItem === 'controles' 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-700'
                    }`}
                >
                    Liste des contrôles
                </button>
                </li>
            </ul>
            </nav>
        </div>
        </aside>
    );
};