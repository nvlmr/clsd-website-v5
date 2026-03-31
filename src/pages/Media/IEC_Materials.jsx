// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\pages\Media\IEC_Materials.jsx

import React, { useState, useEffect, useRef } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Calendar, 
  ArrowLeft,
  RefreshCw,
  Download,
  AlertCircle
} from "lucide-react";

import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Search from "../../components/Search.jsx";
import useIECMaterials from "../../hooks/IEC_Materials.js";
import { downloadFile } from "../../services/iec_materials_api.js";
import { useSearch } from "../../hooks/useSearch.js";
import { searchConfigs } from "../../config/searchConfigs.js";

// Constants
const ITEMS_PER_PAGE = {
  MOBILE: 6,
  TABLET: 8,
  DESKTOP: 9
};

const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 1024
};

// Helper Functions
const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch {
    return dateString;
  }
};

// Components - Fixed WaterFillingLoading that completes at 100%
const WaterFillingLoading = () => {
  const [waterLevel, setWaterLevel] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate loading progress that completes in ~5 seconds
    const interval = setInterval(() => {
      setWaterLevel(prev => {
        if (prev >= 100) {
          setIsComplete(true);
          clearInterval(interval);
          return 100;
        }
        // Slower increment to last about 5 seconds (100 increments * 50ms = 5 seconds)
        return prev + 1;
      });
    }, 70); // 70ms increments = 5 seconds for 100
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[50vh] flex items-center justify-center py-50">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Horizontal Water Bar */}
        <div className="relative">
          {/* Background Bar */}
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            {/* Water Fill */}
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-100 ease-out relative"
              style={{ width: `${waterLevel}%` }}
            >
              {/* Ripple Effect */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 bottom-0 w-full">
                  <div className="absolute top-0 bottom-0 w-20 bg-white/30 transform -skew-x-12 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Percentage Label */}
          <div className="absolute -top-6 right-0 text-xs text-blue-600 font-medium">
            {Math.min(100, Math.floor(waterLevel))}%
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm font-medium">
            {waterLevel >= 100 ? 'Loading complete!' : 'Loading IEC materials...'}
          </p>
          <div className="flex justify-center space-x-1 mt-2">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MaterialCard = ({ material, onClick }) => (
  <div 
    className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
    onClick={onClick}
  >
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-bottom"></div>
    
    <div className="relative pt-[60%] sm:pt-[56.25%] bg-gray-200 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {material.cover_image ? (
          <img 
            src={material.cover_image} 
            alt={material.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/400x200?text=IEC+Material";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400" />
          </div>
        )}
      </div>
    </div>
    
    <div className="p-3 sm:p-4 flex flex-col flex-grow">
      <div className="min-h-[3rem] sm:min-h-[3.5rem] mb-2 border-b border-gray-200 pb-2">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {material.title}
        </h3>
      </div>
      
      <div className="space-y-1.5 sm:space-y-2 mt-1">
        <div className="flex sm:hidden flex-col space-y-1.5">
          <span className="text-gray-600 flex items-start gap-1.5">
            <Calendar className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
            <span className="text-xs">{material.year}</span>
          </span>
        </div>

        <div className="hidden sm:block space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-500">{material.year}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DetailView = ({ material, onBack, onDownload, downloading }) => {
  const getFileName = () => material.document?.split('/').pop() || 'iec-material';
  const hasAttachment = !!material.document;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 group"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="text-sm sm:text-base">Back to IEC Materials</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        {material.cover_image && (
          <div className="relative h-48 sm:h-64 md:h-96 overflow-hidden">
            <img 
              src={material.cover_image} 
              alt={material.title}
              className="w-full h-full object-cover"
              onError={(e) => e.target.style.display = 'none'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        )}

        <div className={material.cover_image 
          ? "bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-6 sm:py-8 text-white"
          : "px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200"
        }>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{material.title}</h1>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          {material.description && (
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Description</h2>
              </div>
              <p className="ml-4 sm:ml-7 text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {material.description}
              </p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-4">Material Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">Year</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">{material.year}</p>
                </div>
              </div>
            </div>
          </div>

          {hasAttachment && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h3 className="text-sm sm:text-md font-semibold text-gray-900">Attachments</h3>
                <span className="text-xs sm:text-sm text-gray-500 ml-2">(1 file)</span>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base text-gray-900 font-medium truncate">{getFileName()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
                    <button
                      onClick={() => onDownload(material.document, getFileName())}
                      disabled={downloading}
                      className="p-1.5 sm:p-2 text-gray-600 hover:text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Download"
                    >
                      {downloading ? (
                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-600"></div>
                      ) : (
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, 6, 7];
    }
    
    if (currentPage >= totalPages - 3) {
      return Array.from({ length: 7 }, (_, i) => totalPages - 6 + i);
    }
    
    return Array.from({ length: 7 }, (_, i) => currentPage - 3 + i);
  };

  return (
    <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
      <button
        onClick={() => onPageChange('prev')}
        disabled={currentPage === 1}
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-600 hover:bg-blue-50 hover:scale-110'
        }`}
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <div className="flex items-center space-x-1 sm:space-x-2">
        {getPageNumbers().map(pageNum => (
          <button
            key={pageNum}
            onClick={() => onPageChange('goTo', pageNum)}
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
              currentPage === pageNum
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange('next')}
        disabled={currentPage === totalPages}
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-600 hover:bg-blue-50 hover:scale-110'
        }`}
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};

// Main Component
function IEC_Materials() {
  const { materials, loading, error, retryLoad } = useIECMaterials();
  const {
    filteredData: filteredMaterials,
    searchTerm,
    searchResults,
    handleSearchResults,
    handleSearchStart,
    handleSearchClear,
    resetSearch,
    setFilteredData
  } = useSearch(materials, searchConfigs.iecMaterials);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE.DESKTOP);
  const [downloading, setDownloading] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  
  const topRef = useRef(null);
  const searchRef = useRef(null);

  // Update filtered materials when materials change
  useEffect(() => {
    setFilteredData(materials);
  }, [materials, setFilteredData]);

  // Handle window resize for responsive items per page
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.MOBILE) {
        setItemsPerPage(ITEMS_PER_PAGE.MOBILE);
      } else if (width < BREAKPOINTS.TABLET) {
        setItemsPerPage(ITEMS_PER_PAGE.TABLET);
      } else {
        setItemsPerPage(ITEMS_PER_PAGE.DESKTOP);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to page 1 when search results change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredMaterials]);

  // Scroll to top when page changes or when returning from detail view
  useEffect(() => {
    if (topRef.current && !selectedMaterial) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage, selectedMaterial]);

  // Handle loading completion
  useEffect(() => {
    if (!loading) {
      // Add a small delay to ensure the loading animation completes
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(true);
    }
  }, [loading]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMaterials = filteredMaterials.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (action, pageNum) => {
    if (action === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (action === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (action === 'goTo' && pageNum) {
      setCurrentPage(pageNum);
    }
  };

  const handleCardClick = (material) => {
    setSelectedMaterial(material);
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    setSelectedMaterial(null);
  };

  const downloadAttachment = async (url, filename) => {
    setDownloading(true);
    try {
      const result = await downloadFile(url, filename);
      if (!result.success) {
        alert(result.error || 'Failed to download file. Please try again.');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('An error occurred while downloading. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const renderContent = () => {
    if (selectedMaterial) {
      return (
        <DetailView 
          material={selectedMaterial}
          onBack={handleBackClick}
          onDownload={downloadAttachment}
          downloading={downloading}
        />
      );
    }

    if (filteredMaterials.length === 0 && !loading) {
      return (
        <div className="text-center py-40">
          <p className="text-gray-500 text-sm sm:text-lg">
            {searchTerm 
              ? `No IEC materials found.`
              : 'No IEC materials available at the moment.'}
          </p>
          {!searchTerm && (
            <button
              onClick={retryLoad}
              className="mt-4 inline-flex items-center gap-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 auto-rows-fr">
          {currentMaterials.map((material) => (
            <MaterialCard 
              key={material.id} 
              material={material} 
              onClick={() => handleCardClick(material)}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </>
    );
  };

  const showSearchAndStats = !selectedMaterial && !loading && materials.length > 0 && !error;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AutoScroll />
      <NavBar />
      
      <div ref={topRef} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 mt-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 leading-tight font-semibold">
                IEC Materials
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl">
              Information, Education, and Communication materials for lake conservation awareness and education.
            </p>
          </div>
        </div>
      </section>

      {/* Loading State - Only show when loading and showLoading is true */}
      {loading && showLoading && <WaterFillingLoading />}

      {/* Error State */}
      {error && !loading && (
        <div className="container mx-auto px-4 mt-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700 font-medium">Error loading IEC materials</p>
            </div>
            <p className="text-red-600 text-sm mb-3">{error}</p>
            <button
              onClick={retryLoad}
              className="inline-flex items-center gap-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {/* Search Component */}
      {showSearchAndStats && (
        <>
          <div ref={searchRef} className="mt-15">
            <Search 
              data={materials}
              searchKeys={searchConfigs.iecMaterials.searchKeys}
              onSearchResults={handleSearchResults}
              onSearchStart={handleSearchStart}
              onSearchClear={handleSearchClear}
              placeholder={searchConfigs.iecMaterials.placeholder}
              showResultCount={searchConfigs.iecMaterials.showResultCount}
              debounceTime={searchConfigs.iecMaterials.debounceTime}
              showNoResultsMessage={searchConfigs.iecMaterials.showNoResultsMessage}
              noResultsMessage={searchConfigs.iecMaterials.noResultsMessage}
              minChars={searchConfigs.iecMaterials.minChars}
              variant={searchConfigs.iecMaterials.variant}
              size={searchConfigs.iecMaterials.size}
              theme={searchConfigs.iecMaterials.theme}
            />
          </div>

          {/* Search Stats */}
          {searchTerm && filteredMaterials.length > 0 && (
            <div className="container mx-auto px-4 mt-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Found {searchResults.filtered} material{searchResults.filtered !== 1 ? 's' : ''} 
                  {searchTerm && ` matching "${searchTerm}"`}
                  {searchResults.total !== searchResults.filtered && 
                    ` out of ${searchResults.total} total materials`
                  }
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-grow container mx-auto px-4 mt-8">
        {!loading && renderContent()}
      </div>
      
      <Footer />
    </div>
  );
}

export default IEC_Materials;