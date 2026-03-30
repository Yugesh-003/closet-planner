import { useState, useEffect } from 'react';
import { useSuggestions } from '../hooks/useSuggestions';

export function SuggestionsPage() {
  const { suggestions, loading, getSuggestions } = useSuggestions();
  const [eventType, setEventType] = useState('');

  useEffect(() => {
    getSuggestions();
  }, []);

  const handleGetSuggestions = () => {
    getSuggestions(eventType || undefined);
  };

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Outfit Suggestions</h1>
          <p className="text-gray-600 mt-2">Get personalized outfit recommendations</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Event Type (Optional)</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Any Occasion</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="function">Function</option>
                <option value="interview">Interview</option>
                <option value="party">Party</option>
              </select>
            </div>
            <button
              onClick={handleGetSuggestions}
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:bg-gray-400"
            >
              {loading ? 'Loading...' : 'Get Suggestions'}
            </button>
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recommended Outfits</h2>
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Outfit {index + 1}</h3>
                  <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                    {suggestion.reason}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {suggestion.items.map((item) => (
                    <div key={item.itemId} className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {item.type} • {item.color}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && suggestions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Click "Get Suggestions" to see outfit recommendations</p>
          </div>
        )}
      </div>
  );
}
