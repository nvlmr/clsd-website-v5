// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\services\news_events_api.js
import NewsEventsData from "../data/NewsEvents.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL;
const NEWS_EVENTS_ENDPOINT = import.meta.env.VITE_NEWS_EVENTS_ENDPOINT;
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

class NewsEventsApiService {
  constructor() {
    this.useMockData = USE_MOCK_DATA;
    this.mockData = NewsEventsData;
    this.apiAvailable = null;
  }

  // Helper function to ensure type is either 'news' or 'event'
  normalizeType(type) {
    if (!type) return 'event';
    
    const typeStr = String(type).toLowerCase();
    
    if (typeStr.includes('news')) return 'news';
    
    return 'event';
  }

  // Check if we're online
  isOnline() {
    return navigator.onLine;
  }

  processItemUrls(item, isOffline = false) {
    const processedItem = { ...item };

    // Normalize the type to match database enum
    processedItem.type = this.normalizeType(item.type);

    // If we're offline or using mock data, return the imported images as-is
    if (isOffline || this.useMockData) {
      // For offline mode, keep the imported images as they are
      return processedItem;
    }

    // Process featured image - only for online mode
    if (processedItem.featured_image) {
      if (!processedItem.featured_image.startsWith('http') && 
          !processedItem.featured_image.startsWith('data:') &&
          !processedItem.featured_image.startsWith('blob:')) {
        processedItem.featured_image = `${UPLOADS_BASE_URL}/news-events/${processedItem.featured_image}`;
      }
    }

    // Process gallery images - only for online mode
    if (processedItem.gallery) {
      if (typeof processedItem.gallery === 'string') {
        try {
          const galleryArray = JSON.parse(processedItem.gallery);
          processedItem.gallery = galleryArray.map(img => {
            if (img.startsWith('http') || img.startsWith('data:') || img.startsWith('blob:')) return img;
            return `${UPLOADS_BASE_URL}/news-events/gallery/${img}`;
          });
        } catch {
          processedItem.gallery = [];
        }
      } else if (Array.isArray(processedItem.gallery)) {
        processedItem.gallery = processedItem.gallery.map(img => {
          if (img.startsWith('http') || img.startsWith('data:') || img.startsWith('blob:')) return img;
          return `${UPLOADS_BASE_URL}/news-events/gallery/${img}`;
        });
      } else {
        processedItem.gallery = [];
      }
    } else {
      processedItem.gallery = [];
    }

    // Process attachments - only for online mode
    if (processedItem.attachments) {
      if (typeof processedItem.attachments === 'string') {
        try {
          const attachmentsArray = JSON.parse(processedItem.attachments);
          processedItem.attachments = attachmentsArray.map(att => {
            if (typeof att === 'string') {
              return {
                url: att.startsWith('http') || att.startsWith('blob:') ? att : `${UPLOADS_BASE_URL}/news-events/attachments/${att}`,
                name: att.split('/').pop() || 'Attachment',
                size: null
              };
            } else if (att && typeof att === 'object') {
              return {
                ...att,
                url: att.url && !att.url.startsWith('http') && !att.url.startsWith('data:') && !att.url.startsWith('blob:')
                  ? `${UPLOADS_BASE_URL}/news-events/attachments/${att.url}`
                  : att.url,
                name: att.name || (att.url ? att.url.split('/').pop() : 'Attachment'),
                size: att.size || null
              };
            }
            return att;
          });
        } catch {
          processedItem.attachments = [];
        }
      } else if (Array.isArray(processedItem.attachments)) {
        processedItem.attachments = processedItem.attachments.map(att => {
          if (typeof att === 'string') {
            return {
              url: att.startsWith('http') || att.startsWith('blob:') ? att : `${UPLOADS_BASE_URL}/news-events/attachments/${att}`,
              name: att.split('/').pop() || 'Attachment',
              size: null
            };
          } else if (att && typeof att === 'object') {
            return {
              ...att,
              url: att.url && !att.url.startsWith('http') && !att.url.startsWith('data:') && !att.url.startsWith('blob:')
                ? `${UPLOADS_BASE_URL}/news-events/attachments/${att.url}`
                : att.url,
              name: att.name || (att.url ? att.url.split('/').pop() : 'Attachment'),
              size: att.size || null
            };
          }
          return att;
        });
      } else {
        processedItem.attachments = [];
      }
    } else {
      processedItem.attachments = [];
    }

    processedItem.featured = Boolean(processedItem.featured);
    processedItem.published = Boolean(processedItem.published);

    return processedItem;
  }

  async fetchNewsEvents() {
    // Check online status
    const isOffline = !this.isOnline();
    
    // If we're offline, immediately return mock data without processing URLs
    if (isOffline) {
      console.log('Offline detected, using mock data with local images');
      this.useMockData = true;
      return this.mockData.map(item => this.processItemUrls(item, true));
    }

    if (this.useMockData) {
      return this.mockData.map(item => this.processItemUrls(item, true));
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}${NEWS_EVENTS_ENDPOINT}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();

      if (result?.success && Array.isArray(result.data)) {
        this.apiAvailable = true;
        return result.data.map(item => this.processItemUrls(item, false));
      }
      
      throw new Error(result?.message || "Invalid response format");
    } catch (error) {
      console.error("API Error, falling back to mock data:", error.message);
      this.useMockData = true;
      this.apiAvailable = false;
      return this.mockData.map(item => this.processItemUrls(item, true));
    }
  }

  async getNewsEventById(id) {
    const data = await this.fetchNewsEvents();
    return data.find((item) => item.id === parseInt(id)) || null;
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

      const res = await fetch(`${API_BASE_URL}${NEWS_EVENTS_ENDPOINT}`, { 
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

const newsEventsApi = new NewsEventsApiService();
export default newsEventsApi;