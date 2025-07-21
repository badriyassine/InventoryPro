import React, { useState, useEffect } from "react";
import { BiHome, BiPhone, BiInfoCircle, BiMap, BiBell } from "react-icons/bi";
import { logout } from "../../api"; // Optional: Can remove if unused

const Header = ({ setActiveComponent, activeComponent }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [activeComponent]);

  return (
    <>
      <div className="flex justify-between items-center m-2 px-6 py-4 bg-white bg-opacity-30 backdrop-blur-md shadow-md rounded-md">
        {/* Logo */}
        <div>
          <img
            className="h-16"
            src="/src/assets/InventoryProLogo.png"
            alt="Logo"
          />
        </div>

        {/* Navigation */}
        <nav className="flex gap-8 text-gray-700 text-sm font-semibold">
          <button
            onClick={() => setActiveComponent("home")}
            className={`flex items-center gap-1 transition-colors duration-200 ${
              activeComponent === "home"
                ? "text-orange-500 font-bold"
                : "hover:text-orange-500"
            }`}
          >
            <BiHome className="w-5 h-5" />
            Home
          </button>

          <button
            onClick={() => setActiveComponent("contact")}
            className={`flex items-center gap-1 transition-colors duration-200 ${
              activeComponent === "contact"
                ? "text-orange-500 font-bold"
                : "hover:text-orange-500"
            }`}
          >
            <BiPhone className="w-5 h-5" />
            Contact
          </button>

          <button
            onClick={() => setActiveComponent("about")}
            className={`flex items-center gap-1 transition-colors duration-200 ${
              activeComponent === "about"
                ? "text-orange-500 font-bold"
                : "hover:text-orange-500"
            }`}
          >
            <BiInfoCircle className="w-5 h-5" />
            About Us
          </button>

          <button
            onClick={() => setActiveComponent("location")}
            className={`flex items-center gap-1 transition-colors duration-200 ${
              activeComponent === "location"
                ? "text-orange-500 font-bold"
                : "hover:text-orange-500"
            }`}
          >
            <BiMap className="w-5 h-5" />
            Our Location
          </button>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="font-semibold text-orange-600">
                Hi, {user.username}
              </span>
              {/* Notification icon on far right */}
              <button className="text-gray-700 hover:text-orange-500 transition-colors duration-200">
                <BiBell className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveComponent("login")}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
              >
                Login
              </button>
              <button
                onClick={() => setActiveComponent("signup")}
                className="px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition"
              >
                Signup
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;

