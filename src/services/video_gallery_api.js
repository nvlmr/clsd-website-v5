const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_ENDPOINT = import.meta.env.VITE_VIDEO_GALLERY_ENDPOINT;
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const videoGalleryApi = {
  // Fetch all published videos
  getVideos: async () => {
    // If mock data is enabled, return mock data
    if (USE_MOCK_DATA) {
      console.log('Using mock data for video gallery');
      const mockData = await import('../data/VideoGallery.js');
      return mockData.default;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINT}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'omit' // Change to 'include' if you need cookies/session
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch videos');
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      // Fallback to mock data if API fails
      if (!USE_MOCK_DATA) {
        console.log('Falling back to mock data');
        try {
          const mockData = await import('../data/VideoGallery.js');
          return mockData.default;
        } catch (mockError) {
          console.error('Mock data fallback failed:', mockError);
          throw error;
        }
      }
      throw error;
    }
  },
  
  // Get a single video by ID
  getVideoById: async (id) => {
    if (USE_MOCK_DATA) {
      try {
        const mockData = await import('../data/VideoGallery.js');
        const video = mockData.default.find(v => v.id === parseInt(id));
        return video || null;
      } catch (error) {
        console.error('Error loading mock data:', error);
        return null;
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINT}?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch video');
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error;
    }
  },
  
  // Download document helper function
  downloadDocument: async (documentUrl, fileName) => {
    try {
      // Use fetch to get the file as blob
      const response = await fetch(documentUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }
};