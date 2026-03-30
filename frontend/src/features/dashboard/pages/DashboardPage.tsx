import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../../shared/components/Layout';
import apiClient from '../../../lib/api';

export function DashboardPage() {
  const [stats, setStats] = useState({
    totalItems: 0,
    recentlyWorn: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [wardrobeRes, eventsRes] = await Promise.all([
          apiClient.get('/wardrobe'),
          apiClient.get('/events')
        ]);
        
        const items = wardrobeRes.data.items || [];
        const events = eventsRes.data.events || [];
        
        setStats({
          totalItems: items.length,
          recentlyWorn: items.filter((item: any) => item.lastWorn).length,
          upcomingEvents: events.filter((event: any) => 
            new Date(event.date) > new Date()
          ).length
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your wardrobe overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600 mb-2">Total Items</div>
          <div className="text-3xl font-bold text-purple-600">{stats.totalItems}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600 mb-2">Recently Worn</div>
          <div className="text-3xl font-bold text-pink-600">{stats.recentlyWorn}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600 mb-2">Upcoming Events</div>
          <div className="text-3xl font-bold text-indigo-600">{stats.upcomingEvents}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/suggestions" className="bg-gradient-to-br from-purple-500 to-pink-500 p-8 rounded-lg shadow-lg text-white hover:shadow-xl transition">
          <h2 className="text-2xl font-bold mb-2">Get Outfit Suggestions</h2>
          <p className="opacity-90">Let us help you pick the perfect outfit for today</p>
        </Link>

        <Link to="/wardrobe" className="bg-gradient-to-br from-indigo-500 to-purple-500 p-8 rounded-lg shadow-lg text-white hover:shadow-xl transition">
          <h2 className="text-2xl font-bold mb-2">Manage Wardrobe</h2>
          <p className="opacity-90">Add, edit, or remove items from your collection</p>
        </Link>
      </div>
    </div>
  );
}
