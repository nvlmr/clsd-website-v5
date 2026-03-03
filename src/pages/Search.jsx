import React, { useState } from 'react';
import { Search, X } from 'lucide-react'; // npm install lucide-react

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    // Add your search logic here
    // You can emit an event, call an API, or handle the search as needed
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-white py-8 pt-30 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto relative">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              {/* Floating Label */}
              <label 
                htmlFor="search-input"
                className={`absolute left-5 transition-all duration-200 pointer-events-none
                  ${searchTerm || isFocused 
                    ? 'text-xs -top-6 text-blue-600 font-medium' 
                    : 'text-base top-3 text-blue-400/70'
                  }`}
              >
                Search
              </label>
              
              <input
                id="search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full px-5 py-3 pr-24 rounded-xl border-2 transition-all duration-300 outline-none bg-white
                  ${isFocused 
                    ? 'border-blue-500 shadow-lg ring-4 ring-blue-100' 
                    : 'border-blue-200 hover:border-blue-300 shadow-sm'
                  }
                  ${searchTerm ? 'bg-white' : 'bg-white/90'}`}
                style={{ backdropFilter: searchTerm ? 'none' : 'blur(4px)' }}
              />
            </div>
            
            {/* Icons Container */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              {/* Clear button - only shows when there's text */}
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-1.5 hover:bg-blue-50 rounded-full transition-colors group"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 text-blue-400 group-hover:text-blue-600" />
                </button>
              )}
              
              {/* Search button */}
              <button
                type="submit"
                className={`p-2 rounded-lg transition-all duration-300
                  ${searchTerm 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg hover:scale-105' 
                    : 'bg-blue-100 text-blue-300 cursor-not-allowed'
                  }`}
                disabled={!searchTerm}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Optional: Search suggestions dropdown */}
          {isFocused && (
            <div className="absolute z-50 mt-2 w-full max-w-2xl bg-white rounded-xl shadow-xl border border-blue-100">
              <div className="p-4">
                <p className="text-sm font-medium text-blue-600 mb-3">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Toys'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setSearchTerm(item)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-full text-sm text-blue-700 transition-all hover:scale-105 hover:shadow-sm"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;