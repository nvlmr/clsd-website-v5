// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\config\searchConfigs.js

// Search configurations for different pages
export const searchConfigs = {
  // News & Events page
  newsEvents: {
    searchKeys: [
      'title', 
      'content', 
      'excerpt', 
      'event_location', 
      'category',
      'type'
    ],
    placeholder: 'Search news and events...',
    variant: 'default',
    size: 'md',
    theme: 'light',
    showResultCount: true,
    debounceTime: 300,
    showNoResultsMessage: true,
    noResultsMessage: 'No news or events found for "{query}"',
    minChars: 2
  },

  // Research Initiatives page
  researchInitiatives: {
    searchKeys: [
      'title', 
      'description', 
      'funding_source', 
      'implementing_agency',
      'project_lead', 
      'location',
      'objectives',
      'cooperating_agency'
    ],
    placeholder: 'Search research initiatives...',
    variant: 'elevated',
    size: 'lg',
    theme: 'light',
    showResultCount: true,
    debounceTime: 400,
    showNoResultsMessage: true,
    noResultsMessage: 'No research initiatives found for "{query}"',
    minChars: 2
  },

  // Equipment page
  equipment: {
    searchKeys: [
      'name',
      'description',
      'model',
      'year_acquired',
      'applications'
    ],
    placeholder: 'Search equipment...',
    variant: 'default',
    size: 'md',
    theme: 'light',
    showResultCount: true,
    debounceTime: 300,
    showNoResultsMessage: true,
    noResultsMessage: 'No equipment found for "{query}"',
    minChars: 1,
    showSearchIcon: true,
    showClearButton: true
  }
};