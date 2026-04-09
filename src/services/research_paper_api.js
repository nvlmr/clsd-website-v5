// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\services\research_paper_api.js

import researchPapersData from "../data/ResearchPaper.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const RESEARCH_PAPERS_ENDPOINT = import.meta.env.VITE_RESEARCH_PAPERS_ENDPOINT || '/get_research_papers.php';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL;

class ResearchPaperApiService {
  constructor() {
    this.useMockData = USE_MOCK_DATA;
    this.mockData = researchPapersData;
    this.apiAvailable = null;
  }

  // Check if we're online
  isOnline() {
    return navigator.onLine;
  }

  // Process document URLs
  processDocumentUrl(document, isOffline = false) {
    if (!document) return null;
    
    // If it's already a full URL or data URL, return as is
    if (typeof document === 'object' && document.url) {
      return this.processDocumentUrl(document.url, isOffline);
    }
    
    // If offline or using mock, return as is (this is the local import)
    if (isOffline || this.useMockData) {
      return document;
    }
    
    // If it's already a full URL, return as is
    if (document.startsWith('http://') || 
        document.startsWith('https://') || 
        document.startsWith('data:') || 
        document.startsWith('blob:')) {
      return document;
    }
    
    // If it starts with /, treat as absolute path from domain root
    if (document.startsWith('/')) {
      return document;
    }
    
    // Otherwise, construct the full URL with proper path joining
    const baseUrl = UPLOADS_BASE_URL.replace(/\/$/, ''); // Remove trailing slash
    const docPath = document.replace(/^\/+/, ''); // Remove leading slashes
    return `${baseUrl}/papers/${docPath}`;
  }

  // Process single paper
  processPaper(paper, isOffline = false) {
    const processedPaper = { ...paper };
    
    // Process document - handle both string and array/object formats
    if (paper.document) {
      if (Array.isArray(paper.document) && paper.document.length > 0) {
        // Handle array format from local data
        const firstDoc = paper.document[0];
        processedPaper.document_url = this.processDocumentUrl(firstDoc.url || firstDoc.download_url, isOffline);
        processedPaper.document_name = firstDoc.name || firstDoc.file_name;
        processedPaper.document_size = firstDoc.size;
      } else if (typeof paper.document === 'object') {
        // Handle object format
        processedPaper.document_url = this.processDocumentUrl(paper.document.url || paper.document.download_url, isOffline);
        processedPaper.document_name = paper.document.name || paper.document.file_name;
        processedPaper.document_size = paper.document.size;
      } else if (typeof paper.document === 'string') {
        // Handle string format
        processedPaper.document_url = this.processDocumentUrl(paper.document, isOffline);
      }
    }
    
    // Ensure tags is a string (could be stored as JSON)
    if (processedPaper.tags && typeof processedPaper.tags === 'object') {
      processedPaper.tags = JSON.stringify(processedPaper.tags);
    }
    
    // Convert published to boolean
    processedPaper.published = Boolean(paper.published);
    
    return processedPaper;
  }

  // Process array of papers
  processPapers(papers, isOffline = false) {
    return papers.map(paper => this.processPaper(paper, isOffline));
  }

  async fetchResearchPapers() {
    // Check online status
    const isOffline = !this.isOnline();
    
    // If offline, immediately return mock data
    if (isOffline) {
      console.log('Offline detected, using mock data for research papers');
      this.useMockData = true;
      return this.processPapers(this.mockData, true);
    }

    // If mock data is forced, use it
    if (this.useMockData) {
      console.log('Using mock data for research papers');
      return this.processPapers(this.mockData, true);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}${RESEARCH_PAPERS_ENDPOINT}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();

      if (result?.success && Array.isArray(result.data)) {
        this.apiAvailable = true;
        return this.processPapers(result.data, false);
      }
      
      throw new Error(result?.message || "Invalid response format");
      
    } catch (error) {
      console.error("API Error, falling back to mock data:", error.message);
      this.useMockData = true;
      this.apiAvailable = false;
      return this.processPapers(this.mockData, true);
    }
  }

  async getResearchPaperById(id) {
    const data = await this.fetchResearchPapers();
    return data.find((item) => item.id === parseInt(id)) || null;
  }

  // IMPROVED: Download paper with offline/local file support
  async downloadPaper(paper) {
    // First, get the actual document URL
    let documentUrl = null;
    let fileName = null;
    
    // Extract document URL and filename from paper object
    if (paper.document_url) {
      documentUrl = paper.document_url;
    } else if (paper.document) {
      if (Array.isArray(paper.document) && paper.document[0]) {
        documentUrl = paper.document[0].url || paper.document[0].download_url;
        fileName = paper.document[0].name || paper.document[0].file_name;
      } else if (typeof paper.document === 'object') {
        documentUrl = paper.document.url || paper.document.download_url;
        fileName = paper.document.name || paper.document.file_name;
      } else if (typeof paper.document === 'string') {
        documentUrl = paper.document;
      }
    }
    
    if (!documentUrl) {
      throw new Error("No document available for download");
    }

    // Clean filename from paper title if not available
    if (!fileName) {
      const cleanTitle = paper.title
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '_')
        .substring(0, 100);
      fileName = `${cleanTitle}.pdf`;
    }

    // Check if we're offline or using mock data
    const isOffline = !this.isOnline() || this.useMockData;
    
    // FOR OFFLINE/LOCAL DEVELOPMENT: Direct download without server
    if (isOffline) {
      console.log('Offline/mock mode: Using direct file download');
      try {
        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = documentUrl;
        link.download = fileName;
        link.target = '_blank';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
        
        return { success: true, message: "Download started", method: "direct" };
      } catch (error) {
        console.error("Direct download failed:", error);
        throw new Error("Unable to download file. The file may not be accessible.");
      }
    }
    
    // FOR ONLINE MODE: Try multiple methods
    try {
      // Method 1: Try backend download endpoint
      const backendDownloadUrl = `${API_BASE_URL}${RESEARCH_PAPERS_ENDPOINT}?download=1&file=${encodeURIComponent(documentUrl)}`;
      
      const link = document.createElement('a');
      link.href = backendDownloadUrl;
      link.download = fileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
      
      return { success: true, message: "Download started", method: "backend" };
      
    } catch (error) {
      console.error("Backend download failed, trying fetch method:", error);
      
      // Method 2: Try fetch with blob (for cross-origin issues)
      try {
        const response = await fetch(documentUrl, {
          mode: 'cors',
          credentials: 'omit',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        }, 100);
        
        return { success: true, message: "Download started", method: "fetch" };
        
      } catch (fallbackError) {
        console.error("All download methods failed:", fallbackError);
        
        // Method 3: Last resort - try direct navigation
        try {
          window.open(documentUrl, '_blank');
          return { success: true, message: "Document opened in new tab", method: "new-tab" };
        } catch (finalError) {
          throw new Error("Unable to download file. Please try right-click and 'Save link as...'");
        }
      }
    }
  }

  setUseMockData(useMock) {
    this.useMockData = useMock;
  }

  async checkApiHealth() {
    // First check if we're online
    if (!this.isOnline()) {
      this.apiAvailable = false;
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(`${API_BASE_URL}${RESEARCH_PAPERS_ENDPOINT}`, { 
        method: "HEAD",
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      this.apiAvailable = res.ok;
      return res.ok;
    } catch {
      this.apiAvailable = false;
      return false;
    }
  }

  // Method to manually set offline mode
  setOfflineMode(offline) {
    this.useMockData = offline;
  }
}

const researchPaperApi = new ResearchPaperApiService();
export default researchPaperApi;