// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\pages\Research Units\ClsdEquipment.jsx
import React, { useState, useEffect } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Search from "../../components/Search.jsx";
import { usePaginatedEquipment } from "../../hooks/ClsdEquipment.js";
import { useSearch } from "../../hooks/useSearch.js";
import { searchConfigs } from "../../config/searchConfigs.js";

function ClsdEquipment() {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [isChangingPage, setIsChangingPage] = useState(false);
  
  // Get equipment data from hook
  const {
    currentItems,
    loading,
    error,
    dataSource,
    serverAvailable,
    refreshing,
    refreshData,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage
  } = usePaginatedEquipment(itemsPerPage);

  // Initialize search hook with equipment data
  const {
    filteredData,
    searchTerm,
    isSearching,
    searchResults,
    handleSearchResults,
    handleSearchStart,
    handleSearchClear,
    resetSearch
  } = useSearch(currentItems, searchConfigs.equipment);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 6 : 8);
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    if (!isChangingPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, isChangingPage]);

  // Alternative approach: use a ref to track if we should scroll
  useEffect(() => {
    // This will run after every render when currentPage changes
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50); // Small delay to ensure DOM has updated
    
    return () => clearTimeout(timer);
  }, [currentPage]); // Only depend on currentPage

  const handleEquipmentClick = (equipment) => {
    setSelectedEquipment(equipment);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackClick = () => {
    setSelectedEquipment(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Custom pagination handlers with scroll to top
  const handleNextPage = () => {
    setIsChangingPage(true);
    nextPage();
    // Small delay to ensure the page change has started
    setTimeout(() => {
      setIsChangingPage(false);
    }, 100);
  };

  const handlePrevPage = () => {
    setIsChangingPage(true);
    prevPage();
    setTimeout(() => {
      setIsChangingPage(false);
    }, 100);
  };

  const handleGoToPage = (page) => {
    setIsChangingPage(true);
    goToPage(page);
    setTimeout(() => {
      setIsChangingPage(false);
    }, 100);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      available: { bg: 'bg-green-100', text: 'text-green-800', label: 'Available' },
      maintenance: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Under Maintenance' }
    };
    
    const config = statusConfig[status] || statusConfig.available;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Determine which items to display based on search
  const displayItems = searchTerm ? filteredData : currentItems;
  const hasSearchResults = displayItems.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AutoScroll />
      <NavBar />
      <main className="flex-grow pt-16 sm:pt-20 lg:pt-24">
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-10">
            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl tracking-tight">
                <span className="text-gray-900 font-semibold">Available </span>
                <span className="text-blue-500 font-semibold">Equipment</span>
              </h1>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search Bar */}
          <div className="mb-8 flex justify-center">
            <Search
              data={currentItems}
              {...searchConfigs.equipment}
              onSearchResults={handleSearchResults}
              onSearchStart={handleSearchStart}
              onSearchClear={handleSearchClear}
              className="w-full max-w-2xl"
              initialQuery={searchTerm}
            />
          </div>

          {/* Search Results Info */}
          {searchTerm && !loading && (
            <div className="mb-6 text-center">
              <p className="text-sm text-gray-600">
                Found <span className="font-semibold text-blue-600">{searchResults.filtered}</span> result{searchResults.filtered !== 1 ? 's' : ''} 
                {searchResults.filtered > 0 && ` out of ${searchResults.total} total items`}
                {searchResults.filtered === 0 && ' matching your search'}
              </p>
            </div>
          )}

          {loading ? (
            /* Loading Skeleton */
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(itemsPerPage)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="w-full pt-[100%] bg-gray-200"></div>
                  <div className="p-3 sm:p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : !selectedEquipment ? (
            /* Equipment Grid View */
            <div className="w-full">
              {displayItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">No equipment found</p>
                  <p className="text-sm text-gray-400">
                    {searchTerm 
                      ? `No results matching "${searchTerm}"` 
                      : "There's no equipment available at the moment."}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={handleSearchClear}
                      className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {displayItems.map((equipment) => (
                      <div
                        key={equipment.id}
                        onClick={() => handleEquipmentClick(equipment)}
                        className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer flex flex-col"
                      >
                        {/* Status Badge */}
                        <div className="absolute top-2 right-2 z-10">
                          <StatusBadge status={equipment.status} />
                        </div>
                        
                        {/* Fixed size image container with exact dimensions */}
                        <div className="w-full pt-[100%] relative bg-gray-100">
                          <div className="absolute inset-0 flex items-center justify-center p-4">
                            {equipment.image ? (
                              <img
                                src={equipment.image}
                                alt={equipment.name}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Fixed height text container */}
                        <div className="p-3 sm:p-4 border-t border-gray-100">
                          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 text-center line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {equipment.name}
                          </h3>
                          {equipment.model && equipment.model !== 'N/A' && (
                            <p className="text-xs text-gray-500 text-center mt-1">
                              Model: {equipment.model}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination - only show if not searching or if search has results and no search term */}
                  {!searchTerm && totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 mt-8">
                      <button
                        onClick={handlePrevPage}
                        disabled={!hasPrevPage}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                          !hasPrevPage
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-blue-600 hover:bg-blue-50 hover:scale-110'
                        }`}
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      {/* Page numbers */}
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handleGoToPage(page)}
                            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleNextPage}
                        disabled={!hasNextPage}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                          !hasNextPage
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-blue-600 hover:bg-blue-50 hover:scale-110'
                        }`}
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            /* Equipment Detail View */
            <div className="w-full max-w-4xl mx-auto animate-fadeIn">
              {/* Back Button */}
              <button
                onClick={handleBackClick}
                className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
              >
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Equipment List
              </button>

              {/* Equipment Detail Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="lg:w-1/2 bg-gray-100">
                    <div className="w-full pt-[75%] lg:pt-[100%] relative">
                      <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8">
                        {selectedEquipment.image ? (
                          <img
                            src={selectedEquipment.image}
                            alt={selectedEquipment.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Details Section */}
                  <div className="lg:w-1/2 p-6 sm:p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        {selectedEquipment.name}
                      </h2>
                      <StatusBadge status={selectedEquipment.status} />
                    </div>
                    
                    <div className="space-y-6">
                      {/* Model and Year */}
                      {(selectedEquipment.model || selectedEquipment.year_acquired) && (
                        <div className="grid grid-cols-2 gap-4">
                          {selectedEquipment.model && selectedEquipment.model !== 'N/A' && (
                            <div>
                              <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                                Model
                              </h3>
                              <p className="text-sm text-gray-600">{selectedEquipment.model}</p>
                            </div>
                          )}
                          {selectedEquipment.year_acquired && (
                            <div>
                              <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                                Year Acquired
                              </h3>
                              <p className="text-sm text-gray-600">{selectedEquipment.year_acquired}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Description */}
                      <div>
                        <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                          Description
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {selectedEquipment.description}
                        </p>
                      </div>
                      
                      {/* Applications */}
                      {selectedEquipment.applications && selectedEquipment.applications.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                          <h3 className="text-xs font-semibold text-blue-800 mb-3">
                            Applications
                          </h3>
                          <ul className="text-xs sm:text-sm text-gray-600 space-y-2">
                            {selectedEquipment.applications.map((app, index) => (
                              <li key={index} className="flex items-start">
                                <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {app}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Additional Info */}
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-xs sm:text-sm text-gray-500">
                          For more information about this equipment or to schedule its use, 
                          please contact our laboratory staff.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ClsdEquipment;