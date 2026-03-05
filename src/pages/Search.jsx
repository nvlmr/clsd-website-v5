import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

const Search = ({ 
  data = [], 
  searchKeys = ['title', 'description'], 
  onSearchResults,
  placeholder = 'Search...',
  className = '',
  debounceTime = 300,
  showResultCount = true,
  customFilter,
  initialQuery = '',
  variant = 'default',
  size = 'md',
  theme = 'light',
  autoFocus = false,
  disabled = false,
  showNoResultsMessage = false, // New prop - default to false
  noResultsMessage = 'No results found for "{query}"', // Customizable message
  noResultsComponent // Optional custom component
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const lastExecutedQueryRef = useRef('');

  // Initialize filtered results with data on mount
  useEffect(() => {
    setFilteredResults(data);
    if (onSearchResults) {
      onSearchResults(data);
    }
  }, [data, onSearchResults]);

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'w-64 sm:w-80 md:w-96',
      input: 'px-4 py-2 text-sm',
      icon: 'w-3.5 h-3.5',
      label: 'text-xs',
      resultCount: 'text-xs'
    },
    md: {
      container: 'w-80 sm:w-96 md:w-[450px]',
      input: 'px-5 py-3 text-base',
      icon: 'w-4 h-4',
      label: 'text-sm',
      resultCount: 'text-sm'
    },
    lg: {
      container: 'w-96 sm:w-[500px] md:w-[600px]',
      input: 'px-6 py-4 text-lg',
      icon: 'w-5 h-5',
      label: 'text-base',
      resultCount: 'text-base'
    }
  };

  const themeConfig = {
    light: {
      input: 'bg-white border-gray-300 text-gray-900 placeholder-transparent',
      focus: 'focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
      icon: 'text-gray-400',
      label: 'text-gray-600',
      resultCount: 'text-gray-500',
      clearButton: 'text-gray-400 hover:text-gray-600',
      spinner: 'border-blue-500 border-t-transparent',
      labelActive: 'text-blue-500',
      labelInactive: 'text-gray-500',
      noResults: 'bg-gray-50/80 text-gray-500 border-gray-200'
    },
    dark: {
      input: 'bg-gray-800 border-gray-600 text-white placeholder-transparent',
      focus: 'focus:border-blue-400 focus:ring-2 focus:ring-blue-900',
      icon: 'text-gray-400',
      label: 'text-gray-300',
      resultCount: 'text-gray-400',
      clearButton: 'text-gray-400 hover:text-gray-300',
      spinner: 'border-blue-400 border-t-transparent',
      labelActive: 'text-blue-400',
      labelInactive: 'text-gray-400',
      noResults: 'bg-gray-800/50 text-gray-400 border-gray-700'
    }
  };

  // Variant configurations
  const variantConfig = {
    default: {
      rounded: 'rounded-xl',
      shadow: 'shadow-lg hover:shadow-xl',
      border: 'border-2',
      transition: 'transition-all duration-300'
    },
    minimal: {
      rounded: 'rounded-none border-b-2',
      shadow: '',
      border: 'border-0 border-b-2',
      transition: 'transition-all duration-300'
    },
    compact: {
      rounded: 'rounded-full',
      shadow: 'shadow-md hover:shadow-lg',
      border: 'border-2',
      transition: 'transition-all duration-300'
    }
  };

  // Search function
  const performSearch = useCallback((query) => {
    if (lastExecutedQueryRef.current === query) {
      setIsSearching(false);
      return;
    }

    if (!data || data.length === 0) {
      setFilteredResults([]);
      onSearchResults?.([]);
      setIsSearching(false);
      lastExecutedQueryRef.current = query;
      return;
    }

    if (!query.trim()) {
      setFilteredResults(data);
      onSearchResults?.(data);
      setIsSearching(false);
      lastExecutedQueryRef.current = query;
      return;
    }

    const results = data.filter(item => {
      if (customFilter) {
        return customFilter(item, query);
      }

      return searchKeys.some(key => {
        const value = getNestedValue(item, key);
        if (value) {
          return value.toString().toLowerCase().includes(query.toLowerCase());
        }
        return false;
      });
    });

    setFilteredResults(results);
    onSearchResults?.(results);
    setIsSearching(false);
    lastExecutedQueryRef.current = query;
  }, [data, searchKeys, onSearchResults, customFilter]);

  // Handle search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
      
      if (lastExecutedQueryRef.current !== '') {
        setIsSearching(true);
        Promise.resolve().then(() => {
          performSearch('');
        });
      }
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (lastExecutedQueryRef.current !== searchQuery) {
      setIsSearching(true);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, debounceTime);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    };
  }, [searchQuery, performSearch, debounceTime]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const currentSize = sizeConfig[size];
  const currentTheme = themeConfig[theme];
  const currentVariant = variantConfig[variant];

  const isLabelActive = isFocused || searchQuery;

  // Format no results message with query
  const formattedNoResultsMessage = noResultsMessage.replace('{query}', searchQuery);

  return (
    <div className={`flex items-start justify-center mt-10 ${className}`}>
      <div className="w-full max-w-4xl px-4">
        <div className={`relative ${currentSize.container} mx-auto`}>
          {/* Search Input Container */}
          <div className="relative group">
            {/* Animated Label */}
            <label 
              className={`
                absolute left-4 transition-all duration-300 pointer-events-none
                ${currentTheme.label}
                ${isLabelActive 
                  ? `-top-6 text-sm ${isFocused ? currentTheme.labelActive : currentTheme.labelInactive}` 
                  : 'top-1/2 -translate-y-1/2 text-base opacity-70'
                }
                ${disabled ? 'opacity-50' : ''}
                font-medium
                z-10
                transform-gpu
              `}
            >
              {placeholder}
            </label>

            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={isLabelActive ? '' : placeholder}
              disabled={disabled}
              className={`
                w-full
                ${currentSize.input}
                ${currentTheme.input}
                ${currentVariant.rounded}
                ${currentVariant.shadow}
                ${currentVariant.border}
                ${currentTheme.focus}
                ${currentVariant.transition}
                disabled:opacity-50 disabled:cursor-not-allowed
                pr-20
                outline-none
                hover:border-blue-300
              `}
              aria-label="Search"
            />
            
            {/* Animated underline effect for minimal variant */}
            {variant === 'minimal' && (
              <div 
                className={`
                  absolute bottom-0 left-0 h-0.5 
                  ${isFocused ? 'bg-blue-500' : 'bg-transparent'}
                  transition-all duration-300
                  ${isFocused ? 'w-full' : 'w-0'}
                `}
              />
            )}
            
            {/* Icons Container */}
            <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
              {/* Loading Indicator */}
              {isSearching && (
                <div className={`
                  ${currentSize.icon} 
                  ${currentTheme.spinner}
                  border-2 rounded-full animate-spin
                  transition-opacity duration-300
                `} />
              )}
              
              {/* Clear Button */}
              {searchQuery && !isSearching && !disabled && (
                <button
                  onClick={clearSearch}
                  className={`
                    ${currentTheme.clearButton}
                    transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full
                    p-1
                    hover:scale-110
                    active:scale-95
                  `}
                  aria-label="Clear search"
                >
                  <svg 
                    className={currentSize.icon} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              )}
              
              {/* Search Icon */}
              <svg 
                className={`
                  ${currentSize.icon} 
                  ${currentTheme.icon}
                  transition-all duration-300
                  ${isFocused ? `text-blue-500 scale-110 ${isLabelActive ? 'rotate-90' : ''}` : ''}
                  ${isSearching ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}
                `} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
          </div>

          {/* Results Count */}
          {showResultCount && data.length > 0 && !isSearching && (
            <div className={`
              mt-3 
              ${currentTheme.resultCount}
              ${currentSize.resultCount}
              text-center
              animate-fadeIn
              transition-all duration-300
            `}>
              {searchQuery && filteredResults.length > 0 && (
                <span className="inline-flex items-center space-x-2">
                  <span className="font-semibold">{filteredResults.length}</span>
                  <span>result{filteredResults.length !== 1 ? 's' : ''}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                    {((filteredResults.length / data.length) * 100).toFixed(0)}%
                  </span>
                </span>
              )}
            </div>
          )}

          {/* No Results Message - Now controlled by showNoResultsMessage prop */}
          {showNoResultsMessage && searchQuery && !isSearching && filteredResults.length === 0 && (
            <>
              {noResultsComponent ? (
                noResultsComponent
              ) : (
                <div className={`
                  mt-4 text-center py-6 px-4 
                  ${currentTheme.noResults}
                  rounded-xl border
                  animate-slideDown
                  transition-all duration-300
                  backdrop-blur-sm
                `}>
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-14 0 9 9 0 0114 0z" />
                  </svg>
                  <p className="text-base font-medium">{formattedNoResultsMessage}</p>
                  <p className="text-sm mt-2 opacity-60">Try different keywords or check your spelling</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

Search.propTypes = {
  data: PropTypes.array.isRequired,
  searchKeys: PropTypes.array,
  onSearchResults: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  debounceTime: PropTypes.number,
  showResultCount: PropTypes.bool,
  customFilter: PropTypes.func,
  initialQuery: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'minimal', 'compact']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  theme: PropTypes.oneOf(['light', 'dark']),
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  showNoResultsMessage: PropTypes.bool, // New prop
  noResultsMessage: PropTypes.string, // New prop
  noResultsComponent: PropTypes.node // New prop
};

// Set default props
Search.defaultProps = {
  showNoResultsMessage: false, // Default to false
  noResultsMessage: 'No results found for "{query}"',
  noResultsComponent: null
};

export default Search;