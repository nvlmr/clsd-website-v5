// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\hooks\VideoGallery.js

import { useState, useEffect } from 'react';
import { videoGalleryApi } from '../services/video_gallery_api.js';

export const useVideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await videoGalleryApi.getVideos();
      setVideos(data);
    } catch (err) {
      setError(err.message || 'Failed to load videos');
      console.error('Error in useVideoGallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshVideos = () => {
    fetchVideos();
  };

  return {
    videos,
    loading,
    error,
    refreshVideos
  };
};