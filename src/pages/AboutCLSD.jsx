function AboutCLSD() {
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white py-16 sm:py-20 lg:py-24 lg:px-10">
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-teal-400 to-blue-600"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1">
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
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 relative">
            {/* Hover line at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            
            <div className="p-6 sm:p-8">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                Research & Development
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                Pioneering innovative research in lake ecosystems, water quality monitoring, and sustainable management practices to protect our freshwater resources.
              </p>
            </div>
          </div>

          {/* Card 2 - Sustainable Solutions */}
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 relative">
            {/* Hover line at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            
            <div className="p-6 sm:p-8">
              <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-teal-500 group-hover:text-teal-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors duration-300">
                Advancing Sustainable Solutions
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                Developing cutting-edge technologies and strategies for sustainable lake management, conservation, and ecosystem restoration.
              </p>
            </div>
          </div>

          {/* Card 3 - Education */}
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 relative">
            {/* Hover line at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            
            <div className="p-6 sm:p-8">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-green-500 group-hover:text-green-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                Education & Outreach
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                Empowering the next generation of environmental scientists through comprehensive training programs, workshops, and educational resources.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative bottom gradient */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-teal-400 to-blue-600"></div>
    </div>
  );
}

export default AboutCLSD;