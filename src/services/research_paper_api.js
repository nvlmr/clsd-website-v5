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
    
    // If offline or using mock, return as is
    if (isOffline || this.useMockData) {
      return document;
    }
    
    // If it's already a full URL, return as is
    if (document.startsWith('http') || document.startsWith('data:') || document.startsWith('blob:')) {
      return document;
    }
    
    // Otherwise, construct the full URL
    return `${UPLOADS_BASE_URL}/papers/${document}`;
  }

  // Process single paper
  processPaper(paper, isOffline = false) {
    const processedPaper = { ...paper };
    
    // Process document URL
    processedPaper.document_url = this.processDocumentUrl(paper.document, isOffline);
    
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
// Replace the downloadPaper method in research_paper_api.js
async downloadPaper(paper) {
  if (!paper.document && !paper.document_url) {
    throw new Error("No document available for download");
  }

  // Get the document URL
  let documentUrl = paper.document_url;
  
  // If document_url doesn't exist, construct it
  if (!documentUrl && paper.document) {
    documentUrl = this.processDocumentUrl(paper.document, false);
  }

  // Clean filename from paper title
  const cleanTitle = paper.title
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '_')
    .substring(0, 100);
  const fileName = `${cleanTitle}.pdf`;

  try {
    // Method 1: Use the backend's download endpoint if available
    // This is the most reliable way to force download
    const backendDownloadUrl = `${API_BASE_URL}${RESEARCH_PAPERS_ENDPOINT}?download=1&file=${encodeURIComponent(paper.document)}`;
    
    // Create a hidden anchor element with download attribute
    const link = document.createElement('a');
    link.href = backendDownloadUrl;
    link.download = fileName;
    link.style.display = 'none';
    
    // Add to body, click, and remove
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
    
    return { success: true, message: "Download started" };
    
  } catch (error) {
    console.error("Download failed:", error);
    
    // Fallback: Try with fetch and blob for cross-origin issues
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
      
      return { success: true, message: "Download started" };
      
    } catch (fallbackError) {
      console.error("Fallback download failed:", fallbackError);
      throw new Error("Unable to download file. Please try right-click and 'Save link as...'");
    }
  }
}
// Improve processDocumentUrl to handle various cases
processDocumentUrl(document, isOffline = false) {
  if (!document) return null;
  
  // If offline or using mock, return as is
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