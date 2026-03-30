import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

export function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-purple-600">
              ClosetMind
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md">
                Dashboard
              </Link>
              <Link to="/wardrobe" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md">
                Wardrobe
              </Link>
              <Link to="/calendar" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md">
                Calendar
              </Link>
              <Link to="/events" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md">
                Events
              </Link>
              <Link to="/suggestions" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md">
                Suggestions
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.name}</span>
            <Link to="/settings" className="text-gray-700 hover:text-purple-600">
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
