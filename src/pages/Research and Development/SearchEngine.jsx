import React, { useState, useEffect, useCallback, useRef } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import { Search, X, ChevronDown } from "lucide-react";

function SearchEngine() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("savedLakeSearches");
    if (saved) setSavedSearches(JSON.parse(saved));
  }, []);

  const saveSearch = (query) => {
    const updatedSearches = [query, ...savedSearches.filter(q => q !== query)].slice(0, 10);
    setSavedSearches(updatedSearches);
    localStorage.setItem("savedLakeSearches", JSON.stringify(updatedSearches));
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    
    const enhancedQuery = searchQuery.toLowerCase().includes("philippines") 
                    ? searchQuery 
                    : `${searchQuery} Philippines lakes`;
    
    try {
      const API_KEY = process.env.REACT_APP_SERP_API_KEY || "YOUR_API_KEY_HERE";
      const response = await fetch(
        `https://serpapi.com/search.json?engine=google_scholar&q=${encodeURIComponent(enhancedQuery)}&api_key=${API_KEY}&hl=en&num=20`
      );
      
      if (!response.ok) throw new Error(`Search failed: ${response.statusText}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      let results = data.organic_results || [];
      results = results.filter(result => {
        const fullText = `${result.title} ${result.snippet}`.toLowerCase();
        return ["lake", "philippine"].some(term => fullText.includes(term));
      });
      
      setSearchResults(results);
      saveSearch(enhancedQuery);
    } catch (err) {
      setError(`Failed to fetch results: ${err.message}. Showing sample results.`);
      setSearchResults(getMockResults(enhancedQuery));
    } finally {
      setLoading(false);
    }
  };

  const getMockResults = (query) => [
    {
      title: "Assessment of water quality in Laguna de Bay, Philippines using physicochemical parameters",
      authors: "Santos, M.D., Reyes, J.L.",
      publication_info: { summary: "Philippine Journal of Science, 2023" },
      snippet: "This study evaluates the water quality status of Laguna de Bay, the largest lake in the Philippines, examining key parameters and their impact on aquatic life...",
      link: "#",
      resources: [{ title: "PDF", link: "#" }],
      cited_by: 24,
      year: 2023
    },
    {
      title: "Biodiversity conservation in Taal Lake: Status and threats to endemic species",
      authors: "Villanueva, R.D., Garcia, L.M.",
      publication_info: { summary: "Journal of Philippine Limnology, 2022" },
      snippet: "Taal Lake hosts several endemic species including the critically endangered Sardinella tawilis. This paper examines conservation challenges and proposed solutions...",
      link: "#",
      resources: [{ title: "PDF", link: "#" }],
      cited_by: 42,
      year: 2022
    },
    {
      title: "Climate change impacts on Philippine lake ecosystems: A comprehensive review",
      authors: "Fernandez, A.B., Santos, R.K.",
      publication_info: { summary: "Environmental Science & Policy, 2023" },
      snippet: "This review synthesizes current knowledge on how climate change affects Philippine lakes, including temperature increases, altered precipitation patterns, and biodiversity shifts...",
      link: "#",
      resources: [{ title: "PDF", link: "#" }],
      cited_by: 18,
      year: 2023
    }
  ];

  const handleNewSearch = () => {
    setSearchPerformed(false);
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col font-sans">
      <NavBar />
      
      {/* Main Content */}
      <main className="flex-1 mt-18">
        {/* Hero Section - Full screen when no search */}
        {!searchPerformed && (
          <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
              <div className="text-center space-y-6 mb-12">
                <h1 className="text-4xl sm:text-7xl font-bold">
                  <span className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 bg-clip-text text-transparent">
                    Scientific Research
                  </span>
                </h1>
                <p className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                  Access curated scientific research and academic papers dedicated to the preservation and study of Philippine inland waters.
                </p>
              </div>

              {/* Search Container */}
              <div className="relative transform transition-all duration-500 hover:scale-[1.02]">
                <div className={`bg-white/80 backdrop-blur-xl rounded-3xl border border-blue-100 shadow-2xl overflow-hidden transition-all ${
                  isFocused ? 'ring-4 ring-blue-500/20 border-transparent' : ''
                }`}>
                  <form onSubmit={handleSearch} className="flex items-center">
                    <div className="relative flex-1">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="w-full pl-6 pr-4 py-5 bg-transparent text-gray-800 text-xl focus:outline-none"
                        placeholder="Search research papers..."
                      />
                    </div>

                    <div className="flex items-center gap-1 pr-3">
                      {searchQuery && (
                        <button 
                          type="button" 
                          onClick={() => setSearchQuery('')} 
                          className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
                          aria-label="Clear search"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                      
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="p-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Search"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Search className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Results View - When search performed */}
        {searchPerformed && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-8">
            {/* Search Bar - Above results */}
            <div className="mb-8 mt-25">
              <div className="bg-white rounded-2xl border border-blue-100 shadow-lg overflow-hidden">
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative flex-1">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="w-full pl-6 pr-4 py-4 bg-transparent text-gray-800 text-lg focus:outline-none"
                      placeholder="Refine your search..."
                    />
                  </div>

                  <div className="flex items-center gap-1 pr-3">
                    {searchQuery && (
                      <button 
                        type="button" 
                        onClick={() => setSearchQuery('')} 
                        className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="p-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Search"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Search className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                  {loading ? 'Searching...' : `Found ${searchResults.length} relevant papers`}
                </h2>
              </div>
              
              <button
                onClick={handleNewSearch}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50 transition-all shadow-sm hover:shadow-md text-sm"
              >
                <Search className="w-4 h-4" />
                <span>New Search</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-blue-50/90 backdrop-blur-sm border-l-4 border-blue-500 text-blue-800 rounded-xl flex items-center gap-3 shadow-md">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Results Grid */}
            <div ref={resultsRef} className="grid gap-5">
              {searchResults.map((result, index) => (
                <article 
                  key={index} 
                  className="group bg-white p-6 rounded-xl border border-slate-100 shadow-md hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex flex-col gap-2">
                    <a 
                      href={result.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-lg font-bold text-blue-700 group-hover:text-blue-800 leading-tight hover:underline"
                    >
                      {result.title}
                    </a>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                      <span className="flex items-center gap-1 text-gray-600">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {result.authors}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {result.year || '2023'}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mt-1 line-clamp-2 leading-relaxed">
                      {result.snippet}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-3 justify-between items-center">
                      <div className="flex gap-2">
                        {result.resources?.map((res, i) => (
                          <a 
                            key={i} 
                            href={res.link} 
                            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            {res.title}
                          </a>
                        ))}
                      </div>
                      {result.cited_by && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Cited by {result.cited_by}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer - Always visible */}
      <Footer />
    </div>
  );
}

export default SearchEngine;