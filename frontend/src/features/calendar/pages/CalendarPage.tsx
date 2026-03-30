import { useState, useEffect } from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { useWardrobe } from '../../wardrobe/hooks/useWardrobe';

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().substring(0, 7));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { outfits, logOutfit, fetchOutfits } = useCalendar();
  const { items } = useWardrobe();

  useEffect(() => {
    fetchOutfits(currentMonth);
  }, [currentMonth]);

  const getDaysInMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month - 1, i));
    }

    return days;
  };

  const handleSaveOutfit = async () => {
    if (!selectedDate || selectedItems.length === 0) return;

    try {
      await logOutfit({
        date: selectedDate,
        itemIds: selectedItems,
        eventType: 'casual'
      });
      setSelectedDate(null);
      setSelectedItems([]);
    } catch (error) {
      alert('Failed to save outfit');
    }
  };

  const getOutfitForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return outfits.find(o => o.date === dateStr);
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Outfit Calendar</h1>
          <input
            type="month"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth().map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const outfit = getOutfitForDate(day);
              const dateStr = day.toISOString().split('T')[0];
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === new Date().toISOString().split('T')[0];

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square p-2 rounded-lg border-2 transition ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50'
                      : outfit
                      ? 'border-green-300 bg-green-50'
                      : isToday
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">{day.getDate()}</div>
                  {outfit && (
                    <div className="text-xs text-green-600 mt-1">
                      {outfit.itemIds.length} items
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {selectedDate && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Log Outfit for {new Date(selectedDate).toLocaleDateString()}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Items</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {items.map(item => (
                    <button
                      key={item.itemId}
                      onClick={() => {
                        setSelectedItems(prev =>
                          prev.includes(item.itemId)
                            ? prev.filter(id => id !== item.itemId)
                            : [...prev, item.itemId]
                        );
                      }}
                      className={`p-3 rounded-lg border-2 text-left transition ${
                        selectedItems.includes(item.itemId)
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-600">{item.type} • {item.color}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveOutfit}
                  disabled={selectedItems.length === 0}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 disabled:bg-gray-300"
                >
                  Save Outfit ({selectedItems.length} items)
                </button>
                <button
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedItems([]);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
   
  );
}
