import NavBar from "./navigation/NavBar";
import Footer from "./navigation/Footer";

function Home() {
  return (
    <div>
        <NavBar />
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white shadow-xl rounded-2xl p-10 text-center w-80">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Hello World
                    </h1>
                    <p className="text-gray-500">
                    Welcome to my Home Page
                    </p>
                </div>
            </div>
        <Footer />
    </div>
  );
}

export default Home;