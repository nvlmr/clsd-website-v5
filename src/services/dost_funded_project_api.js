// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\services\dost_funded_project_api.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;

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
    return Promise.reject(error);
  }
);

export const dostFundedProjectApi = {
  // Get all published projects
  getAllProjects: async () => {
    try {
      const response = await api.get('/get_dost_funded_project.php');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        data: []
      };
    }
  },

  // Get single project by ID
  getProjectById: async (id) => {
    try {
      const response = await api.get(`/get_dost_funded_project.php?id=${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        data: null
      };
    }
  },

  // Get projects by status
  getProjectsByStatus: async (status) => {
    try {
      const response = await api.get(`/get_dost_funded_project.php?status=${status}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        data: []
      };
    }
  },

  // Get featured projects
  getFeaturedProjects: async () => {
    try {
      const response = await api.get('/get_dost_funded_project.php?featured=1');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        data: []
      };
    }
  },

  // Check API health
  checkApiHealth: async () => {
    try {
      const response = await api.get('/get_dost_funded_project.php', {
        timeout: 3000
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
};

export default dostFundedProjectApi;