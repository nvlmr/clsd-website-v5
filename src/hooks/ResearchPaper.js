// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\hooks\ResearchPaper.js

import { useState, useEffect, useCallback } from "react";
import { 
  fetchResearchPapers, 
  fetchResearchPaperById, 
  checkServerHealth,
  downloadResearchPaper 
} from "../services/research_paper_api";

export const useResearchPapers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const [serverAvailable, setServerAvailable] = useState(null);

  // Check server availability on mount
  useEffect(() => {
    const checkServer = async () => {
      const health = await checkServerHealth();
      setServerAvailable(health.available);
    };
    checkServer();
  }, []);

  // Fetch all research papers
  const fetchAllPapers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchResearchPapers();
      
      if (result.success) {
        setPapers(result.data);
        setDataSource(result.source);
        if (result.source === "mock") {
          console.warn("Using mock data - server unavailable");
        }
      } else {
        setError(result.message || "Failed to fetch research papers");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching research papers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single paper by ID
  const fetchPaperById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchResearchPaperById(id);
      
      if (result.success) {
        setDataSource(result.source);
        return result.data;
      } else {
        setError(result.message || "Paper not found");
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Download a paper
  const downloadPaper = useCallback(async (paper) => {
    try {
      const result = await downloadResearchPaper(paper);
      return result;
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  }, []);

  // Filter papers by search query
  const searchPapers = useCallback((query, searchKeys = ['title', 'student', 'adviser', 'degree', 'tags']) => {
    if (!query || query.trim() === "") {
      return papers;
    }
    
    const lowerQuery = query.toLowerCase();
    return papers.filter(paper => {
      return searchKeys.some(key => {
        const value = paper[key];
        if (!value) return false;
        return String(value).toLowerCase().includes(lowerQuery);
      });
    });
  }, [papers]);

  // Filter papers by type (Thesis/Dissertation)
  const filterByType = useCallback((type, papersList = papers) => {
    if (!type || type === 'all') {
      return papersList;
    }
    
    return papersList.filter(paper => {
      if (!paper.tags) return false;
      return paper.tags.toLowerCase().includes(type.toLowerCase());
    });
  }, [papers]);

  // Get unique manuscript types for filter
  const getManuscriptTypes = useCallback(() => {
    const types = new Set();
    papers.forEach(paper => {
      if (paper.tags) {
        const tags = paper.tags.split(',').map(tag => tag.trim());
        tags.forEach(tag => {
          if (tag === 'Thesis' || tag === 'Dissertation') {
            types.add(tag);
          }
        });
      }
    });
    return ['all', ...Array.from(types)];
  }, [papers]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchAllPapers();
  }, [fetchAllPapers]);

  // Initial fetch on mount
  useEffect(() => {
    fetchAllPapers();
  }, [fetchAllPapers]);

  return {
    papers,
    loading,
    error,
    dataSource,
    serverAvailable,
    fetchAllPapers,
    fetchPaperById,
    downloadPaper,
    searchPapers,
    filterByType,
    getManuscriptTypes,
    refresh
  };
};

/**
 * Custom hook for managing a single research paper
 */
export const useResearchPaper = (id) => {
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState(null);

  useEffect(() => {
    const fetchPaper = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchResearchPaperById(id);
        
        if (result.success) {
          setPaper(result.data);
          setDataSource(result.source);
          if (result.source === "mock") {
            console.warn("Using mock data - server unavailable");
          }
        } else {
          setError(result.message || "Failed to fetch research paper");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaper();
  }, [id]);

  const downloadPaper = useCallback(async () => {
    if (!paper) return;
    try {
      return await downloadResearchPaper(paper);
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  }, [paper]);

  return {
    paper,
    loading,
    error,
    dataSource,
    downloadPaper
  };
};