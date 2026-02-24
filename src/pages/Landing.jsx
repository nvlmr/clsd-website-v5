import { Link } from "react-router-dom";
import NavBar from "../navigation/NavBar";
import Footer from "../navigation/Footer";
import bgImage from "../assets/images/background.jpg";

function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div
        className="relative flex flex-col items-center justify-center flex-1 text-center px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-1 sm:mb-6">
            Lakes R&D Center
          </h1>
          <h4 className="text-xl sm:text-1xl md:text-2xl lg:text-3xl font-normal text-gray-200 mb-6 sm:mb-8">
            Center for Lakes Sustainable Development
          </h4>
          <Link
            to="/home"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1"
          >
            Learn More
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Landing;