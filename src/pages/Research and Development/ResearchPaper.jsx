// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\pages\Research and Development\ResearchPaper.jsx

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Search from "../../components/Search.jsx";
import { useResearchPapers } from "../../hooks/ResearchPaper.js";
import { useSearch } from "../../hooks/useSearch.js";
import { searchConfigs } from "../../config/searchConfigs.js";

import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  BookOpen, 
  Calendar, 
  Users, 
  GraduationCap, 
  FileText, 
  ArrowLeft, 
  Tag,
  Download,
  Loader,
  AlertCircle,
  RefreshCw,
  Maximize2,
  X as XIcon,
  Image as ImageIcon
} from "lucide-react";

// Horizontal Water Filling Loading Component that completes in ~5 seconds
const WaterFillingLoading = () => {
  const [waterLevel, setWaterLevel] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaterLevel(prev => {
        if (prev >= 100) {
          setIsComplete(true);
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 35);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[45vh] flex items-center justify-center py-47">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="relative">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-100 ease-out relative"
              style={{ width: `${waterLevel}%` }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 bottom-0 w-full">
                  <div className="absolute top-0 bottom-0 w-20 bg-white/30 transform -skew-x-12 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute -top-6 right-0 text-xs text-blue-600 font-medium">
            {Math.min(100, Math.floor(waterLevel))}%
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm font-medium">
            {waterLevel >= 100 ? 'Loading complete!' : 'Loading research papers...'}
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

function ResearchPaper() {
  const {
    papers,
    loading,
    error,
    downloadPaper,
    downloading,
  } = useResearchPapers();

  const [selectedPaper, setSelectedPaper] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadError, setDownloadError] = useState(null);
  
  // Modal states for document preview
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  // State for cover image error
  const [coverImgError, setCoverImgError] = useState(false);
  
  const topRef = useRef(null);

  // Use the reusable search hook with search configuration
  const researchPaperSearchConfig = searchConfigs.researchPapers;
  
  const {
    filteredData: filteredPapers,
    searchTerm,
    isSearching,
    searchResults,
    handleSearchResults,
    handleSearchClear,
    resetSearch
  } = useSearch(papers, researchPaperSearchConfig);

  // Handle window resize for responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(6);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(8);
      } else {
        setItemsPerPage(9);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Scroll to top when currentPage changes or when returning from detail view
  useEffect(() => {
    if (topRef.current && !selectedPaper) {
      topRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [currentPage, selectedPaper]);

  // Reset cover image error when selected paper changes
  useEffect(() => {
    setCoverImgError(false);
  }, [selectedPaper]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPapers = filteredPapers.slice(startIndex, endIndex);

  const handlePageChange = useCallback((direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const goToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleCardClick = useCallback((paper) => {
    setSelectedPaper(paper);
    setDownloadError(null);
    window.scrollTo(0, 0);
  }, []);

  const handleBackClick = useCallback(() => {
    setSelectedPaper(null);
    setDownloadError(null);
  }, []);

  const clearSearch = useCallback(() => {
    handleSearchClear();
  }, [handleSearchClear]);

  // Format file size
  const formatFileSize = useCallback((bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }, []);

  // Helper function to get document item from various data structures
  const getDocumentItem = useCallback((paper) => {
    if (!paper.document) return null;
    
    // Handle array format (current local data)
    if (Array.isArray(paper.document) && paper.document.length > 0) {
      const doc = paper.document[0];
      return {
        url: doc.url || doc.download_url,
        name: doc.name || doc.file_name || `${paper.title}.pdf`,
        type: 'application/pdf',
        size: doc.size
      };
    }
    
    // Handle object format (potential future server data)
    if (typeof paper.document === 'object' && !Array.isArray(paper.document)) {
      return {
        url: paper.document.url || paper.document.download_url,
        name: paper.document.name || paper.document.file_name || `${paper.title}.pdf`,
        type: paper.document.type || 'application/pdf',
        size: paper.document.size
      };
    }
    
    // Handle string URL (simplest case)
    if (typeof paper.document === 'string') {
      return {
        url: paper.document,
        name: `${paper.title}.pdf`,
        type: 'application/pdf'
      };
    }
    
    return null;
  }, []);

  // Handle download with error handling - supports both hook and direct download
  const handleDownload = useCallback(async (paper) => {
    setDownloadError(null);
    
    const documentItem = getDocumentItem(paper);
    
    // If downloadPaper hook is available and it's a function (server ready)
    if (downloadPaper && typeof downloadPaper === 'function') {
      try {
        const result = await downloadPaper(paper);
        if (result && result.success) {
          console.log('Download started successfully via hook');
        } else if (result && result.url) {
          // Fallback if hook returns URL but doesn't trigger download
          const link = document.createElement('a');
          link.href = result.url;
          link.download = documentItem?.name || `${paper.title}.pdf`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        console.error('Download error with hook:', error);
        // Fallback to direct download if hook fails
        if (documentItem && documentItem.url) {
          try {
            const link = document.createElement('a');
            link.href = documentItem.url;
            link.download = documentItem.name;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (fallbackError) {
            setDownloadError(error.message || 'Failed to download document. Please try again later.');
            setTimeout(() => setDownloadError(null), 5000);
          }
        } else {
          setDownloadError(error.message || 'Failed to download document. Please try again later.');
          setTimeout(() => setDownloadError(null), 5000);
        }
      }
    } 
    // Direct download for local development (no server)
    else if (documentItem && documentItem.url) {
      try {
        const link = document.createElement('a');
        link.href = documentItem.url;
        link.download = documentItem.name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('Download started directly:', documentItem.name);
      } catch (error) {
        console.error('Direct download error:', error);
        setDownloadError('Failed to download document');
        setTimeout(() => setDownloadError(null), 5000);
      }
    } else {
      setDownloadError('No document available for download');
      setTimeout(() => setDownloadError(null), 5000);
    }
  }, [downloadPaper, getDocumentItem]);

  // Open document modal for preview
  const openDocumentModal = useCallback((document) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  // Close document modal
  const closeDocumentModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDocument(null);
    document.body.style.overflow = 'unset';
  }, []);

  // Handle keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      
      if (e.key === 'Escape') {
        closeDocumentModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeDocumentModal]);

  // Research Paper Card Component
  const ResearchPaperCard = useCallback(({ paper }) => (
    <div 
      className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => handleCardClick(paper)}
    >
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-bottom"></div>
      
      <div className="relative pt-[60%] sm:pt-[56.25%] bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {paper.cover_image ? (
            <img 
              src={paper.cover_image} 
              alt={paper.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/400x200?text=Research+Paper";
              }}
            />
          ) : (
            <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400" />
          )}
        </div>
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="min-h-[3rem] sm:min-h-[3.5rem] mb-2 border-b border-gray-200 pb-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {paper.title}
          </h3>
        </div>
        
        <div className="space-y-1.5 sm:space-y-2 mt-1">
          {/* Mobile view - Show all student names with proper wrapping */}
          <div className="flex sm:hidden flex-col space-y-1.5">
            <div className="text-gray-600 flex items-start gap-1.5">
              <User className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate">
                  {paper.student.split(',').map(name => name.trim()).join(', ')}
                </p>
              </div>
            </div>
            <p className="text-gray-600 flex items-start gap-1.5">
              <Calendar className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs">{paper.year}</span>
            </p>
          </div>
                              
          {/* Desktop view - Show all student names with proper wrapping */}
          <div className="hidden sm:block space-y-2">
            <div className="text-gray-600 flex items-start gap-2">
              <User className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">
                  {paper.student.split(',').map(name => name.trim()).join(', ')}
                </p>
              </div>
            </div>
            <p className="text-gray-600 flex items-start gap-2">
              <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span className="text-sm">{paper.year}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  ), [handleCardClick]);

  // Detail View Component - With proper student names display
  const DetailView = useCallback(({ paper }) => {
    const isDownloading = downloading === paper.id;
    
    // Get document item using the helper function
    const documentItem = getDocumentItem(paper);
    
    // Determine cover image URL (use cover_image if available, otherwise fallback to null)
    const coverImageUrl = paper.cover_image || null;

    // Helper function to split and display student names
    const renderStudentNames = (studentString) => {
      const names = studentString.split(',').map(name => name.trim());
      
      if (names.length === 1) {
        return <span className="text-sm sm:text-base font-medium text-gray-900">{names[0]}</span>;
      }
      
      return (
        <div className="space-y-1">
          {names.map((name, idx) => (
            <div key={idx} className="text-sm sm:text-base font-medium text-gray-900">
              {name}
            </div>
          ))}
        </div>
      );
    };

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={handleBackClick}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="text-sm sm:text-base">Back to Research Papers</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          {/* Hero Section with Blended Title */}
          <div className="relative h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden">
            {/* Background Image with Dark Overlay (only when image exists) */}
            {coverImageUrl && !coverImgError ? (
              <>
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${coverImageUrl})` }}
                >
                  {/* Dark Overlay for better text readability - only for actual images */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                </div>
                
                {/* Expand button */}
                <button
                  onClick={() => window.open(coverImageUrl, '_blank')}
                  className="absolute top-4 right-4 bg-black/60 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/80 transition-all z-10 backdrop-blur-sm"
                >
                  <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </>
            ) : (
              /* Placeholder - NO dark overlay */
              <div className="absolute inset-0 bg-blue-500">
              </div>
            )}
            
            {/* Title Overlay - Blended with Image */}
            <div className="absolute inset-0 flex items-end">
              <div className="w-full px-4 sm:px-6 md:px-8 pb-8 sm:pb-12 md:pb-16">
                <div className="max-w-3xl">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-white drop-shadow-lg leading-tight">
                    {paper.title}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {/* Abstract/Description if available */}
            {paper.abstract && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <h2 className="text-sm sm:text-lg font-bold text-gray-900">Abstract</h2>
                </div>
                <div className="ml-4 sm:ml-7 prose prose-blue max-w-none text-sm sm:text-base text-gray-700">
                  <p className="leading-relaxed">{paper.abstract}</p>
                </div>
              </div>
            )}

            {/* Paper Details */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-4">Paper Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Student/Author - FIXED: Show all names with proper layout */}
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500">
                      {paper.student.split(',').length > 1 ? 'Students/Authors' : 'Student/Author'}
                    </p>
                    <div className="text-sm sm:text-base font-medium text-gray-900">
                      {paper.student.split(',').map((name, idx) => (
                        <div key={idx} className="mb-1 last:mb-0">
                          {name.trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Degree Sought */}
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Degree Sought</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{paper.degree}</p>
                  </div>
                </div>

                {/* Adviser */}
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Adviser</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{paper.adviser}</p>
                  </div>
                </div>

                {/* Year */}
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Year</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{paper.year}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Section */}
            {paper.tags && (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <h3 className="text-sm sm:text-md font-semibold text-gray-900">Tags</h3>
                </div>
                <div className="ml-4 sm:ml-7 flex flex-wrap gap-1.5 sm:gap-2">
                  {paper.tags.split(',').map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 text-xs sm:text-sm rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Documents Section - Fixed to handle array structure */}
            {documentItem && (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <h3 className="text-sm sm:text-md font-semibold text-gray-900">Documents</h3>
                  <span className="text-xs sm:text-sm text-gray-500 ml-2">(1 file)</span>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base text-gray-900 font-medium truncate">{documentItem.name}</p>
                        {documentItem.size && (
                          <p className="text-xs text-gray-500 mt-0.5">{formatFileSize(documentItem.size)}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
                      <button
                        onClick={() => handleDownload(paper)}
                        disabled={isDownloading}
                        className="p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Download"
                      >
                        {isDownloading ? (
                          <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                {downloadError && (
                  <div className="mt-3">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {downloadError}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [handleBackClick, downloading, handleDownload, downloadError, coverImgError, getDocumentItem, formatFileSize]);

  
  // Document Preview Modal
  const DocumentModal = useCallback(() => {
    if (!isModalOpen || !selectedDocument) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm"
          onClick={closeDocumentModal}
        />
        
        <div className="relative z-10 w-full h-full flex items-center justify-center p-2 sm:p-4">
          <button
            onClick={closeDocumentModal}
            className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-1.5 sm:p-2 transition-all z-20"
          >
            <XIcon className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 text-white bg-black bg-opacity-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
            Document Preview
          </div>

          <div className="flex items-center justify-center w-full h-full">
            {selectedDocument.type === 'application/pdf' ? (
              <iframe
                src={selectedDocument.url}
                title="Document Preview"
                className="w-full h-[85vh] rounded-lg bg-white"
                onError={(e) => {
                  console.error('Failed to load PDF');
                }}
              />
            ) : (
              <div className="text-center text-white">
                <FileText className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4" />
                <p className="text-sm sm:text-base">Preview not available for this file type</p>
                <button
                  onClick={() => {
                    window.open(selectedDocument.url, '_blank');
                  }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Open Document
                </button>
              </div>
            )}
          </div>

          <a
            href={selectedDocument.url}
            download={selectedDocument.name}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 sm:p-3 transition-all z-20"
            title="Download document"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>
      </div>
    );
  }, [isModalOpen, selectedDocument, closeDocumentModal]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AutoScroll/>
      <NavBar />
      
      <div ref={topRef} />
      
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 mt-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 leading-tight font-semibold">
                Research Papers
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl">
              Scientific research supporting the sustainable development and conservation of lake environments.
            </p>
          </div>
        </div>
      </section>
      
      <div className="flex-grow container mx-auto px-4 mt-15">
        {/* Loading State - WaterFillingLoading */}
        {loading && <WaterFillingLoading />}

        {/* Error State */}
        {error && !loading && (
          <div className="container mx-auto px-4 mt-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700 font-medium">Error loading research papers</p>
              </div>
              <p className="text-red-600 text-sm mb-3">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Show content when not loading */}
        {!loading && !error && (
          <>
            {!selectedPaper && (
              <div className="mb-8">
                <Search 
                  data={papers}
                  searchKeys={researchPaperSearchConfig.searchKeys}
                  placeholder={researchPaperSearchConfig.placeholder}
                  onSearchResults={handleSearchResults}
                  variant={researchPaperSearchConfig.variant}
                  size={researchPaperSearchConfig.size}
                  theme={researchPaperSearchConfig.theme}
                  showResultCount={researchPaperSearchConfig.showResultCount}
                  debounceTime={researchPaperSearchConfig.debounceTime}
                  minChars={researchPaperSearchConfig.minChars}
                />
              </div>
            )}

            {selectedPaper ? (
              <>
                <DetailView paper={selectedPaper} />
                <DocumentModal />
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 auto-rows-fr">
                  {currentPapers.map((paper) => (
                    <ResearchPaperCard key={paper.id} paper={paper} />
                  ))}
                </div>

                {totalPages > 1 && filteredPapers.length > 0 && (
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
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
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
                      disabled={currentPage === totalPages}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-blue-600 hover:bg-blue-50 hover:scale-110'
                      }`}
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
                
                {filteredPapers.length === 0 && !isSearching && (
                  <div className="text-center py-40">
                    <p className="text-gray-500 text-sm sm:text-lg">
                      No research papers found.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ResearchPaper;