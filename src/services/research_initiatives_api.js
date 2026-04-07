// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\services\research_initiatives_api.js

import axios from 'axios';

// Get environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT);
const RESEARCH_INITIATIVES_ENDPOINT = import.meta.env.VITE_RESEARCH_INITIATIVES_ENDPOINT;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for error handling
apiClient.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout: The server is taking too long to respond');
    } else if (error.response) {
      console.error('Server responded with error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received from server. Server might be down.');
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// Function to check if server is available
export const checkServerAvailability = async () => {
  try {
    const response = await apiClient.get(RESEARCH_INITIATIVES_ENDPOINT, {
      params: { limit: 1 }
    });
    return response.status === 200;
  } catch (error) {
    console.warn('Server is not available:', error.message);
    return false;
  }
};

// Helper function to process document URLs for download
const processDocumentUrl = (doc, API_BASE_URL) => {
  if (typeof doc === 'string') {
    // If it's just a string, assume it's the original filename
    const originalFile = doc.split('/').pop();
    const displayName = originalFile; // Fallback to original if no name provided
    return {
      url: `${API_BASE_URL}/get_research_initiatives.php?download=true&file=${encodeURIComponent(originalFile)}`,
      name: displayName,
      originalFile: originalFile
    };
  } else if (typeof doc === 'object') {
    // Get the original filename (for server download)
    let originalFile = '';
    if (doc.originalFile) {
      // If originalFile exists, use it directly
      originalFile = doc.originalFile;
    } else if (doc.url) {
      // Extract from url as fallback
      originalFile = doc.url.split('/').pop();
    }
    
    // Use the 'name' field for display, fallback to originalFile
    const displayName = doc.name || originalFile || 'Document';
    
    return {
      ...doc,
      // Download URL uses originalFile (server filename)
      url: `${API_BASE_URL}/get_research_initiatives.php?download=true&file=${encodeURIComponent(originalFile)}`,
      name: displayName,  // Display name (user-friendly)
      originalFile: originalFile  // Server filename for download
    };
  }
  return doc;
};

// Get all research initiatives with optional filters
export const getResearchInitiatives = async (filters = {}) => {
  try {
    const response = await apiClient.get(RESEARCH_INITIATIVES_ENDPOINT, {
      params: filters
    });
    
    if (response.data && response.data.success && response.data.data) {
      // Process documents to use download endpoint
      const processedData = response.data.data.map(item => {
        if (item.documents && Array.isArray(item.documents)) {
          item.documents = item.documents.map(doc => processDocumentUrl(doc, API_BASE_URL));
        }
        return item;
      });
      
      return {
        success: true,
        data: processedData,
        source: 'database',
        message: response.data.message || 'Success',
        timestamp: response.data.timestamp
      };
    } else if (response.data && response.data.data) {
      // Process documents even if success flag is missing but data exists
      const processedData = response.data.data.map(item => {
        if (item.documents && Array.isArray(item.documents)) {
          item.documents = item.documents.map(doc => processDocumentUrl(doc, API_BASE_URL));
        }
        return item;
      });
      
      return {
        success: true,
        data: processedData,
        source: 'database',
        count: response.data.count || response.data.data.length
      };
    } else {
      throw new Error('Unexpected response structure');
    }
  } catch (error) {
    console.error('Error fetching research initiatives:', error);
    return {
      success: false,
      error: error.message,
      source: 'error'
    };
  }
};

// Get research initiative by ID
export const getResearchInitiativeById = async (id) => {
  try {
    const response = await apiClient.get(RESEARCH_INITIATIVES_ENDPOINT, {
      params: { id: id }
    });
    
    if (response.data && response.data.success && response.data.data) {
      let item = Array.isArray(response.data.data) 
        ? response.data.data.find(item => item.id === parseInt(id))
        : response.data.data;
      
      // Process documents if they exist
      if (item && item.documents && Array.isArray(item.documents)) {
        item.documents = item.documents.map(doc => processDocumentUrl(doc, API_BASE_URL));
      }
      
      return {
        success: true,
        data: item,
        source: 'database'
      };
    } else {
      throw new Error('Research initiative not found');
    }
  } catch (error) {
    console.error(`Error fetching research initiative with ID ${id}:`, error);
    return {
      success: false,
      error: error.message,
      source: 'error'
    };
  }
};

// Get featured research initiatives
export const getFeaturedResearchInitiatives = async (limit = null) => {
  return getResearchInitiatives({ 
    featured: 1,
    limit: limit 
  });
};

// Get research initiatives by status
export const getResearchInitiativesByStatus = async (status, limit = null) => {
  return getResearchInitiatives({ 
    status: status,
    limit: limit 
  });
};

// Search research initiatives
export const searchResearchInitiatives = async (searchTerm, limit = null) => {
  return getResearchInitiatives({ 
    search: searchTerm,
    limit: limit 
  });
};

export default {
  checkServerAvailability,
  getResearchInitiatives,
  getResearchInitiativeById,
  getFeaturedResearchInitiatives,
  getResearchInitiativesByStatus,
  searchResearchInitiatives
};