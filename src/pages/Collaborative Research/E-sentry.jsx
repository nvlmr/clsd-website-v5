import React from "react";
import { MapPin, Check, Droplets, Fish, Activity, BarChart3 } from "lucide-react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../../components/AutoScroll.jsx";
import TadlacLake from "../../assets/images/E-sentry/tadlac lake.jpg";

function Esentry() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AutoScroll />
      <NavBar />
      <main className="flex-grow pt-16 sm:pt-20 lg:pt-24">
        {/* Hero Section - Modern gradient design */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
          {/* Abstract background decoration */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-10">
            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 leading-tight font-semibold">
                  E-Sentry
                </span>
              </h1>
            </div>
          </div>
        </section>

        {/* Content Section - Image Left, Text Right */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start">
            {/* Image Container - Left side on desktop, top on mobile */}
            <div className="w-full md:w-1/2 lg:w-5/12">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <img
                    src={TadlacLake}
                    alt="E-Sentry"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition duration-700"
                  />
                  {/* Small detail badge - Tadlac Lake, known for aquaculture research */}
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Tadlac Lake, Philippines</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Container - Right side on desktop, bottom on mobile */}
            <div className="w-full md:w-1/2 lg:w-7/12 flex flex-col justify-center">
              <p className="text-gray-600 text-lg leading-relaxed mb-6 ">
                Develop and improve farming technologies for aquatic species, pilot trials and demonstration projects, 
                facilities for industry and researchers to carry out projects and trials, work with others towards 
                sustainable aquaculture and fisheries, train staff and students and educate the public about aquaculture. 
                Strengthen partnerships between researchers, industry, and communities to accelerate the adoption of sustainable 
                and efficient aquaculture technologies.
              </p>
              
              {/* Additional Details Section */}
              <div className="mt-2 space-y-6">
                {/* Key Features */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Real-time water quality monitoring and alert system</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Automated feeding systems with AI-powered optimization</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Disease detection and prevention through IoT sensors</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Data analytics dashboard for farm management</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Esentry;