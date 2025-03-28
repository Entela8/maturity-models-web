import React, { useState } from 'react';

const maturityLevels = [
    { id: 1, name: "Initial", description: "Processus non structuré, imprévisible et réactif." },
    { id: 2, name: "Répété", description: "Processus répétitif mais non documenté de manière formelle." },
    { id: 3, name: "Défini", description: "Processus standardisé et bien documenté." },
    { id: 4, name: "Géré", description: "Processus mesuré et contrôlé." },
    { id: 5, name: "Optimisé", description: "Amélioration continue et optimisation des processus." }
];

const MaturityModel = () => {
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Modèle de Maturité</h1>
            <p className="mb-6">Sélectionnez votre niveau de maturité :</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {maturityLevels.map(level => (
                    <div 
                        key={level.id} 
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 shadow-sm ${selectedLevel === level.id ? 'bg-blue-100 border-blue-500' : 'hover:shadow-md'}`}
                        onClick={() => setSelectedLevel(level.id)}
                    >
                        <h2 className="text-xl font-semibold">{level.name}</h2>
                        <p className="text-sm text-gray-600">{level.description}</p>
                    </div>
                ))}
            </div>
            {selectedLevel && (
                <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded">
                    <p className="text-green-800 font-medium">Vous avez sélectionné : <strong>{maturityLevels.find(l => l.id === selectedLevel)?.name}</strong></p>
                </div>
            )}
        </div>
    );
};

export default MaturityModel;
