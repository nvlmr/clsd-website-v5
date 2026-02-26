import React from "react";
import NavBar from "../navigation/NavBar.jsx";
import Footer from "../navigation/Footer.jsx";
import bgImage from "../assets/images/background.jpg";
import { ArrowRight } from 'lucide-react';

function Home() {
  // Extract YouTube video ID from URL
  const videoId = 'vErBTHQQM1Y';

  // Function to handle smooth scroll to second section
  const scrollToSecondSection = () => {
    const secondSection = document.getElementById('niche-section');
    if (secondSection) {
      secondSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      {/* Hero Section with Background Image */}
      <main className="flex-grow flex items-center justify-center relative bg-cover bg-center bg-no-repeat min-h-screen"
        style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-brightness-75"></div>
        <div className="relative z-10 max-w-4xl px-6 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-normal mb-4 drop-shadow-lg">
            Lakes <span className="">R&D</span> Center 
          </h1>
          
          <p className="text-xl md:text-2xl font-normal text-blue-300 mb-4 tracking-wide">
            Center for Lakes Sustainable Development
          </p>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-100 leading-relaxed mb-10 opacity-90">
            Advancing research and innovation for sustainable lake management 
            and conservation through cutting-edge science and collaborative partnerships.
          </p>
          <div className="group flex flex-row justify-center gap-2 sm:gap-4 w-full max-w-md mx-auto">
            <button className="group/btn-primary flex-1 flex items-center justify-center gap-2 px-4 sm:px-10 py-3 rounded-md font-semibold transition-all duration-300 shadow-xl border-2 
              bg-blue-600 text-white border-blue-600
              group-hover:bg-transparent group-hover:text-white group-hover:border-white
              hover:!bg-blue-600 hover:!text-white hover:!border-blue-600 text-sm sm:text-base whitespace-nowrap">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 transition-all duration-300 group-hover:opacity-0 group-hover:invisible group-hover:w-0 group-hover/btn-primary:opacity-100 group-hover/btn-primary:visible group-hover/btn-primary:w-5" />
            </button>
            <button 
              onClick={scrollToSecondSection}
              className="group/btn-secondary flex-1 px-4 sm:px-10 py-3 rounded-md font-semibold transition-all duration-300 shadow-xl border-2 border-white
              bg-transparent text-white
              hover:bg-blue-600 hover:border-blue-600 hover:text-white text-sm sm:text-base whitespace-nowrap">
              <span className="flex items-center justify-center gap-2">
                Learn More
                <ArrowRight className="w-0 h-5 opacity-0 invisible transition-all duration-300 group-hover/btn-secondary:opacity-100 group-hover/btn-secondary:visible group-hover/btn-secondary:w-5" />
              </span>
            </button> 
          </div>
        </div>
      </main>

      {/* Second Section - Niche Center Content */}
      <div id="niche-section" className="relative min-h-[60vh] bg-white lg:scroll-mt-30 sm:scroll-mt-30">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          {/* Header section */}
          <div className="mb-5 sm:mb-6">
            <h4 className="text-gray-500 text-sm sm:text-base font-medium tracking-wider uppercase mb-3 animate-fade-in">
              NICHE Center for the Regions
            </h4>
            <div className="h-0.5 w-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mb-6 transform transition-all duration-700 hover:w-24" />
          </div>

          {/* Main content - flex column on mobile, row on desktop */}
          <div className="flex flex-col lg:flex-row lg:gap-12 xl:gap-16">
            {/* Left side - Text content */}
            <div className="flex-1 space-y-6 lg:pr-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
                Center for Lakes 
                <span className="block font-medium text-blue-500 mt-2 italic">
                  Sustainable Development
                </span>
              </h1>
              
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl transition-all duration-500 hover:text-gray-900">
                "Accelerated R&D Program for Capacity Building of Research and Development Institutions 
                and Industrial Competitiveness Niche Centers in the Regions for R&D (NICER) of Science 
                for Change Programs"
              </p>  
            </div>
            {/* Right side - YouTube video */}
            <div className="flex-1 mt-10 lg:mt-[-40px]"> {/* Only moves up on lg screens and above */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                {/* YouTube iframe for playable video */}
                <div className="relative pt-[56.25%]">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

              {/* Minimalist caption */}
              <div className="mt-3">
                <span className="text-xs text-gray-400 tracking-wide">
                  Center for Lakes Sustainable Development - NICER Program
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-teal-400 to-blue-600"></div>
      </div>
      <div className="relative bg-gradient-to-b from-gray-50 to-white py-16 sm:py-20 lg:py-24">
        {/* Decorative top gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-teal-400 to-blue-600"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-4">
              About <span className="font-medium text-blue-500">CLSD</span>
            </h2>
            <div className="h-0.5 w-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto"></div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 - Research */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
              <div className="p-6 sm:p-8">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  Research & Development
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Pioneering innovative research in lake ecosystems, water quality monitoring, and sustainable management practices to protect our freshwater resources.
                </p>
              </div>
              <div className="h-1 bg-gradient-to-r from-blue-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>

            {/* Card 2 - Sustainable Solutions */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
              <div className="p-6 sm:p-8">
                <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  Advancing Sustainable Solutions
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Developing cutting-edge technologies and strategies for sustainable lake management, conservation, and ecosystem restoration.
                </p>
              </div>
              <div className="h-1 bg-gradient-to-r from-teal-400 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>

            {/* Card 3 - Education */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 md:col-span-2 lg:col-span-1">
              <div className="p-6 sm:p-8">
                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  Education
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Empowering the next generation of environmental scientists through comprehensive training programs, workshops, and educational resources.
                </p>
              </div>
              <div className="h-1 bg-gradient-to-r from-green-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-teal-400 to-blue-600"></div>
      <Footer />
    </div>
  );
}

export default Home;