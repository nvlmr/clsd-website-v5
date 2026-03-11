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
  }

  // Helper function to ensure type is either 'news' or 'event'
  normalizeType(type) {
    if (!type) return 'event'; // Default to event if not specified
    
    const typeStr = String(type).toLowerCase();
    
    // Check if it's news-related
    if (typeStr.includes('news')) return 'news';
    
    // Default to event for everything else (training, workshop, opportunities, projects, etc.)
    return 'event';
  }

  processItemUrls(item) {
    const processedItem = { ...item };

    // Normalize the type to match database enum
    processedItem.type = this.normalizeType(item.type);

    // Process featured image
    if (processedItem.featured_image) {
      if (!processedItem.featured_image.startsWith('http') && 
          !processedItem.featured_image.startsWith('data:')) {
        processedItem.featured_image = `${UPLOADS_BASE_URL}/news-events/${processedItem.featured_image}`;
      }
    }

    // Process gallery images
    if (processedItem.gallery) {
      if (typeof processedItem.gallery === 'string') {
        try {
          const galleryArray = JSON.parse(processedItem.gallery);
          processedItem.gallery = galleryArray.map(img => {
            if (img.startsWith('http') || img.startsWith('data:')) return img;
            return `${UPLOADS_BASE_URL}/news-events/gallery/${img}`;
          });
        } catch {
          processedItem.gallery = [];
        }
      } else if (Array.isArray(processedItem.gallery)) {
        processedItem.gallery = processedItem.gallery.map(img => {
          if (img.startsWith('http') || img.startsWith('data:')) return img;
          return `${UPLOADS_BASE_URL}/news-events/gallery/${img}`;
        });
      } else {
        processedItem.gallery = [];
      }
    } else {
      processedItem.gallery = [];
    }

    // Process attachments
    if (processedItem.attachments) {
      if (typeof processedItem.attachments === 'string') {
        try {
          const attachmentsArray = JSON.parse(processedItem.attachments);
          processedItem.attachments = attachmentsArray.map(att => {
            if (typeof att === 'string') {
              return {
                url: att.startsWith('http') ? att : `${UPLOADS_BASE_URL}/news-events/attachments/${att}`,
                name: att.split('/').pop() || 'Attachment',
                size: null
              };
            } else if (att && typeof att === 'object') {
              return {
                ...att,
                url: att.url && !att.url.startsWith('http') && !att.url.startsWith('data:')
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
              url: att.startsWith('http') ? att : `${UPLOADS_BASE_URL}/news-events/attachments/${att}`,
              name: att.split('/').pop() || 'Attachment',
              size: null
            };
          } else if (att && typeof att === 'object') {
            return {
              ...att,
              url: att.url && !att.url.startsWith('http') && !att.url.startsWith('data:')
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
    if (this.useMockData) {
      return this.mockData.map(item => this.processItemUrls(item));
    }

    try {
      const response = await fetch(`${API_BASE_URL}${NEWS_EVENTS_ENDPOINT}`);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();

      if (result?.success && Array.isArray(result.data)) {
        return result.data.map(item => this.processItemUrls(item));
      }
      
      throw new Error(result?.message || "Invalid response format");
    } catch (error) {
      console.error("API Error:", error.message);
      this.useMockData = true; 
      return this.mockData.map(item => this.processItemUrls(item));
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
    try {
      const res = await fetch(`${API_BASE_URL}${NEWS_EVENTS_ENDPOINT}`, { method: "HEAD" });
      return res.ok;
    } catch {
      return false;
    }
  }
}

const newsEventsApi = new NewsEventsApiService();
export default newsEventsApi;