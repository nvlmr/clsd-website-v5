import React from "react";
import NavBar from "../navigation/NavBar";
import Footer from "../navigation/Footer";
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
          <div className="group flex flex-col sm:flex-row justify-center gap-4">
            <button className="group/btn-primary flex items-center justify-center gap-2 px-10 py-3 rounded-md font-semibold transition-all duration-300 shadow-xl border-2 
              bg-blue-600 text-white border-blue-600
              group-hover:bg-transparent group-hover:text-white group-hover:border-white
              hover:!bg-blue-600 hover:!text-white hover:!border-blue-600">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 transition-all duration-300 group-hover:opacity-0 group-hover:invisible group-hover:w-0 group-hover/btn-primary:opacity-100 group-hover/btn-primary:visible group-hover/btn-primary:w-5" />
            </button>
            <button 
              onClick={scrollToSecondSection}
              className="group/btn-secondary px-10 py-3 rounded-md font-semibold transition-all duration-300 shadow-xl border-2 border-white
              bg-transparent text-white
              hover:bg-blue-600 hover:border-blue-600 hover:text-white">
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
      <Footer />

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Home;