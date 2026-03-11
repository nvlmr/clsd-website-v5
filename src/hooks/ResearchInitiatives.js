import { useState, useEffect, useCallback } from 'react';
import { checkServerAvailability, getResearchInitiatives } from '../services/research_initiatives_api';
import localResearchInitiatives from '../data/ResearchInitiatives';

// Custom hook for managing research initiatives data with fallback to local data
const useResearchInitiatives = (initialFilters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('local'); // 'local' or 'database'
  const [serverAvailable, setServerAvailable] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Function to check server availability
  const checkServer = useCallback(async () => {
    try {
      const isAvailable = await checkServerAvailability();
      setServerAvailable(isAvailable);
      return isAvailable;
    } catch (err) {
      console.warn('Server check failed:', err);
      setServerAvailable(false);
      return false;
    }
  }, []);

  // Function to fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if server is available
      const isServerAvailable = await checkServer();
      
      if (isServerAvailable) {
        // Try to fetch from database
        const result = await getResearchInitiatives(filters);
        
        if (result.success && result.data) {
          setData(result.data);
          setSource('database');
          setError(null);
        } else {
          // If database fetch fails, use local data
          console.warn('Database fetch failed, using local data:', result.error);
          setData(localResearchInitiatives);
          setSource('local');
          setError('Using local data - Database connection issue');
        }
      } else {
        // Server not available, use local data
        console.log('Server not available, using local data');
        setData(localResearchInitiatives);
        setSource('local');
        setError('Using local data - Server not available');
      }
    } catch (err) {
      console.error('Error in fetchData:', err);
      // Fallback to local data on any error
      setData(localResearchInitiatives);
      setSource('local');
      setError('Error loading data - Using local copy');
    } finally {
      setLoading(false);
    }
  }, [filters, checkServer]);

  // Function to refetch data
  const refetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1);
  }, []);

  // Function to update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Function to clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Effect to fetch data when filters change or refetch is triggered
  useEffect(() => {
    fetchData();
  }, [fetchData, refetchTrigger]);

  // Function to get a single initiative by ID
  const getInitiativeById = useCallback((id) => {
    if (!id) return null;
    
    // Try to find in current data first
    let found = data.find(item => item.id === parseInt(id));
    
    // If not found in current data, try local data
    if (!found) {
      found = localResearchInitiatives.find(item => item.id === parseInt(id));
    }
    
    return found || null;
  }, [data]);

  // Function to get initiatives by status
  const getInitiativesByStatus = useCallback((status) => {
    return data.filter(item => item.status === status);
  }, [data]);

  // Function to get featured initiatives
  const getFeaturedInitiatives = useCallback(() => {
    return data.filter(item => item.featured === 1);
  }, [data]);

  return {
    // Data
    data,
    localData: localResearchInitiatives,
    
    // Status
    loading,
    error,
    source,
    serverAvailable,
    
    // Filters
    filters,
    updateFilters,
    clearFilters,
    
    // Actions
    refetch,
    getInitiativeById,
    getInitiativesByStatus,
    getFeaturedInitiatives,
    
    // Metadata
    totalCount: data.length,
    featuredCount: data.filter(item => item.featured === 1).length,
    ongoingCount: data.filter(item => item.status === 'ongoing').length,
    completedCount: data.filter(item => item.status === 'completed').length,
    upcomingCount: data.filter(item => item.status === 'upcoming').length
  };
};

export default useResearchInitiatives;