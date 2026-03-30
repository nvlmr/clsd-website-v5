// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\pages\Research and Development\ResearchPaper.jsx

import React, { useState, useEffect, useRef } from "react";
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
  Award,
  Tag,
  Download,
  Loader
} from "lucide-react";
function ResearchPaper() {
  const {
    papers,
    loading,
    error,
    downloadPaper,
    downloading,
    getManuscriptTypes
  } = useResearchPapers();

  const [selectedPaper, setSelectedPaper] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadError, setDownloadError] = useState(null);
  
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPapers = filteredPapers.slice(startIndex, endIndex);

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

  const handleCardClick = (paper) => {
    setSelectedPaper(paper);
    setDownloadError(null);
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    setSelectedPaper(null);
    setDownloadError(null);
  };

  const clearSearch = () => {
    handleSearchClear();
  };

  // Handle download with error handling
  const handleDownload = async (paper) => {
    setDownloadError(null);
    try {
      const result = await downloadPaper(paper);
      if (result.success) {
        console.log('Download started successfully');
      }
    } catch (error) {
      console.error('Download error:', error);
      setDownloadError(error.message || 'Failed to download document. Please try again later.');
      setTimeout(() => setDownloadError(null), 5000);
    }
  };

  // Research Paper Card Component
  const ResearchPaperCard = ({ paper }) => (
    <div 
      className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => handleCardClick(paper)}
    >
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-bottom"></div>
      
      <div className="relative pt-[60%] sm:pt-[56.25%] bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400" />
        </div>
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="min-h-[3rem] sm:min-h-[3.5rem] mb-2 border-b border-gray-200 pb-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {paper.title}
          </h3>
        </div>
        
        <div className="space-y-1.5 sm:space-y-2 mt-1">
          <div className="flex sm:hidden flex-col space-y-1.5">
            <p className="text-gray-600 flex items-start gap-1.5">
              <User className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs line-clamp-1">{paper.student}</span>
            </p>
            <p className="text-gray-600 flex items-start gap-1.5">
              <Calendar className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs line-clamp-1">{paper.year}</span>
            </p>
          </div>
          <div className="hidden sm:block space-y-2">
            <p className="text-gray-600 flex items-start gap-2">
              <User className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span className="text-sm line-clamp-1">{paper.student}</span>
            </p>
            <p className="text-gray-600 flex items-start gap-2">
              <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span className="text-sm line-clamp-1">{paper.year}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Detail View Component
  const DetailView = ({ paper }) => {
    const isDownloading = downloading === paper.id;

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
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-6 sm:py-8 text-white">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">{paper.title}</h1>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-full">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                {paper.tags?.split(',').map(tag => tag.trim()).find(tag => tag === 'Thesis' || tag === 'Dissertation') || 'Research'}
              </span>
              <span className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-full">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                {paper.year}
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Student/Author</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7 leading-relaxed">{paper.student}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Degree Sought</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7 leading-relaxed">{paper.degree}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Adviser</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7 leading-relaxed">{paper.adviser}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Year</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7 leading-relaxed">{paper.year}</p>
            </div>

            {paper.tags && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Tags</h2>
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

            {paper.document && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleDownload(paper)}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <>
                      <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                      Download Full Paper (PDF)
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-2 ml-1">
                  Click to download the complete research paper
                </p>
              </div>
            )}

            {downloadError && (
              <div className="pt-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {downloadError}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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
        {/* Show loading state in content area */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading research papers...</p>
          </div>
        )}

        {/* Show error state */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Show content when not loading */}
        {!loading && !error && (
          <>
            {!selectedPaper && (
              <>
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

                {searchTerm && !isSearching && (
                  <div className="mb-4">
                    <p className="text-xs sm:text-sm text-gray-600">
                      {researchPaperSearchConfig.resultCountMessage
                        ? researchPaperSearchConfig.resultCountMessage
                            .replace('{count}', filteredPapers.length)
                            .replace('{plural}', filteredPapers.length !== 1 ? 's' : '')
                            .replace('{query}', searchTerm)
                        : `Found ${filteredPapers.length} result${filteredPapers.length !== 1 ? 's' : ''} for "${searchTerm}"`
                      }
                    </p>
                  </div>
                )}
              </>
            )}

            {selectedPaper ? (
              <DetailView paper={selectedPaper} />
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
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
                {filteredPapers.length === 0 && !isSearching && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-sm sm:text-lg">
                      {searchTerm 
                        ? (researchPaperSearchConfig.noResultsMessage
                            ? researchPaperSearchConfig.noResultsMessage.replace('{query}', searchTerm)
                            : `No papers found for "${searchTerm}".`)
                        : "No research papers found."}
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