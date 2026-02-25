import React from "react";
import NavBar from "../../navigation/NavBar";

function IEC_Materials() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
        <NavBar />
            <div className="flex-grow flex items-center justify-center">
            <p className="text-center text-xl font-semibold text-black">
                IEC Materials Page
            </p>
        </div>
    </div>
  );
};

export default IEC_Materials;