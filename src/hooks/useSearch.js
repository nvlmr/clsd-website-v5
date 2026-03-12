import { useState, useEffect, useCallback } from 'react';

export const useSearch = (initialData = [], searchConfig = {}) => {
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({
    total: 0,
    filtered: 0,
    query: ''
  });

  useEffect(() => {
    setOriginalData(initialData);
    setFilteredData(initialData);
    setSearchResults({
      total: initialData.length,
      filtered: initialData.length,
      query: ''
    });
  }, [initialData]);

  const handleSearchResults = useCallback((results, query) => {
    setFilteredData(results);
    setSearchTerm(query || '');
    setIsSearching(false);
    setSearchResults({
      total: originalData.length,
      filtered: results.length,
      query: query || ''
    });
  }, [originalData.length]);

  const handleSearchStart = useCallback((query) => {
    setIsSearching(true);
    setSearchTerm(query);
  }, []);

  const handleSearchClear = useCallback(() => {
    setFilteredData(originalData);
    setSearchTerm('');
    setIsSearching(false);
    setSearchResults({
      total: originalData.length,
      filtered: originalData.length,
      query: ''
    });
  }, [originalData]);

  const resetSearch = useCallback(() => {
    setFilteredData(originalData);
    setSearchTerm('');
    setIsSearching(false);
    setSearchResults({
      total: originalData.length,
      filtered: originalData.length,
      query: ''
    });
  }, [originalData]);

  return {
    filteredData,
    searchTerm,
    isSearching,
    searchResults,
    handleSearchResults,
    handleSearchStart,
    handleSearchClear,
    resetSearch,
    setFilteredData
  };
};