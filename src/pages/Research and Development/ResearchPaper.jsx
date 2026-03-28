// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\pages\Research and Development\ResearchPaper.jsx

import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Search from "../../components/Search.jsx";
import { useResearchPapers } from "../../hooks/ResearchPaper.js";

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
  Tag
} from "lucide-react";

function ResearchPaper() {
  const {
    papers,
    loading,
    error,
    searchPapers,
    downloadPaper,
    getManuscriptTypes
  } = useResearchPapers();

  const [filteredPapers, setFilteredPapers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  
  const topRef = useRef(null);

  // Update filtered papers when papers or search query changes
  useEffect(() => {
    if (papers.length > 0) {
      const result = searchPapers(searchQuery);
      setFilteredPapers(result);
    }
  }, [papers, searchQuery, searchPapers]);

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

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    setSelectedPaper(null);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Handle search results from Search component
  const handleSearchResults = (results) => {
    setFilteredPapers(results);
    setSearchQuery(searchQuery);
  };

  // Handle download using the hook's download function
  const handleDownload = async (paper) => {
    try {
      await downloadPaper(paper);
    } catch (error) {
      alert(error.message || 'Failed to download document. Please try again later.');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <AutoScroll/>
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading research papers...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <AutoScroll/>
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
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
        </div>
        <Footer />
      </div>
    );
  }

  // Mobile-optimized Research Paper Card with fixed height title and underline
  const ResearchPaperCard = ({ paper }) => (
    <div 
      className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => handleCardClick(paper)}
    >
      {/* Blue line at the bottom on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-bottom"></div>
      
      {/* Image Container - with gradient background */}
      <div className="relative pt-[60%] sm:pt-[56.25%] bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400" />
        </div>
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Fixed height title area with underline */}
        <div className="min-h-[3rem] sm:min-h-[3.5rem] mb-2 border-b border-gray-200 pb-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {paper.title}
          </h3>
        </div>
        
        <div className="space-y-1.5 sm:space-y-2 mt-1">
          {/* Mobile: Show only author and year */}
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

          {/* Desktop: Show only author and year with icons (no labels) */}
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

  const DetailView = ({ paper }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadClick = async () => {
      setIsDownloading(true);
      await handleDownload(paper);
      setIsDownloading(false);
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
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-6 sm:py-8 text-white">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">{paper.title}</h1>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {/* Extract manuscript type from tags */}
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
            {/* Student/Author */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Student/Author</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7 leading-relaxed">{paper.student}</p>
            </div>

            {/* Degree Sought */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Degree Sought</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7 leading-relaxed">{paper.degree}</p>
            </div>

            {/* Adviser */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Adviser</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7 leading-relaxed">{paper.adviser}</p>
            </div>

            {/* Year */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Year</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7 leading-relaxed">{paper.year}</p>
            </div>

            {/* Tags/Keywords */}
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

            {/* Document Download Button */}
            {(paper.document || paper.document_url) && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleDownloadClick}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                      Download Full Paper
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Publication Status */}
            {paper.published !== undefined && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="text-sm sm:text-base text-gray-700">
                    Status: {paper.published === 1 ? 'Published' : 'Unpublished'}
                  </span>
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
      
      {/* Add a hidden div as a scroll target */}
      <div ref={topRef} />
      
      {/* Hero Section */}
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
      
      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 mt-15">

        {/* Search Section - Only show when no paper is selected */}
        {!selectedPaper && (
          <>
            <div className="mb-8">
              <Search
                data={papers}
                searchKeys={['title', 'student', 'adviser', 'degree', 'tags']}
                onSearchResults={handleSearchResults}
                debounceTime={300}
                showResultCount={true}
                variant="default"
                theme="light"
              />
            </div>

            {/* Search Stats */}
            {searchQuery && (
              <div className="mb-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  Found {filteredPapers.length} result{filteredPapers.length !== 1 ? 's' : ''}
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
            )}
          </>
        )}

        {selectedPaper ? (
          <DetailView paper={selectedPaper} />
        ) : (
          <>
            {/* Research Paper Tiles Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 auto-rows-fr">
              {currentPapers.map((paper) => (
                <ResearchPaperCard key={paper.id} paper={paper} />
              ))}
            </div>

            {/* Pagination */}
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

                {/* Page numbers */}
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

            {/* No Results Message */}
            {filteredPapers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm sm:text-lg">
                  {searchQuery 
                    ? `No papers found for "${searchQuery}".`
                    : "No research papers found."}
                </p>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ResearchPaper;