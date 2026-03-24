// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\config\searchConfigs.js

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

  // DOST Funded Projects page
  dostFundedProjects: {
    searchKeys: [
      'title',
      'description',
      'funding_agency',
      'project_lead',
      'implementing_agency',
      'cooperating_agency',
      'project_duration',
      'status',
      'keywords',
      'objectives',
      'expected_outputs'
    ],
    placeholder: 'Search DOST funded projects...',
    variant: 'elevated',
    size: 'lg',
    theme: 'light',
    showResultCount: true,
    debounceTime: 400,
    showNoResultsMessage: true,
    noResultsMessage: 'No DOST funded projects found for "{query}"',
    minChars: 2,
    // Additional DOST-specific configurations
    filterOptions: [
      { value: 'all', label: 'All Projects' },
      { value: 'ongoing', label: 'Ongoing' },
      { value: 'completed', label: 'Completed' },
      { value: 'upcoming', label: 'Upcoming' }
    ],
    sortOptions: [
      { value: 'title_asc', label: 'Title (A-Z)' },
      { value: 'title_desc', label: 'Title (Z-A)' },
      { value: 'date_newest', label: 'Newest First' },
      { value: 'date_oldest', label: 'Oldest First' }
    ],
    resultCountMessage: 'Found {count} project{plural} for "{query}"'
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