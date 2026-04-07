// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\services\dost_funded_project_api.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/clsd-backend/public';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 8000;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return Promise.resolve({
        data: {
          status: 'error',
          message: 'Request timeout',
          data: [],
          count: 0
        }
      });
    }
    if (error.message === 'Network Error') {
      return Promise.resolve({
        data: {
          status: 'error',
          message: 'Network error - server unreachable',
          data: [],
          count: 0
        }
      });
    }
    return Promise.reject(error);
  }
);

export const dostFundedProjectApi = {
  // Get all published projects
  getAllProjects: async () => {
    try {
      const response = await api.get('/get_dost_funded_project.php');
      return {
        success: response.data && response.data.status === 'success',
        data: response.data
      };
    } catch (error) {
      console.warn('API getAllProjects error:', error.message);
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  },

  // Get single project by ID
  getProjectById: async (id) => {
    try {
      const response = await api.get(`/get_dost_funded_project.php?id=${id}`);
      return {
        success: response.data && response.data.status === 'success',
        data: response.data
      };
    } catch (error) {
      console.warn('API getProjectById error:', error.message);
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  },

  // Get projects by status
  getProjectsByStatus: async (status) => {
    try {
      const response = await api.get(`/get_dost_funded_project.php?status=${encodeURIComponent(status)}`);
      return {
        success: response.data && response.data.status === 'success',
        data: response.data
      };
    } catch (error) {
      console.warn('API getProjectsByStatus error:', error.message);
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  },

  // Get featured projects
  getFeaturedProjects: async () => {
    try {
      const response = await api.get('/get_dost_funded_project.php?featured=1');
      return {
        success: response.data && response.data.status === 'success',
        data: response.data
      };
    } catch (error) {
      console.warn('API getFeaturedProjects error:', error.message);
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  },

  // Check API health
  checkApiHealth: async () => {
    try {
      const response = await api.get('/get_dost_funded_project.php', {
        timeout: 3000
      });
      return response.status === 200 && response.data && response.data.status === 'success';
    } catch (error) {
      return false;
    }
  }
};

export default dostFundedProjectApi;