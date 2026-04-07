// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\hooks\DostFundedProject.js

import { useState, useEffect, useCallback } from 'react';
import { dostFundedProjectApi } from '../services/dost_funded_project_api.js';
import localProjects from '../data/DostFundedProject';

export const useDostFundedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  // Process API data to match local data structure
  const processApiData = useCallback((apiData) => {
    if (!apiData || !apiData.data || !Array.isArray(apiData.data)) return [];
    
    return apiData.data.map(project => ({
      id: project.id,
      title: project.title || '',
      description: project.description || '',
      funding_amount: project.funding_amount || 0,
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      status: project.status || '',
      implementing_agency: project.implementing_agency || '',
      cooperating_agency: project.cooperating_agency || '',
      project_lead: project.project_lead || '',
      image: project.image_url || project.image || '',
      gallery: project.gallery_urls || project.gallery || null,
      documents: project.documents_data || project.documents || null,
      published: project.published === 1 || project.published === true,
      featured: project.featured === 1 || project.featured === true,
      created_by: project.created_by || null,
      updated_by: project.updated_by || null,
      created_at: project.created_at || null,
      updated_at: project.updated_at || null
    }));
  }, []);

  // Fetch all projects with fallback to mock data
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const apiResponse = await dostFundedProjectApi.getAllProjects();
      
      if (apiResponse.success && apiResponse.data && apiResponse.data.data && apiResponse.data.data.length > 0) {
        const processedData = processApiData(apiResponse.data);
        setProjects(processedData);
        setIsUsingMockData(false);
        setError(null);
        console.log('✅ Using database data -', processedData.length, 'projects loaded');
      } else {
        console.log('⚠️ Using mock data - no data from API');
        setProjects(localProjects);
        setIsUsingMockData(true);
        setError(null);
      }
    } catch (err) {
      console.warn('❌ API error, using mock data:', err.message);
      setProjects(localProjects);
      setIsUsingMockData(true);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [processApiData]);

  // Fetch single project by ID with fallback
  const fetchProjectById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const apiResponse = await dostFundedProjectApi.getProjectById(id);
      
      if (apiResponse.success && apiResponse.data && apiResponse.data.data && apiResponse.data.data.length > 0) {
        const processedData = processApiData(apiResponse.data);
        setLoading(false);
        setIsUsingMockData(false);
        return processedData[0] || null;
      } else {
        const localProject = localProjects.find(p => p.id === parseInt(id));
        setLoading(false);
        setIsUsingMockData(true);
        return localProject || null;
      }
    } catch (err) {
      const localProject = localProjects.find(p => p.id === parseInt(id));
      setLoading(false);
      setIsUsingMockData(true);
      return localProject || null;
    }
  }, [processApiData]);

  // Get projects by status with fallback
  const getProjectsByStatus = useCallback(async (status) => {
    setLoading(true);
    setError(null);

    try {
      const apiResponse = await dostFundedProjectApi.getProjectsByStatus(status);
      
      if (apiResponse.success && apiResponse.data && apiResponse.data.data && apiResponse.data.data.length > 0) {
        const processedData = processApiData(apiResponse.data);
        setProjects(processedData);
        setIsUsingMockData(false);
      } else {
        const filtered = localProjects.filter(p => 
          p.status && p.status.toLowerCase() === status.toLowerCase()
        );
        setProjects(filtered);
        setIsUsingMockData(true);
      }
    } catch (err) {
      const filtered = localProjects.filter(p => 
        p.status && p.status.toLowerCase() === status.toLowerCase()
      );
      setProjects(filtered);
      setIsUsingMockData(true);
    } finally {
      setLoading(false);
    }
  }, [processApiData]);

  // Get featured projects with fallback
  const getFeaturedProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const apiResponse = await dostFundedProjectApi.getFeaturedProjects();
      
      if (apiResponse.success && apiResponse.data && apiResponse.data.data && apiResponse.data.data.length > 0) {
        const processedData = processApiData(apiResponse.data);
        setProjects(processedData);
        setIsUsingMockData(false);
      } else {
        const featured = localProjects.filter(p => p.featured);
        setProjects(featured);
        setIsUsingMockData(true);
      }
    } catch (err) {
      const featured = localProjects.filter(p => p.featured);
      setProjects(featured);
      setIsUsingMockData(true);
    } finally {
      setLoading(false);
    }
  }, [processApiData]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await fetchProjects();
  }, [fetchProjects]);

  // Load initial data
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    isUsingMockData,
    fetchProjectById,
    getProjectsByStatus,
    getFeaturedProjects,
    refreshData,
    refresh: refreshData // Alias for compatibility
  };
};

export default useDostFundedProjects;