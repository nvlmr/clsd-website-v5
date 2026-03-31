import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import { useResearchTeam } from "../../hooks/OrganizationalStructure.js";

import { 
  ChevronLeft, 
  ChevronRight, 
  GraduationCap, 
  Award, 
  Building2, 
  User,
  AlertCircle,
  RefreshCw
} from "lucide-react";

function OrganizationalStructure() {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const { experts, loading, error, refresh, isLive } = useResearchTeam();
  const topRef = useRef(null);

  // Scroll to top when returning from detail view
  useEffect(() => {
    if (topRef.current && !selectedPerson) {
      topRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [selectedPerson]);

  const ResearcherCard = ({ person }) => (
    <div 
      className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 w-full max-w-[200px] sm:max-w-[280px] mx-auto overflow-hidden cursor-pointer"
      onClick={() => {
        setSelectedPerson(person);
        window.scrollTo(0, 0);
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-400"></div>
      <div className="p-3 sm:p-5 flex flex-col h-full">
        <div className="flex-grow">
          <div className="relative mb-2 sm:mb-3 flex justify-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-blue-400 transition-colors duration-300 flex items-center justify-center bg-white">
              {person.image && person.image !== User ? (
                <img 
                  src={person.image} 
                  alt={person.name} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => { 
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg class="w-8 h-8 sm:w-12 sm:h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>';
                  }}
                />
              ) : (
                <User className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500" />
              )}
            </div>
          </div>
          <h3 className="text-center text-gray-900 font-bold text-sm sm:text-lg md:text-xl mb-0.5 sm:mb-1">
            {person.name}
          </h3>
          <p className="text-center text-gray-500 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2">
            {person.title}
          </p>
        </div>
        <div className="flex justify-start mt-1 sm:mt-2">
          <span className="inline-flex items-center gap-0.5 sm:gap-1 text-blue-600 text-[10px] sm:text-xs md:text-sm font-medium group-hover:text-blue-700 transition-colors duration-300">
            View Profile
            <ChevronRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </div>
  );

  const DetailView = ({ person }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => setSelectedPerson(null)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300 group"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="text-sm sm:text-base">Back to Research Team</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-6 sm:py-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center bg-white">
              {person.image && person.image !== User ? (
                <img 
                  src={person.image} 
                  alt={person.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => { 
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg class="w-12 h-12 sm:w-16 sm:h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>';
                  }}
                />
              ) : (
                <User className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500" />
              )}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">{person.name}</h1>
              <p className="text-base sm:text-lg md:text-xl text-blue-100 mt-1">{person.title}</p>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-full">
                  <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
                  {person.designation}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Qualifications/Expertise</h2>
            </div>
            <p className="ml-4 sm:ml-7 text-sm sm:text-base text-gray-700 leading-relaxed">
              {person.qualifications || person.expertise || "No qualifications listed."}
            </p>
          </div>

          {person.institution && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Institution</h2>
              </div>
              <p className="ml-4 sm:ml-7 text-sm sm:text-base text-gray-700">{person.institution}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Horizontal Water Filling Loading Component that completes in ~5 seconds
  const WaterFillingLoading = () => {
    const [waterLevel, setWaterLevel] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
      // Simulate loading progress that completes in ~5 seconds
      const interval = setInterval(() => {
        setWaterLevel(prev => {
          if (prev >= 100) {
            setIsComplete(true);
            clearInterval(interval);
            return 100;
          }
          // Slower increment to last about 5 seconds (100 increments * 50ms = 5 seconds)
          return prev + 1;
        });
      }, 35); // 50ms increments = 5 seconds for 100%

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="min-h-[50vh] flex items-center justify-center py-58">
        <div className="w-full max-w-md mx-auto px-4">
          {/* Horizontal Water Bar */}
          <div className="relative">
            {/* Background Bar */}
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              {/* Water Fill */}
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-100 ease-out relative"
                style={{ width: `${waterLevel}%` }}
              >
                {/* Ripple Effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 bottom-0 w-full">
                    <div className="absolute top-0 bottom-0 w-20 bg-white/30 transform -skew-x-12 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Percentage Label */}
            <div className="absolute -top-6 right-0 text-xs text-blue-600 font-medium">
              {Math.min(100, Math.floor(waterLevel))}%
            </div>
          </div>
          
          {/* Loading Text */}
          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm font-medium">
              {waterLevel >= 100 ? 'Loading complete!' : 'Loading organizational structure...'}
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

  // Helper function for grid classes
  const getGridClasses = (count) => {
    const baseClasses = 'grid gap-3 sm:gap-4';
    if (count === 1) return `${baseClasses} grid-cols-1 flex justify-center`;
    if (count === 2) return `${baseClasses} grid-cols-2 max-w-2xl mx-auto`;
    if (count === 3) return `${baseClasses} grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto`;
    return `${baseClasses} grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
  };

  // Filter experts by designation based on database values
  const directors = experts?.filter(person => person.designation === "Director") || [];
  const unitHeads = experts?.filter(person => person.designation === "Unit Head") || [];
  const researchers = experts?.filter(person => person.designation === "Researcher") || [];
  const researchAssistants = experts?.filter(person => person.designation === "Research Assistant") || [];
  const affiliateScientist = experts?.filter(person => person.designation === "Affiliate Scientist") || [];

  const renderContent = () => {
    if (selectedPerson) {
      return <DetailView person={selectedPerson} />;
    }

    if (loading) {
      return <WaterFillingLoading />;
    }

    if (error) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700 font-medium">Error loading team members</p>
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
      );
    }

    if (experts?.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm sm:text-lg">
            No team members found.
          </p>
        </div>
      );
    }

    return (
      <section className="py-8 sm:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Director Section */}
          {directors.length > 0 && (
            <div className="mb-8 sm:mb-10 last:mb-0">
              <div className="flex items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Director</h2>
                <div className="ml-3 flex-grow h-0.5 bg-gradient-to-r from-blue-200 to-transparent"></div>
                <span className="ml-3 text-xs sm:text-sm text-gray-500">{directors.length}</span>
              </div>
              <div className={getGridClasses(directors.length)}>
                {directors.map((person) => (
                  <div key={person.id} className="flex justify-center">
                    <ResearcherCard person={person} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unit Head Section */}
          {unitHeads.length > 0 && (
            <div className="mb-8 sm:mb-10 last:mb-0">
              <div className="flex items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Unit Head</h2>
                <div className="ml-3 flex-grow h-0.5 bg-gradient-to-r from-blue-200 to-transparent"></div>
                <span className="ml-3 text-xs sm:text-sm text-gray-500">{unitHeads.length}</span>
              </div>
              <div className={getGridClasses(unitHeads.length)}>
                {unitHeads.map((person) => (
                  <div key={person.id} className="flex justify-center">
                    <ResearcherCard person={person} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Researcher Section */}
          {researchers.length > 0 && (
            <div className="mb-8 sm:mb-10 last:mb-0">
              <div className="flex items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Researcher</h2>
                <div className="ml-3 flex-grow h-0.5 bg-gradient-to-r from-blue-200 to-transparent"></div>
                <span className="ml-3 text-xs sm:text-sm text-gray-500">{researchers.length}</span>
              </div>
              <div className={getGridClasses(researchers.length)}>
                {researchers.map((person) => (
                  <div key={person.id} className="flex justify-center">
                    <ResearcherCard person={person} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Research Assistant Section */}
          {researchAssistants.length > 0 && (
            <div className="mb-8 sm:mb-10 last:mb-0">
              <div className="flex items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Research Assistant</h2>
                <div className="ml-3 flex-grow h-0.5 bg-gradient-to-r from-blue-200 to-transparent"></div>
                <span className="ml-3 text-xs sm:text-sm text-gray-500">{researchAssistants.length}</span>
              </div>
              <div className={getGridClasses(researchAssistants.length)}>
                {researchAssistants.map((person) => (
                  <div key={person.id} className="flex justify-center">
                    <ResearcherCard person={person} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Affiliate Scientist Section */}
          {affiliateScientist.length > 0 && (
            <div className="mb-8 sm:mb-10 last:mb-0">
              <div className="flex items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Affiliate Scientist</h2>
                <div className="ml-3 flex-grow h-0.5 bg-gradient-to-r from-blue-200 to-transparent"></div>
                <span className="ml-3 text-xs sm:text-sm text-gray-500">{affiliateScientist.length}</span>
              </div>
              <div className={getGridClasses(affiliateScientist.length)}>
                {affiliateScientist.map((person) => (
                  <div key={person.id} className="flex justify-center">
                    <ResearcherCard person={person} />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AutoScroll />
      <NavBar />
      
      <div ref={topRef} />
      
      {/* Hero Section - Always visible */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 mt-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 leading-tight font-semibold">
                Organizational Structure
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl">
              {isLive ? "Displaying latest team updates." : "Meet our dedicated team of researchers and experts."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="flex-grow">
        {renderContent()}
      </div>
      
      <Footer />
    </div>
  );
}

export default OrganizationalStructure;