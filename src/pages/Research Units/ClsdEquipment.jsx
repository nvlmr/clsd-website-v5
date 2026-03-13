// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\pages\Research Units\ClsdEquipment.jsx
import React, { useState, useEffect, useMemo } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Search from "../../components/Search.jsx";
import { useSearch } from "../../hooks/useSearch.js";
import { searchConfigs } from "../../config/searchConfigs.js";
import { usePaginatedEquipment } from "../../hooks/ClsdEquipment.js";
import { 
  ArrowLeft,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
  Info,
  Award,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

function ClsdEquipment() {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [activeFilter, setActiveFilter] = useState('all');
  const [imageErrors, setImageErrors] = useState({});
  
  // Get equipment data from hook
  const {
    currentItems: paginatedItems,
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
    hasPrevPage,
    equipment: allEquipment
  } = usePaginatedEquipment(itemsPerPage);

  // Use the custom search hook
  const {
    filteredData,
    searchTerm,
    isSearching,
    searchResults,
    handleSearchResults,
    handleSearchStart,
    handleSearchClear,
    resetSearch
  } = useSearch(allEquipment, {
    searchKeys: [
      'name',
      'description',
      'model',
      'applications',
      'status'
    ]
  });

  // Apply filter to searched results
  const filteredAndSearchedEquipment = useMemo(() => {
    let result = [...filteredData];

    // Apply Status Filter
    if (activeFilter !== 'all') {
      result = result.filter(equipment => 
        equipment.status?.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    return result;
  }, [filteredData, activeFilter]);

  // Pagination calculation for filtered results
  const totalFilteredPages = Math.ceil(filteredAndSearchedEquipment.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEquipment = filteredAndSearchedEquipment.slice(startIndex, endIndex);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 6 : 8);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to page 1 when filter changes or search results change
  useEffect(() => {
    if (currentPage !== 1) {
      goToPage(1);
    }
  }, [activeFilter, filteredData.length, goToPage, currentPage]);

  // Scroll to top when page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
    
    return () => clearTimeout(timer);
  }, [currentPage, selectedEquipment]);

  const handleEquipmentClick = (equipment) => {
    setSelectedEquipment(equipment);
  };

  const handleBackClick = () => {
    setSelectedEquipment(null);
  };

  const handleFilterClick = (type) => {
    setActiveFilter(type);
  };

  const handleClearFilters = () => {
    setActiveFilter('all');
    resetSearch();
  };

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      prevPage();
    } else if (direction === 'next' && currentPage < totalFilteredPages) {
      nextPage();
    }
  };

  const handleGoToPage = (page) => {
    goToPage(page);
  };

  const handleImageError = (equipmentId) => {
    setImageErrors(prev => ({ ...prev, [equipmentId]: true }));
  };

  // Status icon component - blue icons only, no text
  const StatusIcon = ({ status }) => {
    if (status === 'available') {
      return <CheckCircle className="w-5 h-5 text-blue-500" />;
    } else if (status === 'maintenance') {
      return <AlertTriangle className="w-5 h-5 text-blue-500" />;
    }
    return null;
  };

  // Filter button styling - updated to match NewsEvents with equal width
  const getFilterButtonStyle = (type) => {
    const isActive = activeFilter === type;
    const baseClasses = "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 w-45 text-center";
    
    return `${baseClasses} ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-300 ring-offset-2'
        : 'bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
    }`;
  };

  // Updated EquipmentCard with NewsEvents styling and icon at upper right corner
  const EquipmentCard = ({ equipment }) => (
    <div 
      className="group relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => handleEquipmentClick(equipment)}
    >
      {/* Blue line at the bottom on hover - matching NewsEvents */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-bottom"></div>
      
      {/* Image Container - matching NewsEvents styling */}
      <div className="relative pt-[100%] bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          {equipment.image && !imageErrors[equipment.id] ? (
            <img
              src={equipment.image}
              alt={equipment.name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={() => handleImageError(equipment.id)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Status Icon at upper right corner */}
        <div className="absolute top-2 right-2">
          <StatusIcon status={equipment.status} />
        </div>
      </div>

      {/* Text Container - matching NewsEvents card text styling */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 text-center line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {equipment.name}
        </h3>
        {equipment.model && equipment.model !== 'N/A' && (
          <p className="text-xs text-gray-500 text-center mt-1">
            Model: {equipment.model}
          </p>
        )}
      </div>
    </div>
  );

  // Updated DetailView with NewsEvents styling - removed status icon beside name
  const DetailView = ({ equipment }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">
      <button
        onClick={handleBackClick}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        <span>Back to Equipment List</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        {/* Hero Image Section - matching NewsEvents styling */}
        <div className="relative bg-gray-100">
          <div className="h-64 md:h-96 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center p-8">
              {equipment.image && !imageErrors[equipment.id] ? (
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(equipment.image, '_blank')}
                  onError={() => handleImageError(equipment.id)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <svg className="w-24 h-24 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* Title in blue gradient header - matching NewsEvents - removed status icon */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{equipment.name}</h1>
          {equipment.model && equipment.model !== 'N/A' && (
            <p className="text-blue-100">Model: {equipment.model}</p>
          )}
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Description - matching NewsEvents styling */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Description</h2>
            </div>
            <div className="ml-7 prose prose-blue max-w-none text-gray-700">
              <p className="leading-relaxed">{equipment.description}</p>
            </div>
          </div>

          {/* Equipment Details Grid - matching NewsEvents styling */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Equipment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {equipment.year_acquired && (
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year Acquired</p>
                    <p className="text-base font-medium text-gray-900">{equipment.year_acquired}</p>
                  </div>
                </div>
              )}

              {equipment.status && (
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Tag className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-base font-medium text-gray-900 capitalize">{equipment.status === 'maintenance' ? 'Under Maintenance' : equipment.status}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Applications Section - matching NewsEvents styling */}
          {equipment.applications && equipment.applications.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-blue-600" />
                <h3 className="text-md font-semibold text-gray-900">Applications</h3>
              </div>
              <ul className="ml-7 space-y-2">
                {equipment.applications.map((app, index) => (
                  <li key={index} className="text-gray-700 flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    {app}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AutoScroll />
      <NavBar />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 mt-25">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div className="max-w-4xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 leading-tight font-semibold">
                  Available Equipment
                </span>
              </h1>
              <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl">
                Browse our available laboratory equipment and instruments for research and testing purposes.
              </p>
            </div>
          </div>
        </section>

        {/* Loading State - Only spinner and text, no grid */}
        {loading && (
          <div className="container mx-auto px-4 mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading CLSD Equipments...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="container mx-auto px-4 mt-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">Error: {error}</p>
              <button
                onClick={() => refreshData()}
                className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Main Content Section - Only show when not loading and no error */}
        {!loading && !error && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {!selectedEquipment ? (
              /* Equipment Grid View */
              <div className="w-full">
                {/* Search Component */}
                <Search 
                  className="mb-8"
                  data={allEquipment}
                  {...searchConfigs.clsdEquipment}
                  onSearchResults={handleSearchResults}
                  onSearchStart={handleSearchStart}
                  onSearchClear={handleSearchClear}
                />
                
                {/* Filter Buttons - matching NewsEvents styling */}
                <div className="flex flex-col items-center mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Filter by status:</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {['all', 'available', 'maintenance'].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleFilterClick(type)}
                        className={getFilterButtonStyle(type)}
                      >
                        {type === 'maintenance' ? 'Under Maintenance' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Stats - matching NewsEvents styling */}
                {searchTerm && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Found {filteredAndSearchedEquipment.length} result{filteredAndSearchedEquipment.length !== 1 ? 's' : ''} for "{searchTerm}"
                      {activeFilter !== 'all' && ` with ${activeFilter === 'maintenance' ? 'under maintenance' : activeFilter} status`}
                    </p>
                  </div>
                )}

                {currentEquipment.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No equipment found.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      {currentEquipment.map((equipment) => (
                        <EquipmentCard key={equipment.id} equipment={equipment} />
                      ))}
                    </div>

                    {/* Pagination - matching NewsEvents styling */}
                    {totalFilteredPages > 1 && (
                      <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
                        <button
                          onClick={() => handlePageChange('prev')}
                          disabled={currentPage === 1}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                            currentPage === 1
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-blue-600 hover:bg-blue-50 hover:scale-110'
                          }`}
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        <div className="flex items-center space-x-1 sm:space-x-2">
                          {Array.from({ length: totalFilteredPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => handleGoToPage(page)}
                              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                              aria-label={`Go to page ${page}`}
                              aria-current={currentPage === page ? 'page' : undefined}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => handlePageChange('next')}
                          disabled={currentPage === totalFilteredPages}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                            currentPage === totalFilteredPages
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-blue-600 hover:bg-blue-50 hover:scale-110'
                          }`}
                          aria-label="Next page"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              /* Equipment Detail View */
              <DetailView equipment={selectedEquipment} />
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ClsdEquipment;