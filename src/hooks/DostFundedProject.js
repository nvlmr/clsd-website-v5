// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\hooks\DostFundedProject.js

import { useState, useEffect, useCallback } from 'react';
import { dostFundedProjectApi } from '../services/dost_funded_project_api.js';
import localProjects from '../data/DostFundedProject';

export const useDostFundedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      // Use image_url if available, otherwise fallback to local image path
      image: project.image_url || project.image || '',
      published: project.published === 1 || project.published === true,
      featured: project.featured === 1 || project.featured === true
    }));
  }, []);

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to get data from API first
      const apiResponse = await dostFundedProjectApi.getAllProjects();
      
      if (apiResponse.success && apiResponse.data && apiResponse.data.data) {
        const processedData = processApiData(apiResponse.data);
        setProjects(processedData.length > 0 ? processedData : localProjects);
      } else {
        // Fallback to local data silently
        setProjects(localProjects);
      }
    } catch (err) {
      // Silently fallback to local data on error
      setProjects(localProjects);
    } finally {
      setLoading(false);
    }
  }, [processApiData]);

  // Fetch single project by ID
  const fetchProjectById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const apiResponse = await dostFundedProjectApi.getProjectById(id);
      
      if (apiResponse.success && apiResponse.data && apiResponse.data.data) {
        const processedData = processApiData(apiResponse.data);
        setLoading(false);
        return processedData[0] || null;
      } else {
        // Find in local data
        const localProject = localProjects.find(p => p.id === parseInt(id));
        setLoading(false);
        return localProject || null;
      }
    } catch (err) {
      // Fallback to local data
      const localProject = localProjects.find(p => p.id === parseInt(id));
      setLoading(false);
      return localProject || null;
    }
  }, [processApiData]);

  // Get projects by status
  const getProjectsByStatus = useCallback(async (status) => {
    setLoading(true);
    setError(null);

    try {
      const apiResponse = await dostFundedProjectApi.getProjectsByStatus(status);
      
      if (apiResponse.success && apiResponse.data && apiResponse.data.data) {
        const processedData = processApiData(apiResponse.data);
        setProjects(processedData.length > 0 ? processedData : 
          localProjects.filter(p => p.status.toLowerCase() === status.toLowerCase()));
      } else {
        // Filter local data
        const filtered = localProjects.filter(p => 
          p.status.toLowerCase() === status.toLowerCase()
        );
        setProjects(filtered);
      }
    } catch (err) {
      // Filter local data on error
      const filtered = localProjects.filter(p => 
        p.status.toLowerCase() === status.toLowerCase()
      );
      setProjects(filtered);
    } finally {
      setLoading(false);
    }
  }, [processApiData]);

  // Get featured projects
  const getFeaturedProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const apiResponse = await dostFundedProjectApi.getFeaturedProjects();
      
      if (apiResponse.success && apiResponse.data && apiResponse.data.data) {
        const processedData = processApiData(apiResponse.data);
        setProjects(processedData.length > 0 ? processedData : 
          localProjects.filter(p => p.featured));
      } else {
        // Filter local data
        const featured = localProjects.filter(p => p.featured);
        setProjects(featured);
      }
    } catch (err) {
      // Filter local data on error
      const featured = localProjects.filter(p => p.featured);
      setProjects(featured);
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
    fetchProjectById,
    getProjectsByStatus,
    getFeaturedProjects,
    refreshData
  };
};

export default useDostFundedProjects;