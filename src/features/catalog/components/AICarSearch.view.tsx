import React, { useState, useEffect } from 'react';
import { searchWithGemini } from '@/core/ai/gemini.service';
import { AIResponse, GroundingChunk } from '@/core/ai/ai.types';
import Alert from '@/shared/components/ui/Alert';

interface AICarSearchProps {
  onSearchComplete: (location: string | null) => void;
}

const AICarSearch: React.FC<AICarSearchProps> = ({ onSearchComplete }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.log("Geolocation permission denied or error:", err);
        }
      );
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await searchWithGemini(query, userLocation);
      setResponse(result);
      // In a real implementation, we would try to match the map result location to our car DB
      // For now, we inform the parent component something happened
      onSearchComplete(null);
    } catch (err) {
      setError("Não foi possível processar sua busca com a IA no momento. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderGroundingSource = (chunk: GroundingChunk, index: number) => {
    if (chunk.maps && chunk.maps.uri) {
      return (
        <a
          key={index}
          href={chunk.maps.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-2"
        >
          <div className="bg-green-100 p-2 rounded-full text-green-600 mr-3">
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 text-sm">{chunk.maps.title || "Unknown Location"}</h4>
            <p className="text-xs text-gray-500">View on Google Maps</p>
          </div>
          <i className="fas fa-external-link-alt text-gray-400 text-xs"></i>
        </a>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative z-10">
        <div className="flex shadow-lg rounded-full overflow-hidden border border-gray-200 bg-white p-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pergunte à IA: 'Carros para viagem na serra' ou 'Estacionamento perto da Paulista'"
            className="flex-grow px-6 py-4 text-gray-700 focus:outline-none placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#3667AA] text-white rounded-full px-8 py-3 font-semibold hover:opacity-95 transition-opacity disabled:bg-gray-200 disabled:text-gray-500 my-auto mr-1"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="loader-container h-5 w-5" viewBox="25 25 50 50" style={{ width: '1.5em', height: '1.5em' }}>
                  <circle className="loader-svg loader-white" cx="50" cy="50" r="20"></circle>
                </svg>
                <span>Pensando...</span>
              </div>
            ) : (
              <span className="flex items-center gap-2">
                <i className="fas fa-sparkles"></i>
                <span>Perguntar</span>
              </span>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4">
          <Alert type="error" title="Erro na busca" onClose={() => setError(null)}>
            {error}
          </Alert>
        </div>
      )}

      {response && (
        <div className="mt-6 bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-indigo-100 shadow-lg animate-fade-in">
          <div className="mb-4 text-gray-800 leading-relaxed">
            <div className="font-medium text-indigo-900 mb-2 flex items-center gap-2">
              <i className="fas fa-robot text-indigo-500"></i> Sugestão Gemini
            </div>
            <p className="whitespace-pre-wrap text-sm">{response.text}</p>
          </div>

          {response.groundingChunks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                Locais Encontrados (Google Maps)
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {response.groundingChunks.map(renderGroundingSource)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AICarSearch;