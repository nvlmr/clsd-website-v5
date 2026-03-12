// src/services/clsd_equipment_api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT);
const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL;

const IMAGE_BASE_URL = `${UPLOADS_BASE_URL}/clsd-equipments`;

// Equipment endpoint
const EQUIPMENT_ENDPOINT = import.meta.env.VITE_CLSD_EQUIPMENT_ENDPOINT;

// Feature flags
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Validate required environment variables
if (!API_BASE_URL) {
  console.error('VITE_API_BASE_URL is not defined in .env file');
}

if (!UPLOADS_BASE_URL) {
  console.error('VITE_UPLOADS_BASE_URL is not defined in .env file');
}

if (!EQUIPMENT_ENDPOINT) {
  console.error('VITE_CLSD_EQUIPMENT_ENDPOINT is not defined in .env file');
}

/**
 * Fetch equipment data from the server
 * @returns {Promise<Array>} Array of equipment objects
 */
export const fetchEquipmentFromServer = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${API_BASE_URL}${EQUIPMENT_ENDPOINT}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle different response structures
    if (data.success && data.data) {
      return data.data; // If API returns {success: true, data: [...]}
    } else if (Array.isArray(data)) {
      return data; // If API returns array directly
    } else if (data.equipment && Array.isArray(data.equipment)) {
      return data.equipment; // If API returns {equipment: [...]}
    } else {
      console.warn('Unexpected API response structure:', data);
      return [];
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server took too long to respond');
    }
    throw error;
  }
};

/**
 * Construct full image URL for equipment
 * @param {string} imagePath - Image filename or path from database
 * @returns {string} Full image URL
 */
export const getEquipmentImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Remove any leading slashes or 'uploads/' from the path if present
  const cleanPath = imagePath.replace(/^[\/\\]*(uploads[\/\\]*)?/, '');
  
  // Construct the full URL
  return `${IMAGE_BASE_URL}/${cleanPath}`;
};

/**
 * Check if the server is available
 * @returns {Promise<boolean>} True if server is available
 */
export const checkServerAvailability = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await fetch(`${API_BASE_URL}${EQUIPMENT_ENDPOINT}`, {
      method: 'HEAD',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Fetch equipment with fallback to mock data
 * @returns {Promise<Object>} Object containing equipment data and source info
 */
export const fetchEquipmentWithFallback = async () => {
  // If mock data is forced via feature flag, skip server fetch
  if (USE_MOCK_DATA) {
    console.log('Using mock data (forced by feature flag)');
    return getMockData();
  }

  try {
    // Try to fetch from server first
    const serverData = await fetchEquipmentFromServer();
    
    // Process server data to match the expected format and construct image URLs
    const processedData = serverData.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      model: item.model || 'N/A',
      year_acquired: item.year_acquired,
      status: item.status || 'available',
      applications: parseApplications(item.applications),
      image: getEquipmentImageUrl(item.image), // Convert to full URL
      image_filename: item.image, // Keep original filename if needed
      published: item.published || 1
    }));

    return {
      data: processedData,
      source: 'server'
    };
  } catch (error) {
    console.warn('Server fetch failed, using mock data:', error.message);
    
    // Fallback to mock data
    return getMockData(error.message);
  }
};

/**
 * Helper function to get and process mock data
 * @param {string} [errorMessage] - Optional error message from server fetch
 * @returns {Promise<Object>} Processed mock data
 */
const getMockData = async (errorMessage = null) => {
  // Dynamic import for mock data
  const mockData = (await import('../data/ClsdEquipment.js')).default;
  
  // Process mock data (mock data already has imported images)
  const processedMockData = mockData
    .filter(item => item.published !== 0) // Only show published items
    .map(item => ({
      ...item,
      year_acquired: item.year_acquired || null,
      status: item.status || 'available',
      model: item.model || 'N/A'
    }));

  return {
    data: processedMockData,
    source: 'mock',
    ...(errorMessage && { error: errorMessage })
  };
};

/**
 * Parse applications field which could be JSON string, array, or null
 * @param {any} applications 
 * @returns {Array} Array of applications
 */
const parseApplications = (applications) => {
  if (!applications) return [];
  
  // If it's already an array
  if (Array.isArray(applications)) return applications;
  
  // If it's a string, try to parse it
  if (typeof applications === 'string') {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(applications);
      return Array.isArray(parsed) ? parsed : [applications];
    } catch {
      // If not valid JSON, split by commas or newlines
      return applications.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
    }
  }
  
  return [];
};