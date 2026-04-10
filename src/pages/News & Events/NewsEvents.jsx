// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\pages\News & Events\NewsEvents.jsx
import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Search from "../../components/Search.jsx";
import { searchConfigs } from "../../config/searchConfigs.js";
import { useSearch } from "../../hooks/useSearch.js";
import useNewsEvents from "../../hooks/NewsEvents.js";

import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Tag, 
  FileText, 
  ArrowLeft,
  Filter,
  Download,
  X as XIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Maximize2,
  Image as ImageIcon,
  Award,
  AlertCircle,
  RefreshCw,
  Newspaper,
  CalendarDays,
  ImageOff
} from "lucide-react";

// Enhanced Minimalist Horizontal Water Filling Loading Component with 5-second simulation
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
    <div className="min-h-[50vh] flex items-center justify-center py-54">
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
            {waterLevel >= 100 ? 'Loading complete!' : 'Loading news and events...'}
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

// Image Placeholder Component
const ImagePlaceholder = ({ type = 'default', className = "" }) => {
  const getIcon = () => {
    switch(type) {
      case 'news':
        return <Newspaper className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400" />;
      case 'event':
        return <CalendarDays className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400" />;
      default:
        return <ImageIcon className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400" />;
    }
  };

  return (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 ${className}`}>
      {getIcon()}
    </div>
  );
};

// Gallery Image Placeholder
const GalleryImagePlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
    <ImageOff className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
  </div>
);

function NewsEvents() {
  const { 
    data: NewsEventsData, 
    loading, 
    error, 
    refresh 
  } = useNewsEvents();

  const {
    filteredData,
    searchTerm,
    isSearching,
    searchResults,
    handleSearchResults,
    handleSearchStart,
    handleSearchClear,
    resetSearch
  } = useSearch(NewsEventsData, searchConfigs.newsEvents);

  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const topRef = useRef(null);

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

  const filteredAndSearchedEvents = React.useMemo(() => {
    let result = [...filteredData];
    if (activeFilter !== 'all') {
      result = result.filter(event => 
        event.type?.toLowerCase() === activeFilter.toLowerCase()
      );
    }
    return result;
  }, [filteredData, activeFilter]);

  const totalPages = Math.ceil(filteredAndSearchedEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = filteredAndSearchedEvents.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, filteredData]);

  useEffect(() => {
    if (topRef.current && !selectedEvent) {
      topRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [currentPage, selectedEvent]);

  const handleFilterClick = (type) => {
    setActiveFilter(type);
  };

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

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    setSelectedEvent(null);
  };

  const openGalleryModal = (images, index) => {
    setSelectedImage(images);
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGalleryModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateGallery = (direction) => {
    if (!selectedImage) return;
    
    if (direction === 'next' && currentImageIndex < selectedImage.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (direction === 'prev' && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      
      if (e.key === 'Escape') {
        closeGalleryModal();
      } else if (e.key === 'ArrowRight') {
        navigateGallery('next');
      } else if (e.key === 'ArrowLeft') {
        navigateGallery('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, currentImageIndex, selectedImage]);

  const formatEventDate = (startDate, endDate) => {
    if (!startDate) return 'Date TBA';
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    if (startDate === endDate || !endDate) {
      return start.toLocaleDateString('en-US', options);
    } else {
      return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const downloadAttachment = async (url, filename) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(url, '_blank');
    }
  };

  const getFilterButtonStyle = (type) => {
    const isActive = activeFilter === type;
    const baseClasses = "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 min-w-[100px] text-center";
    
    return `${baseClasses} ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-300 ring-offset-2'
        : 'bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
    }`;
  };
  
  const EventCard = ({ event }) => {
    const [imgError, setImgError] = useState(false);
    
    return (
      <div 
        className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
        onClick={() => handleCardClick(event)}
      >
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-bottom"></div>
        
        <div className="relative pt-[60%] sm:pt-[56.25%] bg-gray-200 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {event.featured_image && !imgError ? (
              <img 
                src={event.featured_image} 
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImgError(true)}
              />
            ) : (
              <ImagePlaceholder type={event.type} />
            )}
          </div>
          
          {event.featured && (
            <div className="absolute top-2 right-2">
              <div className="bg-blue-500 rounded-full p-1.5 shadow-lg">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            </div>
          )}
        </div>
        
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <div className="min-h-[3rem] sm:min-h-[3.5rem] mb-2 border-b border-gray-200 pb-2">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
              {event.title}
            </h3>
          </div>
          
          <div className="space-y-1.5 sm:space-y-2 mt-1">
            <div className="flex sm:hidden flex-col space-y-1.5">
              <p className="text-gray-600 flex items-start gap-1.5">
                <Calendar className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs line-clamp-1">
                  {formatEventDate(event.event_start_date, event.event_end_date)}
                </span>
              </p>
              
              <p className="text-gray-600 flex items-start gap-1.5">
                <MapPin className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs line-clamp-1">{event.event_location || 'TBA'}</span>
              </p>
            </div>

            <div className="hidden sm:block space-y-2">
              <p className="text-gray-600 flex items-start gap-2">
                <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
                <span className="text-sm line-clamp-1">
                  {formatEventDate(event.event_start_date, event.event_end_date)}
                </span>
              </p>
              
              <p className="text-gray-600 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
                <span className="text-sm line-clamp-1">{event.event_location || 'TBA'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

const DetailView = ({ event }) => {
    const [heroImgError, setHeroImgError] = useState(false);
    
    // Helper function to format content with proper paragraphs
    const formatContent = (content) => {
      if (!content) return 'No description available.';
      
      // Split by \r\n\r\n or \n\n (double line breaks)
      const paragraphs = content.split(/\r?\n\r?\n/);
      
      return paragraphs.map((paragraph, index) => {
        // Clean up the paragraph - replace single line breaks with spaces
        let cleanParagraph = paragraph.replace(/\r?\n/g, ' ').trim();
        
        // Skip empty paragraphs
        if (!cleanParagraph) return null;
        
        // Return as paragraph element
        return (
          <p key={index} className="mb-4 leading-relaxed text-gray-700">
            {cleanParagraph}
          </p>
        );
      }).filter(Boolean); // Remove null values
    };

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={handleBackClick}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="text-sm sm:text-base">Back to News & Events</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          {/* Hero Section with Blended Title */}
          <div className="relative h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden">
            {/* Background Image */}
            {event.featured_image && !heroImgError ? (
              <>
                <img 
                  src={event.featured_image} 
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() => setHeroImgError(true)}
                />
                {/* Dark Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                
                {/* Expand button */}
                <button
                  onClick={() => window.open(event.featured_image, '_blank')}
                  className="absolute top-4 right-4 bg-black/60 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/80 transition-all z-10 backdrop-blur-sm"
                >
                  <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 bg-blue-500"></div>
            )}
            
            {/* Featured Badge */}
            {event.featured && (
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-blue-500 rounded-full p-1.5 sm:p-2 shadow-lg flex items-center gap-1 sm:gap-1.5 backdrop-blur-sm">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="text-white text-xs sm:text-sm font-medium pr-1">Featured</span>
                </div>
              </div>
            )}
            
            {/* Title Overlay - Blended with Image */}
            <div className="absolute inset-0 flex items-end">
              <div className="w-full px-4 sm:px-6 md:px-8 pb-8 sm:pb-12 md:pb-16">
                <div className="max-w-3xl">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-white drop-shadow-lg leading-tight">
                    {event.title}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            {/* Excerpt */}
            {event.excerpt && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <p className="text-sm sm:text-base text-gray-700 italic leading-relaxed">{event.excerpt}</p>
              </div>
            )}

            {/* Full Content with proper paragraph formatting */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Description</h2>
              </div>
              <div className="ml-4 sm:ml-7">
                {formatContent(event.content || event.description)}
              </div>
            </div>

            {/* Event Details */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-4">Event Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Type</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900 capitalize break-words">{event.type}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Category</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900 break-words">{event.category || 'General'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Date</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900 break-words">
                      {formatEventDate(event.event_start_date, event.event_end_date)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Location</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900 break-words">{event.event_location || 'TBA'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery */}
            {event.gallery && event.gallery.length > 0 && (
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <h3 className="text-sm sm:text-md font-semibold text-gray-900">Gallery</h3>
                  <span className="text-xs sm:text-sm text-gray-500 ml-2">({event.gallery.length} images)</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                  {event.gallery.map((image, index) => {
                    const [galleryImgError, setGalleryImgError] = React.useState(false);
                    
                    return (
                      <div
                        key={index}
                        className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100 border border-gray-200 hover:border-blue-300 transition-all duration-300"
                        style={{ height: '120px' }}
                        onClick={() => openGalleryModal(event.gallery, index)}
                      >
                        <div className="w-full h-full flex items-center justify-center p-1 sm:p-2">
                          {!galleryImgError ? (
                            <img
                              src={image}
                              alt={`Gallery ${index + 1}`}
                              className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300"
                              onError={() => setGalleryImgError(true)}
                            />
                          ) : (
                            <GalleryImagePlaceholder />
                          )}
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 flex items-center gap-1 sm:gap-2">
                            <span className="bg-black/60 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full backdrop-blur-sm">
                              {index + 1}/{event.gallery.length}
                            </span>
                            <div className="bg-blue-600 text-white p-1 sm:p-1.5 rounded-full">
                              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Attachments */}
            {event.attachments && event.attachments.length > 0 && (
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <h3 className="text-sm sm:text-md font-semibold text-gray-900">Attachments</h3>
                  <span className="text-xs sm:text-sm text-gray-500 ml-2">({event.attachments.length} files)</span>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {event.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base text-gray-900 font-medium break-words">{attachment.name}</p>
                          {attachment.size && (
                            <p className="text-xs sm:text-sm text-gray-500">{formatFileSize(attachment.size)}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
                        <button
                          onClick={() => downloadAttachment(attachment.url, attachment.name)}
                          className="p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const GalleryModal = () => {
    const [modalImgError, setModalImgError] = useState(false);
    
    if (!isModalOpen || !selectedImage) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm"
          onClick={closeGalleryModal}
        />
        
        <div className="relative z-10 w-full h-full flex items-center justify-center p-2 sm:p-4">
          <button
            onClick={closeGalleryModal}
            className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-1.5 sm:p-2 transition-all z-20"
          >
            <XIcon className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 text-white bg-black bg-opacity-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
            {currentImageIndex + 1} / {selectedImage.length}
          </div>

          {selectedImage.length > 1 && (
            <>
              <button
                onClick={() => navigateGallery('prev')}
                disabled={currentImageIndex === 0}
                className={`absolute left-2 sm:left-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 sm:p-3 transition-all z-20 ${
                  currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ChevronLeftIcon className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => navigateGallery('next')}
                disabled={currentImageIndex === selectedImage.length - 1}
                className={`absolute right-2 sm:right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 sm:p-3 transition-all z-20 ${
                  currentImageIndex === selectedImage.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ChevronRightIcon className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          <div className="flex items-center justify-center w-full h-full">
            {!modalImgError ? (
              <img
                src={selectedImage[currentImageIndex]}
                alt={`Gallery ${currentImageIndex + 1}`}
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg"
                onError={() => setModalImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4">
                <ImageOff className="w-16 h-16 sm:w-24 sm:h-24 text-gray-500" />
                <p className="text-white text-sm sm:text-base">Image not available</p>
              </div>
            )}
          </div>

          {!modalImgError && (
            <a
              href={selectedImage[currentImageIndex]}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 sm:p-3 transition-all z-20"
              title="Download image"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          )}
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
                News & Events
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl">
              Stay updated with the latest news, training workshops, R&D participation, opportunities, and newly approved projects.
            </p>
          </div>
        </div>
      </section>

      {loading ? (
        <WaterFillingLoading />
      ) : error ? (
        <div className="container mx-auto px-4 mt-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700 font-medium">Error loading news and events</p>
            </div>
            <p className="text-red-600 text-sm mb-3">{error}</p>
            <button
              onClick={() => refresh()}
              className="inline-flex items-center gap-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      ) : !selectedEvent ? (
        <>
          <Search 
            className="mt-15"
            data={NewsEventsData}
            {...searchConfigs.newsEvents}
            onSearchResults={handleSearchResults}
            onSearchStart={handleSearchStart}
            onSearchClear={handleSearchClear}
          />
          
          <div className="container mx-auto px-4 mt-8">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Filter by type:</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {['all', 'news', 'event'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterClick(type)}
                    className={getFilterButtonStyle(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-grow container mx-auto px-4 mt-8">
            {filteredAndSearchedEvents.length > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 auto-rows-fr">
                  {currentEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
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
            ) : (
              <div className="text-center py-26">
                <p className="text-gray-500 text-sm sm:text-lg">
                  No news or events found.
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <DetailView event={selectedEvent} />
          <GalleryModal />
        </>
      )}
      
      <Footer/>
    </div>
  );
};

export default NewsEvents;