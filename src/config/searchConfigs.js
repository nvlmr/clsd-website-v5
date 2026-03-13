export const searchConfigs = {
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

  // CLSD Equipment page
  clsdEquipment: {
    searchKeys: [
      'name',
      'description',
      'model',
      'applications',
      'status'
    ],
    placeholder: 'Search equipment...',
    variant: 'elevated',
    size: 'md',
    theme: 'light',
    showResultCount: true,
    debounceTime: 300,
    showNoResultsMessage: true,
    noResultsMessage: 'No equipment found for "{query}"',
    minChars: 2,
    // Additional equipment-specific configurations
    filterOptions: [
      { value: 'all', label: 'All Equipment' },
      { value: 'available', label: 'Available' },
      { value: 'maintenance', label: 'Under Maintenance' }
    ],
    resultCountMessage: 'Found {count} result{plural} for "{query}"'
  }
};