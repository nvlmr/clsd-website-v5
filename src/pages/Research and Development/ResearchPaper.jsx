import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Search from "../../components/Search.jsx";
import researchPapersData from "../../data/ResearchPaper.js";
import { ChevronLeft, ChevronRight, User, BookOpen, Calendar, Users, GraduationCap, FileText, ArrowLeft, Award } from "lucide-react";

function ResearchPaper() {
  const [filteredPapers, setFilteredPapers] = useState(researchPapersData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const itemsPerPage = 9; // 3 columns × 3 rows = 9 items per page
  const topRef = useRef(null);

  // Reset to page 1 when search results change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPapers]);

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
    setFilteredPapers(researchPapersData);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const ResearchPaperCard = ({ paper }) => (
    <div 
      className="group relative bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => handleCardClick(paper)}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      
      <div className="flex-grow">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4 line-clamp-3 group-hover:text-blue-600 transition-colors duration-300">
          {paper.title}
        </h3>

        <div className="space-y-3">
          {/* Author */}
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
            <p className="text-sm text-gray-700">
              <span className="font-medium">Author:</span> {paper.authors}
            </p>
          </div>

          {/* Degree */}
          <div className="flex items-start gap-2">
            <GraduationCap className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
            <p className="text-sm text-gray-700">
              <span className="font-medium">Degree:</span> {paper.degreeSought}
            </p>
          </div>

          {/* Adviser */}
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
            <p className="text-sm text-gray-700">
              <span className="font-medium">Adviser:</span> {paper.adviser}
            </p>
          </div>

          {/* Year */}
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
            <p className="text-sm text-gray-700">
              <span className="font-medium">Year:</span> {paper.Year}
            </p>
          </div>

          {/* Manuscript Type */}
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
            <p className="text-sm text-gray-700">
              <span className="font-medium">Type:</span> {paper.Manusript}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
        <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors duration-300">
          View Details
          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </div>
  );

  const DetailView = ({ paper }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={handleBackClick}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        <span>Back to Research Papers</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{paper.title}</h1>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
              <BookOpen className="w-4 h-4" />
              {paper.Manusript}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
              <Calendar className="w-4 h-4" />
              {paper.Year}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Author */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Author</h2>
            </div>
            <p className="text-gray-700 ml-7 leading-relaxed">{paper.authors}</p>
          </div>

          {/* Degree Sought */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Degree Sought</h2>
            </div>
            <p className="text-gray-700 ml-7 leading-relaxed">{paper.degreeSought}</p>
          </div>

          {/* Adviser */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Adviser</h2>
            </div>
            <p className="text-gray-700 ml-7 leading-relaxed">{paper.adviser}</p>
          </div>

          {/* Year */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Year</h2>
            </div>
            <p className="text-gray-700 ml-7 leading-relaxed">{paper.Year}</p>
          </div>

          {/* Manuscript Type */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Manuscript Type</h2>
            </div>
            <p className="text-gray-700 ml-7 leading-relaxed">{paper.Manusript}</p>
          </div>

          {/* Abstract - if available in data structure */}
          {paper.abstract && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Abstract</h2>
              </div>
              <p className="text-gray-700 ml-7 leading-relaxed">{paper.abstract}</p>
            </div>
          )}

          {/* Keywords - if available in data structure */}
          {paper.keywords && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Keywords</h2>
              </div>
              <div className="ml-7 flex flex-wrap gap-2">
                {paper.keywords.split(',').map((keyword, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <FileText className="w-5 h-5" />
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 leading-tight font-semibold">
                Research Paper
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl">
              Scientific research supporting the sustainable development and conservation of lake environments.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4">

        {/* Search Section - Only show when no paper is selected */}
        {!selectedPaper && (
          <div className="mb-12">
            <Search
              data={researchPapersData}
              searchKeys={['title', 'authors', 'adviser', 'degreeSought', 'Year', 'Manusript']}
              onSearchResults={setFilteredPapers}
              debounceTime={300}
              showResultCount={true}
              variant="default"
              size="lg"
              theme="light"
            />
          </div>
        )}

        {selectedPaper ? (
          <DetailView paper={selectedPaper} />
        ) : (
          <>
            {/* Research Paper Tiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
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
                <p className="text-gray-500 text-lg">
                  {searchQuery ? `No papers found for "${searchQuery}"` : "No research papers found."}
                </p>
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