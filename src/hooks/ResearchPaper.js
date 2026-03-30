// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\hooks\ResearchPaper.js
import { useState, useEffect, useCallback } from 'react';
import researchPaperApi from '../services/research_paper_api.js';
import researchPapersData from "../data/ResearchPaper.js";

export const useResearchPapers = (initialOptions = {}) => {
  const {
    autoFetch = true,
    useMockData = false
  } = initialOptions;

  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMock, setUsingMock] = useState(useMockData);
  const [apiAvailable, setApiAvailable] = useState(null);
  const [downloading, setDownloading] = useState(null);

  // Set mock data usage if specified
  useEffect(() => {
    researchPaperApi.setUseMockData(useMockData);
    setUsingMock(useMockData);
  }, [useMockData]);

  // Search papers function
  const searchPapers = useCallback((query) => {
    if (!query || query.trim() === '') {
      return papers;
    }
    
    const searchTerm = query.toLowerCase();
    return papers.filter(paper => {
      return (
        paper.title?.toLowerCase().includes(searchTerm) ||
        paper.student?.toLowerCase().includes(searchTerm) ||
        paper.adviser?.toLowerCase().includes(searchTerm) ||
        paper.degree?.toLowerCase().includes(searchTerm) ||
        paper.tags?.toLowerCase().includes(searchTerm) ||
        paper.year?.toString().includes(searchTerm)
      );
    });
  }, [papers]);

  // Fetch research papers
  const fetchResearchPapers = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await researchPaperApi.fetchResearchPapers();
      setPapers(result);
      
      // Check if we're using mock data
      const isUsingMock = researchPaperApi.useMockData;
      setUsingMock(isUsingMock);
      
      if (isUsingMock) {
        console.log('Currently using mock data for research papers');
      }
      
    } catch (err) {
      setError(err.message || 'Failed to fetch research papers');
      console.error('Error in useResearchPapers hook:', err);
      
      // Fallback to mock data on error
      setPapers(researchPapersData);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get manuscript types from tags
  const getManuscriptTypes = useCallback(() => {
    const types = new Set();
    papers.forEach(paper => {
      if (paper.tags) {
        const tags = paper.tags.split(',').map(t => t.trim());
        tags.forEach(tag => {
          if (tag === 'Thesis' || tag === 'Dissertation') {
            types.add(tag);
          }
        });
      }
    });
    return Array.from(types);
  }, [papers]);

  // Download paper with progress tracking
  const downloadPaper = useCallback(async (paper) => {
    if (!paper.document) {
      throw new Error("No document available for download");
    }
    
    setDownloading(paper.id);
    
    try {
      const result = await researchPaperApi.downloadPaper(paper);
      return result;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    } finally {
      setDownloading(null);
    }
  }, []);

  // Get paper by ID
  const getPaperById = useCallback(async (id) => {
    // First try from current data
    const fromCurrentData = papers.find(paper => paper.id === parseInt(id));
    if (fromCurrentData) return fromCurrentData;
    
    // Otherwise fetch fresh
    try {
      const paper = await researchPaperApi.getResearchPaperById(id);
      return paper;
    } catch (error) {
      console.error('Error fetching paper by ID:', error);
      return null;
    }
  }, [papers]);

  // Check API health
  const checkApiHealth = useCallback(async () => {
    const available = await researchPaperApi.checkApiHealth();
    setApiAvailable(available);
    return available;
  }, []);

  // Refresh data
  const refresh = useCallback(() => {
    return fetchResearchPapers(true);
  }, [fetchResearchPapers]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchResearchPapers();
    }
  }, [autoFetch, fetchResearchPapers]);

  return {
    // Data
    papers,
    loading,
    error,
    usingMock,
    apiAvailable,
    downloading,
    
    // Methods
    fetchResearchPapers,
    searchPapers,
    getPaperById,
    downloadPaper,
    getManuscriptTypes,
    refresh,
    checkApiHealth,
    
    // Setters
    setUseMockData: (useMock) => {
      researchPaperApi.setUseMockData(useMock);
      setUsingMock(useMock);
      if (!useMock) {
        fetchResearchPapers(true);
      }
    }
  };
};

export default useResearchPapers;