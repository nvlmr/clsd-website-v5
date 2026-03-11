// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\hooks\NewsEvents.js
import { useState, useEffect, useCallback } from 'react';
import newsEventsApi from '../services/news_events_api.js';
import NewsEventsData from "../data/NewsEvents.js";

const useNewsEvents = (initialOptions = {}) => {
  const {
    autoFetch = true,
    useMockData = false
  } = initialOptions;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMock, setUsingMock] = useState(useMockData);
  const [apiAvailable, setApiAvailable] = useState(null);

  // Set mock data usage if specified
  useEffect(() => {
    newsEventsApi.setUseMockData(useMockData);
    setUsingMock(useMockData);
  }, [useMockData]);

  // Helper function to capitalize type for display
  const capitalizeType = (type) => {
    if (!type) return '';
    
    // Convert to string and lowercase
    const typeStr = String(type).toLowerCase();
    
    // Return capitalized version
    if (typeStr === 'news') return 'News';
    if (typeStr === 'event') return 'Events';
    
    // Default fallback
    return typeStr.charAt(0).toUpperCase() + typeStr.slice(1);
  };

  // Sort function to put featured items first
  const sortWithFeaturedFirst = (items) => {
    return [...items]
      .map(item => ({
        ...item,
        // Ensure type is properly formatted
        displayType: capitalizeType(item.type),
        // Keep original type for filtering
        filterType: item.type ? item.type.toLowerCase() : ''
      }))
      .sort((a, b) => {
        // First sort by featured (true first)
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        // Then by date (newest first)
        const dateA = new Date(a.created_at || a.event_start_date || 0);
        const dateB = new Date(b.created_at || b.event_start_date || 0);
        return dateB - dateA;
      });
  };

  // Fetch news and events
  const fetchNewsEvents = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await newsEventsApi.fetchNewsEvents();
      const sortedResult = sortWithFeaturedFirst(result);
      setData(sortedResult);
      
      // Check if we're using mock data
      const isUsingMock = newsEventsApi.useMockData;
      setUsingMock(isUsingMock);
      
      if (isUsingMock) {
        console.log('Currently using mock data');
      }
      
    } catch (err) {
      setError(err.message || 'Failed to fetch news and events');
      console.error('Error in useNewsEvents hook:', err);
      
      // Fallback to mock data on error and sort it
      const sortedMockData = sortWithFeaturedFirst(NewsEventsData);
      setData(sortedMockData);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check API health
  const checkApiHealth = useCallback(async () => {
    const available = await newsEventsApi.checkApiHealth();
    setApiAvailable(available);
    return available;
  }, []);

  // Get single item by ID
  const getItemById = useCallback(async (id) => {
    // First try from current data
    const fromCurrentData = data.find(item => item.id === id);
    if (fromCurrentData) return fromCurrentData;
    
    // Otherwise fetch fresh
    try {
      const item = await newsEventsApi.getNewsEventById(id);
      return {
        ...item,
        displayType: capitalizeType(item.type),
        filterType: item.type ? item.type.toLowerCase() : ''
      };
    } catch (error) {
      console.error('Error fetching item by ID:', error);
      return null;
    }
  }, [data]);

  // Filter by type (accepts 'news', 'event', or 'all')
  const getItemsByType = useCallback((type) => {
    if (type === 'all' || !type) return data;
    
    const filterValue = type.toLowerCase();
    return data.filter(item => 
      item.filterType === filterValue || 
      (item.type && item.type.toLowerCase() === filterValue)
    );
  }, [data]);

  // Search items
  const searchItems = useCallback((searchTerm, searchKeys = ['title', 'content', 'excerpt', 'category', 'event_location']) => {
    if (!searchTerm.trim()) return data;
    
    const term = searchTerm.toLowerCase();
    return data.filter(item => {
      return searchKeys.some(key => {
        const value = item[key];
        return value && value.toString().toLowerCase().includes(term);
      });
    });
  }, [data]);

  // Refresh data
  const refresh = useCallback(() => {
    return fetchNewsEvents(true);
  }, [fetchNewsEvents]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchNewsEvents();
    }
  }, [autoFetch, fetchNewsEvents]);

  return {
    // Data
    data,
    loading,
    error,
    usingMock,
    apiAvailable,
    
    // Methods
    fetchNewsEvents,
    getItemById,
    getItemsByType,
    searchItems,
    refresh,
    checkApiHealth,
    
    // Setters
    setUseMockData: (useMock) => {
      newsEventsApi.setUseMockData(useMock);
      setUsingMock(useMock);
      if (!useMock) {
        // If switching to live, refresh data
        fetchNewsEvents(true);
      }
    }
  };
};

export default useNewsEvents;