// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\services\iec_materials_api.js

import mockIECMaterials from '../data/IECMaterials.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_ENDPOINT = import.meta.env.VITE_IEC_MATERIALS_ENDPOINT;
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL;

/**
 * Process material data by constructing full URLs for images and documents
 */
const processMaterialData = (material) => {
    const processed = { ...material };
    
    // Construct full URL for cover_image if it exists
    if (processed.cover_image && processed.cover_image !== 'null') {
        // If it's already a full URL, use it as is
        if (processed.cover_image.startsWith('http://') || processed.cover_image.startsWith('https://')) {
            // Keep as is
        } else {
            // Otherwise, construct the full path
            processed.cover_image = `${UPLOADS_BASE_URL}/iec-materials/${processed.cover_image}`;
        }
    } else {
        processed.cover_image = null;
    }
    
    // Construct full URL for document if it exists
    if (processed.document && processed.document !== 'null') {
        // If it's already a full URL, use it as is
        if (processed.document.startsWith('http://') || processed.document.startsWith('https://')) {
            // Keep as is
        } else {
            // Otherwise, construct the full path
            processed.document = `${UPLOADS_BASE_URL}/iec-materials/${processed.document}`;
        }
    } else {
        processed.document = null;
    }
    
    return processed;
};

/**
 * Fetch IEC materials from API with fallback to mock data
 */
export const fetchIECMaterials = async () => {
    // If mock data is forced via env, use it immediately
    if (USE_MOCK_DATA) {
        console.log('Using mock IEC materials data (forced by env)');
        const processedMockData = mockIECMaterials.map(processMaterialData);
        return { success: true, data: processedMockData, source: 'mock' };
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const fullUrl = `${API_BASE_URL}${API_ENDPOINT}`;
        console.log('Fetching IEC materials from:', fullUrl);
        
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            signal: controller.signal,
            credentials: 'omit'
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'success' && Array.isArray(result.data)) {
            const processedData = result.data.map(processMaterialData);
            console.log(`Successfully fetched ${processedData.length} IEC materials from server`);
            return { success: true, data: processedData, source: 'api' };
        } else {
            throw new Error('Invalid response format or no data');
        }
    } catch (error) {
        console.warn('Failed to fetch IEC materials from API, using mock data:', error.message);
        const processedMockData = mockIECMaterials.map(processMaterialData);
        return { 
            success: true, 
            data: processedMockData, 
            source: 'mock', 
            error: error.message 
        };
    }
};

/**
 * Fetch a single IEC material by ID
 */
export const fetchIECMaterialById = async (id) => {
    const result = await fetchIECMaterials();
    if (result.success) {
        const material = result.data.find(item => item.id === parseInt(id));
        return { success: true, data: material || null, source: result.source };
    }
    return { success: false, data: null, error: result.error };
};

/**
 * Check server health and connectivity
 */
export const checkServerHealth = async () => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const fullUrl = `${API_BASE_URL}${API_ENDPOINT}`;
        console.log('Checking server health:', fullUrl);
        
        const response = await fetch(fullUrl, {
            method: 'HEAD',
            signal: controller.signal,
            credentials: 'omit'
        });
        
        clearTimeout(timeoutId);
        console.log('Server health check result:', response.ok);
        return response.ok;
    } catch (error) {
        console.warn('Server health check failed:', error.message);
        return false;
    }
};

/**
 * Download a file with CORS handling
 */
// In iec_materials_api.js - update downloadFile function

export const downloadFile = async (fileUrl, fileName) => {
    try {
        // Extract filename from URL
        const fileBaseName = fileUrl.split('/').pop();
        
        // Try direct download through your PHP endpoint
        const downloadUrl = `${API_BASE_URL}/get_iec_materials.php?download=1&file=${encodeURIComponent(fileBaseName)}`;
        
        console.log('Downloading from:', downloadUrl);
        
        // Create a hidden anchor element
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // Trigger download
        link.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(link);
        }, 100);
        
        return { success: true };
        
    } catch (error) {
        console.error('Download failed:', error);
        
        // Fallback: open in new tab
        try {
            console.log('Trying fallback method...');
            const newWindow = window.open(fileUrl, '_blank');
            if (!newWindow) {
                // If popup blocked, try direct link
                window.location.href = fileUrl;
            }
            return { success: true };
        } catch (fallbackError) {
            console.error('Fallback download failed:', fallbackError);
            return { 
                success: false, 
                error: error.message || 'Download failed. Please try again.'
            };
        }
    }
};

// Default export for backward compatibility
export default {
    fetchIECMaterials,
    fetchIECMaterialById,
    checkServerHealth,
    downloadFile,
};