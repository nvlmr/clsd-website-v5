import React from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../AutoScroll.jsx";
import ClsdMain from "../../assets/images/clsd main.jpg";
import Lake from "../../assets/images/background.jpg";
import { 
  Building2,
  Globe2,
  GraduationCap,
  Scale,
  Users,
  Map,
  FlaskConical,
  ChevronRight
} from 'lucide-react';

function AboutResearchUnits() {
  // SVG pattern as a constant to avoid JSX parsing issues
  const patternSvg = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  // Partner data with icons
  const partners = [
    { 
      name: "Calabarzon Local Government Units (LGUs)",
      icon: Building2,
      type: "Government"
    },
    { 
      name: "Bureau of Fisheries and Aquatic Resources Region 4A (BFAR 4A)",
      icon: Scale,
      type: "Government Agency"
    },
    { 
      name: "University of the Philippines Los Baños - SESAM",
      icon: GraduationCap,
      type: "Academic Institution"
    },
    { 
      name: "University of the Philippines Diliman",
      icon: GraduationCap,
      type: "Academic Institution"
    },
    { 
      name: "Laguna Lake Development Authority (LLDA)",
      icon: Globe2,
      type: "Government Agency"
    },
    { 
      name: "Southeast Asian Limnological Network",
      icon: Users,
      type: "Non-profit Organization"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800">
      <AutoScroll />
      <NavBar />

      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden pt-20">
        {/* Abstract background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 leading-tight font-semibold">
                Center for Lakes Sustainable Development
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-20 space-y-6 sm:space-y-8 lg:space-y-10">
        {/* About Content Grid - Image beside text */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch">
          {/* Text Content - Left side */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl shadow-blue-100/20 border border-gray-100 flex flex-col">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 mt-2 sm:mt-4">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">About the Center</h3>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed flex-grow">
              Center for Lakes Sustainable Development (CLSD) implements the "Lake NICER Project 2" under the DOST NICER Program, 
              focusing on the sustainable management of lakes in Calabarzon (Cavite, Laguna, Batangas, Rizal, Quezon). Launched 
              in October 2021, the project aims to develop science-based strategies to address anthropogenic stresses on lake environments.
            </p>
          </div>
          
          {/* Image - Right side with consistent hover effect */}
          <div className="relative group h-48 sm:h-64 md:h-80 lg:h-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl w-full h-full">
              <img
                src={ClsdMain}
                alt="CLSD Main - Research Facility"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>

        {/* ===== Partners Section - Moderately Compact ===== */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl shadow-blue-100/20 border border-gray-100">
          <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-5 lg:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
              Partner Institutions
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Collaborating with leading organizations to advance lake sustainability research
            </p>
          </div>

          <div className="p-3 sm:p-4 lg:p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-100 mb-4 sm:mb-6 lg:mb-8">
            <p className="text-xs sm:text-sm md:text-base text-gray-700 italic">
              <span className="font-semibold text-blue-700">Led by Assistant Professor Christian Paul de la Cruz</span> of Laguna State Polytechnic University, 
              the project specifically develops predictive tools for estimating the ecological carrying capacity of crater lakes in Quezon Province. 
              This supports evidence-based policymaking for sustainable aquaculture and ecotourism.
            </p>
          </div>
          
          {/* Partner Cards Grid - Moderately Compact */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {partners.map((partner, index) => {
              const IconComponent = partner.icon;
              return (
                <div 
                  key={index}
                  className="group relative bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
                >
                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 rounded-lg sm:rounded-xl transition-opacity duration-300"></div>
                  
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mb-2 sm:mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-4 h-4 sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5 text-blue-700" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight mb-1 sm:mb-2">
                      {partner.name}
                    </h3>
                    <span className="inline-block text-[10px] sm:text-xs text-blue-600 bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                      {partner.type}
                    </span>
                    
                    {/* Hover indicator */}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:w-full transition-all duration-300"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== Research Section - Equal Height with Consistent Hover ===== */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Text */}
          <div className="h-full">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl shadow-blue-100/20 border border-gray-100 h-full flex flex-col">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4 text-gray-800">
                Lakes Sustainable Development Projects
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-5 lg:mb-6 flex-grow">
                As one of the Program for Research and Development Institutions 
                for Niche Centers in the Regions for R&D (NICER) of Science for 
                Change Programs, the Laguna State Polytechnic University Los 
                Baños Campus, College of Fisheries, acted as the project's 
                implementing organization for the Lake NICER Project 2.
              </p>

              {/* CTA */}
              <button className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 
              hover:from-blue-700 hover:to-indigo-700 text-white font-normal px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 
              rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group w-fit 
              text-sm sm:text-base">
                <span>Explore Research Projects</span>
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 ml-1 sm:ml-1.5 lg:ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          {/* Image with consistent hover effect */}
          <div className="relative group h-48 sm:h-64 md:h-80 lg:h-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl h-full">
              <img
                src={Lake}
                alt="Lake Background - Scenic view of research area"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default AboutResearchUnits;