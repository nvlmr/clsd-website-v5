import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Search from "../../components/Search.jsx";
import VideoGalleryData from "../../data/VideoGallery.js";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Tag, 
  Play,
  Clock,
  ArrowLeft,
  Youtube
} from "lucide-react";

function VideoGallery() {
  const [filteredVideos, setFilteredVideos] = useState(VideoGalleryData);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const itemsPerPage = 9;
  const topRef = useRef(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredVideos]);

  useEffect(() => {
    if (topRef.current && !selectedVideo) {
      topRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [currentPage, selectedVideo]);

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

const VideoCard = ({ video }) => (
  <div 
    className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
    onClick={() => handleCardClick(video)}
  >
    <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    
    {/* Video Thumbnail with Play Overlay */}
    <div className="relative h-48 overflow-hidden bg-gray-900">
      <img 
        src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
        alt={video.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/400x225?text=Video+Thumbnail";
        }}
      />
      
      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors duration-300">
        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
          <Play className="w-6 h-6 text-white fill-current" />
        </div>
      </div>
      
      {/* Duration Badge */}
      {video.duration && (
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
      )}
    </div>
    
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex-grow">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {video.title}
        </h3>
        
        {/* Category with icon - same styling as date */}
        <div className="flex items-center gap-1 mb-2">
          <Tag className="w-3 h-3 text-gray-500" />
          <span className="text-sm text-gray-500">
            {video.category}
          </span>
        </div>
        
        {/* Date with icon - same styling as category */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{video.date}</span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mt-3">
          {video.description}
        </p>
      </div>
      
      {/* View Details in bottom right corner */}
      <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
        <span className="inline-flex items-center gap-1 text-blue-600 text-xs font-medium group-hover:text-blue-700 transition-colors duration-300">
          View Details
          <ChevronRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </div>
  </div>
);

  const DetailView = ({ video }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={handleBackClick}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        <span>Back to Video Gallery</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        {/* Video Player Section */}
        <div className="relative bg-black aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.youtubeId}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          ></iframe>
        </div>

        {/* Title section - removed blue background */}
        <div className="px-6 py-6 border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{video.title}</h1>
        </div>

        <div className="p-6 md:p-8">
          {/* Description first */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {video.description}
            </p>
          </div>

          {/* Category and Date with icons */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Tag className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <span className="text-sm text-gray-500">Category</span>
                <p className="text-gray-900 font-medium">{video.category}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <span className="text-sm text-gray-500">Date</span>
                <p className="text-gray-900 font-medium">{video.date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AutoScroll/>
      <NavBar />
      
      <div ref={topRef} />
      
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 mt-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
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
      
      {!selectedVideo && (
        <Search 
          data={VideoGalleryData}
          searchKeys={['title', 'description', 'category']}
          onSearchResults={setFilteredVideos}
          showResultCount={true}
        />
      )}

      <div className="flex-grow container mx-auto px-4 mt-14">
        {selectedVideo ? (
          <DetailView video={selectedVideo} />
        ) : (
          <>
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No videos found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
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
            )}
          </>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default VideoGallery;