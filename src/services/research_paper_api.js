// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\services\research_paper_api.js

import mockResearchPapers from "../data/ResearchPaper.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;

/**
 * Helper function to construct full document URL
 */
export const getDocumentUrl = (documentPath) => {
  if (!documentPath) return null;
  
  // If it's already a full URL
  if (documentPath.startsWith('http://') || documentPath.startsWith('https://')) {
    return documentPath;
  }
  
  // If it's a relative path starting with /
  if (documentPath.startsWith('/')) {
    return `${API_BASE_URL}${documentPath}`;
  }
  
  // If it's just a filename, construct the full path
  return `${API_BASE_URL}/uploads/papers/${documentPath}`;
};

/**
 * Download a research paper document
 */
export const downloadResearchPaper = async (paper) => {
  if (!paper.document && !paper.document_url) {
    throw new Error('No document available for download');
  }
  
  const documentUrl = paper.document_url || getDocumentUrl(paper.document);
  
  if (!documentUrl) {
    throw new Error('Invalid document URL');
  }
  
  try {
    console.log('Downloading from:', documentUrl);
    
    // Fetch the file as a blob
    const response = await fetch(documentUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Get the blob
    const blob = await response.blob();
    
    // Create a blob URL
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = blobUrl;
    
    // Extract filename from the URL or create one from the title
    let filename = '';
    if (documentUrl.includes('/')) {
      filename = documentUrl.split('/').pop();
    } else {
      // Create a filename from the paper title
      filename = `${paper.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    }
    
    link.download = filename;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the blob URL
    window.URL.revokeObjectURL(blobUrl);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error(`Failed to download document: ${error.message}`);
  }
};

/**
 * Fetch all research papers
 */
export const fetchResearchPapers = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${API_BASE_URL}/get_research_paper.php`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success" && result.data) {
      const transformedData = result.data.map(paper => ({
        ...paper,
        document_url: paper.document_url || getDocumentUrl(paper.document)
      }));
      
      return {
        success: true,
        data: transformedData,
        source: "server"
      };
    } else {
      throw new Error(result.message || "Invalid response from server");
    }
  } catch (error) {
    console.warn("Server unavailable, falling back to mock data:", error.message);
    
    // Add document_url to mock data
    const mockDataWithUrls = mockResearchPapers.map(paper => ({
      ...paper,
      document_url: getDocumentUrl(paper.document)
    }));
    
    return {
      success: true,
      data: mockDataWithUrls,
      source: "mock",
      error: error.message
    };
  }
};

/**
 * Fetch a single research paper by ID
 */
export const fetchResearchPaperById = async (id) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${API_BASE_URL}/get_research_paper.php?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success" && result.data) {
      const paper = Array.isArray(result.data) ? result.data[0] : result.data;
      
      const transformedPaper = {
        ...paper,
        document_url: paper.document_url || getDocumentUrl(paper.document)
      };
      
      return {
        success: true,
        data: transformedPaper,
        source: "server"
      };
    } else {
      throw new Error(result.message || "Paper not found");
    }
  } catch (error) {
    console.warn("Server unavailable, falling back to mock data:", error.message);
    
    const mockPaper = mockResearchPapers.find(p => p.id === parseInt(id));
    if (mockPaper) {
      const mockPaperWithUrl = {
        ...mockPaper,
        document_url: getDocumentUrl(mockPaper.document)
      };
      return {
        success: true,
        data: mockPaperWithUrl,
        source: "mock",
        error: error.message
      };
    }
    
    return {
      success: false,
      data: null,
      source: "mock",
      error: "Paper not found"
    };
  }
};

/**
 * Create a new research paper
 */
export const createResearchPaper = async (paperData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create_research_paper.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(paperData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating research paper:", error);
    return {
      status: "error",
      message: error.message
    };
  }
};

/**
 * Update an existing research paper
 */
export const updateResearchPaper = async (id, paperData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update_research_paper.php?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(paperData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating research paper:", error);
    return {
      status: "error",
      message: error.message
    };
  }
};

/**
 * Delete a research paper
 */
export const deleteResearchPaper = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete_research_paper.php?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting research paper:", error);
    return {
      status: "error",
      message: error.message
    };
  }
};

/**
 * Check server health/availability
 */
export const checkServerHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_BASE_URL}/health_check.php`, {
      method: "GET",
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    return {
      available: response.ok,
      status: response.status
    };
  } catch (error) {
    console.warn("Server health check failed:", error.message);
    return {
      available: false,
      error: error.message
    };
  }
};