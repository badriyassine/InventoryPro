import React from "react";

const Home = ({ setActiveComponent, isLoggedIn }) => {
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-start pt-32 p-8 relative -mt-4">
      <div className="relative z-10 text-center space-y-8">
        {/* Logo/Image */}
        <div className="flex justify-center transform transition-transform duration-300 hover:scale-105">
          <img
            src="/src/assets/InventoryPro.png"
            alt="Product Management Logo"
            className="max-w-xs md:max-w-md h-auto drop-shadow-lg"
          />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Product Management
          </h1>
          <p className="text-lg text-gray-600">
            Streamline your inventory with ease
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isLoggedIn ? (
            <>
              {/* Add New Product */}
              <button
                onClick={() => setActiveComponent("products")}
                className="group relative bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold text-lg min-w-[200px] overflow-hidden"
              >
                <span className="relative z-10">Add New Product</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* More About Us */}
              <button
                onClick={() => setActiveComponent("about")}
                className="group relative bg-white text-orange-500 px-8 py-3 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold text-lg min-w-[200px] overflow-hidden"
              >
                <span className="relative z-10">More About Us</span>
                <div className="absolute inset-0 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <button
                onClick={() => setActiveComponent("login")}
                className="group relative bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold text-lg min-w-[200px] overflow-hidden"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Signup */}
              <button
                onClick={() => setActiveComponent("signup")}
                className="group relative bg-white text-orange-500 px-8 py-3 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold text-lg min-w-[200px] overflow-hidden"
              >
                <span className="relative z-10">Signup</span>
                <div className="absolute inset-0 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
