// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\pages\Media\IEC_Materials.jsx

import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Search from "../../components/Search.jsx";
import useIECMaterials from "../../hooks/IEC_Materials.js";
import { downloadFile } from "../../services/iec_materials_api.js";
import { useSearch } from "../../hooks/useSearch.js";
import { searchConfigs } from "../../config/searchConfigs.js";

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

function IEC_Materials() {
  const { materials, loading, error, source, loadMaterials, retryLoad } = useIECMaterials();
  
  // Use the custom search hook with IEC materials configuration
  const {
    filteredData: filteredMaterials,
    searchTerm,
    isSearching,
    searchResults,
    handleSearchResults,
    handleSearchStart,
    handleSearchClear,
    resetSearch,
    setFilteredData
  } = useSearch(materials, searchConfigs.iecMaterials);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [downloading, setDownloading] = useState(false);
  
  const topRef = useRef(null);
  const searchRef = useRef(null);

  // Update filtered materials when materials change
  useEffect(() => {
    setFilteredData(materials);
  }, [materials, setFilteredData]);

  // Handle window resize for responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(6); // Mobile: 6 items
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(8); // Tablet: 8 items
      } else {
        setItemsPerPage(9); // Desktop: 9 items
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

  // Scroll to top when currentPage changes or when returning from detail view
  useEffect(() => {
    if (topRef.current && !selectedMaterial) {
      topRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [currentPage, selectedMaterial]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMaterials = filteredMaterials.slice(startIndex, endIndex);

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const handleCardClick = (material) => {
    setSelectedMaterial(material);
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    setSelectedMaterial(null);
  };

  const handleRetry = () => {
    retryLoad();
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Download attachment - similar to NewsEvents
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

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString;
    }
  };

  // Get file type from document filename
  const getDocumentType = (documentPath) => {
    if (!documentPath) return null;
    const extension = documentPath.split('.').pop().toLowerCase();
    if (['pdf'].includes(extension)) return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'word';
    if (['xls', 'xlsx'].includes(extension)) return 'excel';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
    return 'file';
  };

  // Mobile-optimized Material Card
  const MaterialCard = ({ material }) => (
    <div 
      className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => handleCardClick(material)}
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
              <span className="text-sm text-gray-500">
                {material.year}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DetailView = ({ material }) => {
    const getFileName = () => {
      if (material.document) {
        return material.document.split('/').pop();
      }
      return 'iec-material';
    };

    const hasAttachment = material.document;
    const attachmentName = getFileName();

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={handleBackClick}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="text-sm sm:text-base">Back to IEC Materials</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          {/* Hero Image */}
          {material.cover_image && (
            <div className="relative h-48 sm:h-64 md:h-96 overflow-hidden">
              <img 
                src={material.cover_image} 
                alt={material.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
          )}

          {/* Title Section */}
          {material.cover_image ? (
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-6 sm:py-8 text-white">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">{material.title}</h1>
            </div>
          ) : (
            <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{material.title}</h1>
            </div>
          )}

          <div className="p-4 sm:p-6 md:p-8">
            {/* Description */}
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

            {/* Material Details - Only Year */}
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

            {/* Attachments - Styled like NewsEvents */}
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
                        <p className="text-sm sm:text-base text-gray-900 font-medium truncate">{attachmentName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
                      <button
                        onClick={() => downloadAttachment(material.document, attachmentName)}
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

  const renderContent = () => {
    if (selectedMaterial) {
      return <DetailView material={selectedMaterial} />;
    }

    if (filteredMaterials.length === 0 && !loading) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm sm:text-lg">
            {searchTerm 
              ? `No IEC materials found matching "${searchTerm}". Try a different search term.`
              : 'No IEC materials found.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                handleSearchClear();
                resetSearch();
              }}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 auto-rows-fr">
          {currentMaterials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
            <button
              onClick={() => handlePageChange('prev')}
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
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange('next')}
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
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AutoScroll/>
      <NavBar />
      
      <div ref={topRef} />
      
      {/* Hero Section - Always visible */}
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

      {/* Loading State - Moved outside main content container */}
      {loading && (
        <div className="container mx-auto px-4 mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading IEC materials...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="container mx-auto px-4 mt-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">Error: {error}</p>
            <button
              onClick={handleRetry}
              className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {/* Search Component - Only show when not in detail view, not loading, and data is loaded */}
      {!selectedMaterial && !loading && materials.length > 0 && !error && (
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
      )}

      {/* Search Stats - Show when searching and not in detail view */}
      {!selectedMaterial && searchTerm && filteredMaterials.length > 0 && !loading && !error && (
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

      {/* Main Content Area */}
      <div className="flex-grow container mx-auto px-4 mt-8">
        {!loading && !error && renderContent()}
      </div>
      
      <Footer/>
    </div>
  );
};

export default IEC_Materials;