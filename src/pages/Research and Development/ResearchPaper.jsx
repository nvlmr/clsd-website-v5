import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Search from "../../components/Search.jsx";
import researchPapersData from "../../data/ResearchPaper.js";

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
  Filter
} from "lucide-react";

function ResearchPaper() {
  const [filteredPapers, setFilteredPapers] = useState(researchPapersData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [typeFilter, setTypeFilter] = useState('all');
  
  const topRef = useRef(null);

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

  // Apply type filter to papers
  const getFilteredPapers = () => {
    let result = [...filteredPapers];
    
    // Apply Type Filter
    if (typeFilter !== 'all') {
      result = result.filter(paper => 
        paper.Manusript?.toLowerCase() === typeFilter.toLowerCase()
      );
    }
    
    return result;
  };

  const displayedPapers = getFilteredPapers();

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, filteredPapers]);

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
  const totalPages = Math.ceil(displayedPapers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPapers = displayedPapers.slice(startIndex, endIndex);

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

  const handleTypeFilterClick = (type) => {
    setTypeFilter(type);
  };

  const clearSearch = () => {
    setFilteredPapers(researchPapersData);
    setSearchQuery("");
    setCurrentPage(1);
    setTypeFilter('all');
  };

  // Filter button style
  const getTypeFilterButtonStyle = (type) => {
    const isActive = typeFilter === type;
    const baseClasses = "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 text-center inline-flex items-center justify-center min-w-[100px]";
    
    return `${baseClasses} ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-300 ring-offset-2'
        : 'bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
    }`;
  };

  // Get unique manuscript types for filter
  const manuscriptTypes = ['all', ...new Set(researchPapersData.map(paper => paper.Manusript))];
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
      
      {/* Manuscript Type indicator - REMOVED */}
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
            <span className="text-xs line-clamp-1">{paper.authors}</span>
          </p>
          
          <p className="text-gray-600 flex items-start gap-1.5">
            <Calendar className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
            <span className="text-xs line-clamp-1">{paper.Year}</span>
          </p>
        </div>

        {/* Desktop: Show only author and year with icons (no labels) */}
        <div className="hidden sm:block space-y-2">
          <p className="text-gray-600 flex items-start gap-2">
            <User className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
            <span className="text-sm line-clamp-1">{paper.authors}</span>
          </p>
          
          <p className="text-gray-600 flex items-start gap-2">
            <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
            <span className="text-sm line-clamp-1">{paper.Year}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
);
  const DetailView = ({ paper }) => (
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
              {paper.Manusript}
            </span>
            <span className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-full">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              {paper.Year}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          {/* Author */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Author</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7 leading-relaxed">{paper.authors}</p>
          </div>

          {/* Degree Sought */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Degree Sought</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7 leading-relaxed">{paper.degreeSought}</p>
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
            <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7 leading-relaxed">{paper.Year}</p>
          </div>

          {/* Manuscript Type */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Manuscript Type</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7 leading-relaxed">{paper.Manusript}</p>
          </div>

          {/* Abstract - if available in data structure */}
          {paper.abstract && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Abstract</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 ml-4 sm:ml-7 leading-relaxed">{paper.abstract}</p>
            </div>
          )}

          {/* Keywords - if available in data structure */}
          {paper.keywords && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Keywords</h2>
              </div>
              <div className="ml-4 sm:ml-7 flex flex-wrap gap-1.5 sm:gap-2">
                {paper.keywords.split(',').map((keyword, index) => (
                  <span 
                    key={index}
                    className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 text-xs sm:text-sm rounded-full"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Download/View Link - if available */}
          {paper.link && (
            <div className="pt-4 border-t border-gray-200">
              <a 
                href={paper.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                View Full Paper
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );

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

        {/* Search and Filter Section - Only show when no paper is selected */}
        {!selectedPaper && (
          <>
            <div className="mb-8">
              <Search
                data={researchPapersData}
                searchKeys={['title', 'authors', 'adviser', 'degreeSought', 'Year', 'Manusript']}
                onSearchResults={setFilteredPapers}
                debounceTime={300}
                showResultCount={true}
                variant="default"
                theme="light"
              />
            </div>

            {/* Type Filter Buttons */}
            <div className="container mx-auto mb-8">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Filter by type:</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {manuscriptTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleTypeFilterClick(type)}
                      className={getTypeFilterButtonStyle(type)}
                    >
                      {type === 'all' ? 'All' : type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search/Filter Stats */}
            {(searchQuery || typeFilter !== 'all') && (
              <div className="mb-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  Found {displayedPapers.length} result{displayedPapers.length !== 1 ? 's' : ''}
                  {searchQuery && ` for "${searchQuery}"`}
                  {typeFilter !== 'all' && ` in ${typeFilter} type`}
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
            {totalPages > 1 && displayedPapers.length > 0 && (
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
            {displayedPapers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm sm:text-lg">
                  {searchQuery || typeFilter !== 'all' 
                    ? `No papers found${searchQuery ? ` for "${searchQuery}"` : ''}${typeFilter !== 'all' ? ` in ${typeFilter} type` : ''}.`
                    : "No research papers found."}
                </p>
                <button
                  onClick={clearSearch}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
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