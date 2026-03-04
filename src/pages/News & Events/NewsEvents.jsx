import React from "react";
import NavBar from "../../navigation/NavBar.jsx";

function NewsEvents() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
        <NavBar />
            <div className="flex-grow flex items-center justify-center">
            <p className="text-center text-xl font-semibold text-black">
                Event Page
            </p>
        </div>
    </div>
  );
};

export default NewsEvents;