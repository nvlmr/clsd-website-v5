import React from "react";
import NavBar from "../navigation/NavBar";
import Footer from "../navigation/Footer";
import bgImage from "../assets/images/background.jpg";

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavBar />

      <main className="flex-grow flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 flex-grow overflow-hidden">
          
          <div className="flex items-center justify-center bg-white px-8 py-16 lg:px-16 xl:px-24">
            <div className="max-w-xl">
              <span className="inline-block text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">
                Center for Lakes Sustainable Development
              </span>

              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6">
                Lakes <span className="text-blue-600">R&D</span> <br /> Center
              </h1>

              <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-10">
                Advancing research and innovation for sustainable lake management 
                and conservation through cutting-edge science and collaborative partnerships.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-normal rounded-xl transition duration-300 shadow-lg shadow-blue-200">
                  Explore Research
                </button>

                <button className="px-8 py-4 border-2 border-slate-200 text-slate-700 font-normal rounded-xl hover:border-blue-600 hover:text-blue-600 transition duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          <div className="relative min-h-[400px] lg:min-h-full">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${bgImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}

export default Home;