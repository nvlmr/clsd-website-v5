import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import Search from "../../components/Search.jsx";
import NewsEventsData from "../../data/NewsEvents.js";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Tag, 
  FileText, 
  ArrowLeft,
  Filter,
  X
} from "lucide-react";

function NewsEvents() {
  const [filteredEvents, setFilteredEvents] = useState(NewsEventsData);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const itemsPerPage = 9;
  const topRef = useRef(null);

  // Get unique types from data (excluding 'all')
  const eventTypes = [...new Set(NewsEventsData.map(event => event.type))];

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredEvents]);

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
    if (type === 'all') {
      setFilteredEvents(NewsEventsData);
    } else {
      const filtered = NewsEventsData.filter(event => event.type === type);
      setFilteredEvents(filtered);
    }
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setActiveFilter('all');
    setFilteredEvents(NewsEventsData);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

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


  // Filter button styling - white and blue theme
  const getFilterButtonStyle = (type) => {
    const isActive = activeFilter === type;
    return `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-300 ring-offset-2'
        : 'bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
    }`;
  };

  const EventCard = ({ event }) => (
    <div 
      className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => handleCardClick(event)}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {event.image ? (
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/400x200?text=News+Event";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <Calendar className="w-12 h-12 text-blue-400" />
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {event.title}
        </h3>
        
        <div className="space-y-2">
          <p className="text-gray-600 flex items-start gap-2">
            <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
            <span className="text-sm">{event.date}</span>
          </p>
          
          <p className="text-gray-600 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
            <span className="text-sm line-clamp-1">{event.location}</span>
          </p>
        </div>
      </div>
    </div>
  );

  const DetailView = ({ event }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={handleBackClick}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        <span>Back to News & Events</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        {/* Hero Image */}
        {event.image && (
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{event.title}</h1>
        </div>

        <div className="p-6 md:p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Description</h2>
            </div>
            <p className="text-gray-700 ml-7 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Tag className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="text-base font-medium text-gray-900">{event.type}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-base font-medium text-gray-900">{event.date}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 md:col-span-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-base font-medium text-gray-900">{event.location}</p>
                </div>
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
                News & Events
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl">
              Stay updated with the latest news, training workshops, R&D participation, opportunities, and newly approved projects.
            </p>
          </div>
        </div>
      </section>
      
      {!selectedEvent && (
        <>
          <Search 
            data={NewsEventsData}
            searchKeys={['title', 'description', 'location', 'type']}
            onSearchResults={setFilteredEvents}
            showResultCount={true}
          />

          {/* Filter Buttons */}
          <div className="container mx-auto px-4 mt-8">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Filter by type:</span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {eventTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterClick(type)}
                    className={getFilterButtonStyle(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
              
              {/* Modern Clear Filter - Pill with X icon */}
              {activeFilter !== 'all' && (
                <div className="mt-6 animate-fadeIn">
                  <button
                    onClick={clearFilter}
                    className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-full text-sm font-medium text-blue-700 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                  >
                    <span>Clear filter</span>
                    <div className="p-0.5 bg-blue-200 rounded-full group-hover:bg-blue-300 transition-colors duration-300">
                      <X className="w-3.5 h-3.5 text-blue-700" />
                    </div>
                    <span className="ml-1 px-2 py-0.5 bg-white bg-opacity-50 rounded-full text-xs text-blue-600">
                      {activeFilter}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="flex-grow container mx-auto px-4 mt-8">
        {selectedEvent ? (
          <DetailView event={selectedEvent} />
        ) : (
          <>
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No news or events found.</p>
                <button
                  onClick={clearFilter}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200"
                >
                  View all news
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
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
            )}
          </>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default NewsEvents;