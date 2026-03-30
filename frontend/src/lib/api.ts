import axios from 'axios';

// Update this with your actual API Gateway URL after deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-api-gateway-url.amazonaws.com/prod';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('idToken');
  
  // For test account, handle requests with localStorage
  if (token === 'dev-token') {
    const url = config.url || '';
    const method = config.method?.toUpperCase();
    
    // Handle wardrobe operations
    if (url.includes('/wardrobe')) {
      const items = JSON.parse(localStorage.getItem('test-wardrobe') || '[]');
      
      if (method === 'GET') {
        return Promise.reject({
          config,
          response: { data: { items }, status: 200 },
          __CANCEL__: true
        });
      } else if (method === 'POST') {
        const newItem = { ...config.data, itemId: Date.now().toString(), timesWorn: 0 };
        items.push(newItem);
        localStorage.setItem('test-wardrobe', JSON.stringify(items));
        return Promise.reject({
          config,
          response: { data: newItem, status: 201 },
          __CANCEL__: true
        });
      } else if (method === 'DELETE') {
        const itemId = url.split('/').pop();
        const filtered = items.filter((i: any) => i.itemId !== itemId);
        localStorage.setItem('test-wardrobe', JSON.stringify(filtered));
        return Promise.reject({
          config,
          response: { data: { success: true }, status: 200 },
          __CANCEL__: true
        });
      }
    }
    
    // Handle events operations
    if (url.includes('/events')) {
      const events = JSON.parse(localStorage.getItem('test-events') || '[]');
      
      if (method === 'GET') {
        return Promise.reject({
          config,
          response: { data: { events }, status: 200 },
          __CANCEL__: true
        });
      } else if (method === 'POST') {
        const newEvent = { ...config.data, eventId: Date.now().toString() };
        events.push(newEvent);
        localStorage.setItem('test-events', JSON.stringify(events));
        return Promise.reject({
          config,
          response: { data: newEvent, status: 201 },
          __CANCEL__: true
        });
      } else if (method === 'DELETE') {
        const eventId = url.split('/').pop();
        const filtered = events.filter((e: any) => e.eventId !== eventId);
        localStorage.setItem('test-events', JSON.stringify(filtered));
        return Promise.reject({
          config,
          response: { data: { success: true }, status: 200 },
          __CANCEL__: true
        });
      }
    }
    
    // Handle outfit operations
    if (url.includes('/outfit')) {
      const outfits = JSON.parse(localStorage.getItem('test-outfits') || '[]');
      
      if (method === 'GET') {
        return Promise.reject({
          config,
          response: { data: { outfits }, status: 200 },
          __CANCEL__: true
        });
      } else if (method === 'POST') {
        const newOutfit = config.data;
        outfits.push(newOutfit);
        localStorage.setItem('test-outfits', JSON.stringify(outfits));
        return Promise.reject({
          config,
          response: { data: newOutfit, status: 201 },
          __CANCEL__: true
        });
      }
    }
    
    // Handle other endpoints with empty data
    if (url.includes('/outfits') || url.includes('/calendar')) {
      return Promise.reject({
        config,
        response: { data: { outfits: [] }, status: 200 },
        __CANCEL__: true
      });
    }
    if (url.includes('/suggestions')) {
      return Promise.reject({
        config,
        response: { data: { suggestions: [] }, status: 200 },
        __CANCEL__: true
      });
    }
    if (url.includes('/analytics')) {
      return Promise.reject({
        config,
        response: { data: { totalItems: 0, mostWorn: [], leastWorn: [] }, status: 200 },
        __CANCEL__: true
      });
    }
    if (url.includes('/preferences')) {
      return Promise.reject({
        config,
        response: { data: { notificationsEnabled: true }, status: 200 },
        __CANCEL__: true
      });
    }
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock responses for test account
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle cancelled requests from test account
    if (error.__CANCEL__) {
      return Promise.resolve(error.response);
    }
    
    const token = localStorage.getItem('idToken');
    // If using test account, return mock data instead of failing
    if (token === 'dev-token') {
      const url = error.config?.url || '';
      if (url.includes('/wardrobe')) {
        return Promise.resolve({ data: { items: [] } });
      }
      if (url.includes('/events')) {
        return Promise.resolve({ data: { events: [] } });
      }
      if (url.includes('/outfits') || url.includes('/calendar')) {
        return Promise.resolve({ data: { outfits: [] } });
      }
      if (url.includes('/suggestions')) {
        return Promise.resolve({ data: { suggestions: [] } });
      }
      if (url.includes('/analytics')) {
        return Promise.resolve({ data: { totalItems: 0, mostWorn: [], leastWorn: [] } });
      }
      if (url.includes('/preferences')) {
        return Promise.resolve({ data: { notificationsEnabled: true } });
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
