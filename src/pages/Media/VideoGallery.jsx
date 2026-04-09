// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\pages\Media\VideoGallery.jsx

import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Search from "../../components/Search.jsx";
import { useVideoGallery } from "../../hooks/VideoGallery.js";
import { useSearch } from "../../hooks/useSearch.js";
import { searchConfigs } from "../../config/searchConfigs.js";

import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Play,
  ArrowLeft,
  FileText,
  AlertCircle,
  RefreshCw,
  Download,
  Maximize2,
  Image as ImageIcon,
  Tag,
  VideoOff
} from "lucide-react";

// Video Not Available Placeholder Component
const VideoNotAvailablePlaceholder = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-300 to-blue-400">
    <VideoOff className="w-8 h-8 sm:w-12 sm:h-12 text-white mb-1 sm:mb-2" />
  </div>
);

// Minimalist Horizontal Water Filling Loading Component
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
    }, 37);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[50vh] flex items-center justify-center py-50">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Horizontal Water Bar */}
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
        
        {/* Loading Text */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm font-medium">
            {isComplete ? "Loading complete!" : "Loading video gallery..."}
          </p>
          
          {/* Dots remain visible regardless of isComplete status */}
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

function VideoGallery() {
  const { videos, loading, error, refreshVideos } = useVideoGallery();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  
  const topRef = useRef(null);

  // Use the video gallery search configuration from searchConfigs
  const videoSearchConfig = searchConfigs.videoGallery;

  // Use the search hook
  const {
    filteredData: filteredVideos,
    searchTerm,
    isSearching,
    searchResults,
    handleSearchResults,
    handleSearchStart,
    handleSearchClear,
    resetSearch,
    setFilteredData
  } = useSearch(videos, videoSearchConfig);

  // Update filtered videos when videos data loads
  useEffect(() => {
    if (videos.length > 0) {
      setFilteredData(videos);
    }
  }, [videos, setFilteredData]);

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

  useEffect(() => {
    if (topRef.current && !selectedVideo) {
      topRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [currentPage, selectedVideo]);

  // Reset to page 1 when search results change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredVideos]);

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVideos = filteredVideos.slice(startIndex, endIndex);

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

  const handleCardClick = (video) => {
    setSelectedVideo(video);
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    setSelectedVideo(null);
  };

  // Format date from timestamp to readable format
  const formatDate = (timestamp) => {
    if (!timestamp) return "Date not available";
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Extract YouTube ID from video_url
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  };

  // Get thumbnail - prioritize cover_image over YouTube thumbnail
  const getThumbnail = (video) => {
    // Always use cover_image if available
    if (video.cover_image) {
      // Check if cover_image is a full URL or relative path
      if (video.cover_image.startsWith('http')) {
        return video.cover_image;
      }
      // If relative path, prepend uploads base URL
      const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_BASE_URL;
      return `${uploadsBaseUrl}/${video.cover_image.replace(/^\/+/, '')}`;
    }
    
    // Fallback to YouTube thumbnail if no cover_image
    const youtubeId = getYouTubeId(video.video_url);
    if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    
    // Return null to indicate no thumbnail available
    return null;
  };

  // Get document URL with proper handling
  const getDocumentUrl = (document) => {
    if (!document) return null;
    
    // If it's already a full URL, return it
    if (document.startsWith('http://') || document.startsWith('https://')) {
      return document;
    }
    
    // Clean up the path (remove leading/trailing slashes)
    const cleanPath = document.replace(/^\/+|\/+$/g, '');
    
    // Get uploads base URL from environment variable
    const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_BASE_URL;
    
    // If uploadsBaseUrl is not configured, use relative path
    if (!uploadsBaseUrl) {
      return `/${cleanPath}`;
    }
    
    // Combine base URL with document path
    return `${uploadsBaseUrl}/${cleanPath}`;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Download attachment - same as NewsEvents
  const downloadAttachment = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(url, '_blank');
    }
  };

  // Video Card Component
  const VideoCard = ({ video }) => {
    const [thumbnailError, setThumbnailError] = useState(false);
    const thumbnailUrl = getThumbnail(video);
    const hasValidThumbnail = thumbnailUrl && !thumbnailError;

    return (
      <div 
        className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
        onClick={() => handleCardClick(video)}
      >
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-bottom"></div>
        
        <div className="relative pt-[56.25%] bg-gray-900 overflow-hidden">
          <div className="absolute inset-0">
            {hasValidThumbnail ? (
              <img 
                src={thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setThumbnailError(true)}
              />
            ) : (
              <VideoNotAvailablePlaceholder />
            )}
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors duration-300">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-red-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white fill-current" />
            </div>
          </div>
        </div>
        
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <div className="min-h-[3rem] sm:min-h-[3.5rem] mb-2 border-b border-gray-200 pb-2">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
              {video.title}
            </h3>
          </div>
          
          <div className="space-y-1.5 sm:space-y-2 mt-1">
            <div className="flex sm:hidden flex-col space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-blue-500 flex-shrink-0" />
                <span className="text-xs text-gray-600">{video.year}</span>
              </div>
            </div>

            <div className="hidden sm:block space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-500">
                  {video.year}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DetailView = ({ video }) => {
    const youtubeId = getYouTubeId(video.video_url);
    const documentUrl = getDocumentUrl(video.document);
    const thumbnailUrl = getThumbnail(video);
    const [thumbnailError, setThumbnailError] = useState(false);
    const hasValidThumbnail = thumbnailUrl && !thumbnailError;
    
    // Check if there's a document to display as attachment
    const hasAttachment = documentUrl && video.document;
    // Extract the original filename from the download URL or use the video document field
    let attachmentName = 'document';
    if (video.document) {
      // If it's a download URL with parameter, extract the filename from the 'file' parameter
      if (video.document.includes('download=true')) {
        const urlParams = new URLSearchParams(video.document.split('?')[1]);
        const fileParam = urlParams.get('file');
        if (fileParam) {
          attachmentName = fileParam;
        } else {
          attachmentName = video.document.split('/').pop();
        }
      } else {
        attachmentName = video.document.split('/').pop();
      }
    }
    
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={handleBackClick}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="text-sm sm:text-base">Back to Video Gallery</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          {/* Video Player Section */}
          <div className="relative bg-black aspect-video">
            {youtubeId ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            ) : video.video_url ? (
              <video
                controls
                className="absolute inset-0 w-full h-full"
                poster={hasValidThumbnail ? thumbnailUrl : undefined}
              >
                <source src={video.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <VideoNotAvailablePlaceholder />
            )}
          </div>

          <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{video.title}</h1>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            {/* Description */}
            {video.description && (
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Description</h2>
                </div>
                <p className="ml-4 sm:ml-7 text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {video.description}
                </p>
              </div>
            )}

            {/* Video Details - Only Year */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-4">Video Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Year</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{video.year}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments - Styled like NewsEvents attachments section */}
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
                        onClick={() => downloadAttachment(documentUrl, attachmentName)}
                        className="p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
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

  // Render content based on state
  const renderContent = () => {
    if (selectedVideo) {
      return <DetailView video={selectedVideo} />;
    }

    if (filteredVideos.length === 0 && !loading) {
      return (
        <div className="text-center py-40">
          <p className="text-gray-500 text-sm sm:text-lg">
            {searchTerm 
              ? `No videos found.`
              : 'No videos found.'}
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 auto-rows-fr">
          {currentVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
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
                Video Gallery
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl">
              Explore our collection of educational and documentary videos about Philippine lakes, conservation efforts, and research findings.
            </p>
          </div>
        </div>
      </section>
      
      {/* Loading State - WaterFillingLoading */}
      {loading && <WaterFillingLoading />}

      {/* Error State - Updated to match other pages */}
      {error && !loading && (
        <div className="container mx-auto px-4 mt-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700 font-medium">Error loading video gallery</p>
            </div>
            <p className="text-red-600 text-sm mb-3">{error}</p>
            <button
              onClick={() => refreshVideos()}
              className="inline-flex items-center gap-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {/* Search Component - Only show when not in detail view, not loading, and data is loaded */}
      {!selectedVideo && !loading && videos.length > 0 && !error && (
        <Search 
          className="mt-15"
          data={videos}
          searchKeys={videoSearchConfig.searchKeys}
          onSearchResults={handleSearchResults}
          onSearchStart={handleSearchStart}
          onSearchClear={handleSearchClear}
          showResultCount={videoSearchConfig.showResultCount}
          placeholder={videoSearchConfig.placeholder}
          variant={videoSearchConfig.variant}
          size={videoSearchConfig.size}
          theme={videoSearchConfig.theme}
          debounceTime={videoSearchConfig.debounceTime}
          minChars={videoSearchConfig.minChars}
          noResultsMessage={videoSearchConfig.noResultsMessage}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-grow container mx-auto px-4 mt-8">
        {!loading && !error && renderContent()}
      </div>
      
      <Footer/>
    </div>
  );
};

export default VideoGallery;