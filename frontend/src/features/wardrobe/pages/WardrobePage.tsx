import { useState } from 'react';
import { useWardrobe } from '../hooks/useWardrobe';

export function WardrobePage() {
  const { items, loading, addItem, deleteItem } = useWardrobe();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'top',
    category: 'casual',
    color: '',
    fabric: '',
    occasion: [] as string[],
    comfort: 'high',
    weatherSuitability: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addItem(formData);
      setShowForm(false);
      setFormData({
        name: '',
        type: 'top',
        category: 'casual',
        color: '',
        fabric: '',
        occasion: [],
        comfort: 'high',
        weatherSuitability: []
      });
    } catch (error) {
      alert('Failed to add item');
    }
  };

  const toggleArrayValue = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter(v => v !== value)
      : [...array, value];
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Wardrobe</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
          >
            {showForm ? 'Cancel' : 'Add Item'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="dress">Dress</option>
                    <option value="saree">Saree</option>
                    <option value="traditional">Traditional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                    <option value="traditional">Traditional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fabric</label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({...formData, fabric: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Comfort</label>
                  <select
                    value={formData.comfort}
                    onChange={(e) => setFormData({...formData, comfort: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Occasions</label>
                <div className="flex flex-wrap gap-2">
                  {['college', 'office', 'function', 'casual', 'party'].map(occ => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        occasion: toggleArrayValue(formData.occasion, occ)
                      })}
                      className={`px-3 py-1 rounded-full text-sm ${
                        formData.occasion.includes(occ)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Weather Suitability</label>
                <div className="flex flex-wrap gap-2">
                  {['hot', 'cold', 'rain'].map(weather => (
                    <button
                      key={weather}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        weatherSuitability: toggleArrayValue(formData.weatherSuitability, weather)
                      })}
                      className={`px-3 py-1 rounded-full text-sm ${
                        formData.weatherSuitability.includes(weather)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {weather}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
              >
                Add Item
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.itemId} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <button
                  onClick={() => deleteItem(item.itemId)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Type:</span> {item.type}</p>
                <p><span className="font-medium">Color:</span> {item.color}</p>
                <p><span className="font-medium">Category:</span> {item.category}</p>
                <p><span className="font-medium">Worn:</span> {item.timesWorn} times</p>
                {item.lastWorn && (
                  <p><span className="font-medium">Last worn:</span> {new Date(item.lastWorn).toLocaleDateString()}</p>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {item.occasion.map(occ => (
                  <span key={occ} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                    {occ}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && !showForm && (
          <div className="text-center py-12 text-gray-500">
            <p>No items in your wardrobe yet. Add your first item to get started!</p>
          </div>
        )}
      </div>
  );
}
