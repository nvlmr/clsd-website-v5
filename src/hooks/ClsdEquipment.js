// src/hooks/ClsdEquipment.js

import { useState, useEffect, useCallback } from 'react';
import { fetchEquipmentWithFallback, checkServerAvailability } from '../services/clsd_equipment_api';

/**
 * Custom hook for managing equipment data with server fallback
 * @returns {Object} Equipment data and state
 */
export const useEquipmentData = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('mock'); // 'server' or 'mock'
  const [serverAvailable, setServerAvailable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [imageErrors, setImageErrors] = useState({}); // Track images that failed to load

  // Fetch equipment data
  const fetchData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    // Clear only critical errors, keep image errors
    setError(null);

    try {
      const result = await fetchEquipmentWithFallback();
      
      setEquipment(result.data);
      setDataSource(result.source);
      
      // Check server availability separately
      const available = await checkServerAvailability();
      setServerAvailable(available);

      // Preload images to detect errors
      result.data.forEach(item => {
        if (item.image && typeof item.image === 'string') {
          const img = new Image();
          img.src = item.image;
          img.onerror = () => {
            setImageErrors(prev => ({ ...prev, [item.id]: true }));
          };
        }
      });
    } catch (err) {
      // This should rarely happen now
      console.error('Failed to fetch equipment:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Check server availability periodically
  useEffect(() => {
    const checkServer = async () => {
      const available = await checkServerAvailability();
      setServerAvailable(available);
      
      // If server becomes available, refresh data
      if (available && dataSource === 'mock') {
        fetchData(true);
      }
    };

    // Check server status every 30 seconds
    const interval = setInterval(checkServer, 30000);
    
    return () => clearInterval(interval);
  }, [dataSource, fetchData]);

  // Refresh data function
  const refreshData = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  // Get equipment by ID
  const getEquipmentById = useCallback((id) => {
    return equipment.find(item => item.id === parseInt(id)) || null;
  }, [equipment]);

  // Filter equipment by status
  const getEquipmentByStatus = useCallback((status) => {
    return equipment.filter(item => item.status === status);
  }, [equipment]);

  // Get equipment by year acquired
  const getEquipmentByYear = useCallback((year) => {
    return equipment.filter(item => item.year_acquired === year);
  }, [equipment]);

  // Search equipment by name or description
  const searchEquipment = useCallback((query) => {
    const searchTerm = query.toLowerCase();
    return equipment.filter(item => 
      item.name.toLowerCase().includes(searchTerm) ||
      (item.description && item.description.toLowerCase().includes(searchTerm)) ||
      (item.model && item.model.toLowerCase().includes(searchTerm)) ||
      (item.applications && item.applications.some(app => 
        app.toLowerCase().includes(searchTerm)
      ))
    );
  }, [equipment]);

  // Check if image failed to load for an equipment
  const hasImageError = useCallback((equipmentId) => {
    return imageErrors[equipmentId] || false;
  }, [imageErrors]);

  // Clear image error for retry
  const retryImageLoad = useCallback((equipmentId) => {
    setImageErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[equipmentId];
      return newErrors;
    });
  }, []);

  return {
    equipment,
    loading,
    error, // This will now be null when using mock data
    dataSource,
    serverAvailable,
    refreshing,
    refreshData,
    getEquipmentById,
    getEquipmentByStatus,
    getEquipmentByYear,
    searchEquipment,
    hasImageError,
    retryImageLoad,
    isEmpty: equipment.length === 0
  };
};

/**
 * Custom hook for paginated equipment data
 * @param {number} itemsPerPage Number of items per page
 * @returns {Object} Paginated equipment data and controls
 */
export const usePaginatedEquipment = (itemsPerPage = 8) => {
  const [currentPage, setCurrentPage] = useState(1);
  const equipmentHook = useEquipmentData();
  
  const { equipment, loading } = equipmentHook;
  
  const totalPages = Math.max(1, Math.ceil(equipment.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = equipment.slice(startIndex, endIndex);

  // Reset to page 1 when equipment changes
  useEffect(() => {
    setCurrentPage(1);
  }, [equipment.length]);

  const goToPage = (page) => {
    const targetPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(targetPage);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return {
    ...equipmentHook,
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    startIndex,
    endIndex,
    totalItems: equipment.length
  };
};

/**
 * Custom hook for equipment filtering
 * @returns {Object} Filtered equipment data and filter controls
 */
export const useEquipmentFilters = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    year: 'all',
    search: ''
  });

  const equipmentHook = useEquipmentData();
  const { equipment } = equipmentHook;

  // Get unique years for filter dropdown
  const availableYears = [...new Set(
    equipment
      .map(item => item.year_acquired)
      .filter(year => year != null)
  )].sort((a, b) => b - a);

  // Apply filters
  const filteredEquipment = equipment.filter(item => {
    // Status filter
    if (filters.status !== 'all' && item.status !== filters.status) {
      return false;
    }

    // Year filter
    if (filters.year !== 'all' && item.year_acquired !== parseInt(filters.year)) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchTerm) ||
        (item.description && item.description.toLowerCase().includes(searchTerm)) ||
        (item.model && item.model.toLowerCase().includes(searchTerm)) ||
        (item.applications && item.applications.some(app => 
          app.toLowerCase().includes(searchTerm)
        ))
      );
    }

    return true;
  });

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      year: 'all',
      search: ''
    });
  };

  return {
    ...equipmentHook,
    filters,
    filteredEquipment,
    availableYears,
    updateFilter,
    resetFilters
  };
};