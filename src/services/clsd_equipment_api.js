// src/services/clsd_equipment_api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');
const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL;

const IMAGE_BASE_URL = `${UPLOADS_BASE_URL}/clsd-equipments`;

// Equipment endpoint
const EQUIPMENT_ENDPOINT = import.meta.env.VITE_CLSD_EQUIPMENT_ENDPOINT;

// Feature flags
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Validate required environment variables (with warnings only)
if (!API_BASE_URL) {
  console.warn('VITE_API_BASE_URL is not defined in .env file - using mock data only');
}

if (!UPLOADS_BASE_URL) {
  console.warn('VITE_UPLOADS_BASE_URL is not defined in .env file - using mock data only');
}

if (!EQUIPMENT_ENDPOINT) {
  console.warn('VITE_CLSD_EQUIPMENT_ENDPOINT is not defined in .env file - using mock data only');
}

/**
 * Fetch equipment data from the server
 * @returns {Promise<Array>} Array of equipment objects
 */
export const fetchEquipmentFromServer = async () => {
  // If required environment variables are missing, throw error
  if (!API_BASE_URL || !EQUIPMENT_ENDPOINT) {
    throw new Error('Server configuration missing');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    // Construct full URL properly handling slashes
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const endpoint = EQUIPMENT_ENDPOINT.startsWith('/') ? EQUIPMENT_ENDPOINT : `/${EQUIPMENT_ENDPOINT}`;
    const fullUrl = `${baseUrl}${endpoint}`;

    console.log('Fetching equipment from:', fullUrl); // For debugging

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Don't throw error for 500 - just return empty array to trigger mock data silently
      console.warn(`Server returned status ${response.status}, using mock data silently`);
      return [];
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
      console.warn('Request timeout - server took too long to respond');
      return []; // Return empty to trigger mock silently
    }
    console.warn('Server fetch error:', error.message);
    return []; // Return empty to trigger mock silently
  }
};

/**
 * Construct full image URL for equipment
 * @param {string} imagePath - Image filename or path from database
 * @returns {string} Full image URL or null
 */
export const getEquipmentImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If we don't have the uploads base URL, return null (will use fallback image)
  if (!UPLOADS_BASE_URL) {
    return null;
  }
  
  // Clean the base URL (remove trailing slash if present)
  const baseUrl = UPLOADS_BASE_URL.endsWith('/') ? UPLOADS_BASE_URL.slice(0, -1) : UPLOADS_BASE_URL;
  
  // Clean the image path (remove leading slashes and 'uploads/' if present)
  const cleanPath = imagePath.replace(/^[\/\\]*(uploads[\/\\]*)?/, '');
  
  // Construct the full URL
  return `${baseUrl}/clsd-equipments/${cleanPath}`;
};

/**
 * Check if the server is available - now more lenient
 * @returns {Promise<boolean>} True if server is reachable
 */
export const checkServerAvailability = async () => {
  // If required environment variables are missing, server is not available
  if (!API_BASE_URL || !EQUIPMENT_ENDPOINT) {
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const endpoint = EQUIPMENT_ENDPOINT.startsWith('/') ? EQUIPMENT_ENDPOINT : `/${EQUIPMENT_ENDPOINT}`;
    const fullUrl = `${baseUrl}${endpoint}`;

    const response = await fetch(fullUrl, {
      method: 'HEAD',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    
    // Consider server available even if it returns 500 (PHP error)
    // The server itself is reachable, just the script has issues
    return response.status !== 404; // Only return false if 404 (not found)
  } catch {
    return false; // Network error or timeout - server completely unreachable
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

  // Try to fetch from server first
  try {
    const serverData = await fetchEquipmentFromServer();
    
    // If we got data from server, use it
    if (serverData && serverData.length > 0) {
      // Process server data to match the expected format and construct image URLs
      const processedData = serverData.map(item => ({
        id: item.id,
        name: item.name || 'Unknown Equipment',
        description: item.description || 'No description available',
        model: item.model || 'N/A',
        year_acquired: item.year_acquired,
        status: item.status || 'available',
        applications: parseApplications(item.applications),
        image: getEquipmentImageUrl(item.image), // Convert to full URL
        image_filename: item.image, // Keep original filename if needed
        published: item.published !== undefined ? item.published : 1
      })).filter(item => item.published === 1); // Only show published items

      return {
        data: processedData,
        source: 'server'
      };
    }
    
    // If server returned empty array (due to error or no data), use mock data silently
    console.log('Server returned no data, using mock data');
    return getMockData();
    
  } catch (error) {
    // This catch should rarely happen now since we're not throwing
    console.warn('Unexpected error in server fetch, using mock data:', error.message);
    return getMockData();
  }
};

/**
 * Helper function to get and process mock data
 * @returns {Promise<Object>} Processed mock data
 */
const getMockData = async () => {
  try {
    // Dynamic import for mock data
    const mockData = (await import('../data/ClsdEquipment.js')).default;
    
    // Process mock data (mock data already has imported images)
    const processedMockData = mockData
      .filter(item => item.published !== 0) // Only show published items
      .map(item => ({
        ...item,
        year_acquired: item.year_acquired || null,
        status: item.status || 'available',
        model: item.model || 'N/A',
        applications: Array.isArray(item.applications) ? item.applications : []
      }));

    return {
      data: processedMockData,
      source: 'mock'
      // No error message included
    };
  } catch (mockError) {
    console.error('Failed to load mock data:', mockError);
    return {
      data: [],
      source: 'mock'
    };
  }
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