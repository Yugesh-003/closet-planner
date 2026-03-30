import { useState } from 'react';
import { useEvents } from '../hooks/useEvents';

export function EventsPage() {
  const { events, loading, addEvent, deleteEvent } = useEvents();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    type: 'casual'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addEvent(formData);
      setShowForm(false);
      setFormData({ title: '', date: '', type: 'casual' });
    } catch (error) {
      alert('Failed to add event');
    }
  };

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date());
  const pastEvents = events.filter(e => new Date(e.date) < new Date());

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
          >
            {showForm ? 'Cancel' : 'Add Event'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Add New Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Event Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="function">Function</option>
                  <option value="interview">Interview</option>
                  <option value="party">Party</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
              >
                Add Event
              </button>
            </form>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500">No upcoming events</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.eventId} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString()} • {event.type}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteEvent(event.eventId)}
                      className="text-red-600 hover:text-red-800 px-4 py-2"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Past Events</h2>
              <div className="space-y-3">
                {pastEvents.map(event => (
                  <div key={event.eventId} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center opacity-75">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString()} • {event.type}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteEvent(event.eventId)}
                      className="text-red-600 hover:text-red-800 px-4 py-2"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

  );
}
