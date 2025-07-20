import React, { useState, useEffect } from "react";
import { BiHome, BiPhone, BiInfoCircle, BiMap } from "react-icons/bi";
import { logout } from "../../api"; // import logout API function

const Header = ({ setActiveComponent, activeComponent }) => {
  const [user, setUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  useEffect(() => {
    // update user if login/signup happens in same session
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [activeComponent]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setLoadingLogout(true);
    try {
      const response = await logout();
      if (response.success) {
        localStorage.removeItem("user");
        setUser(null);
        setShowLogoutConfirm(false);
        setActiveComponent("home");
        window.location.reload(); // optional: refresh page to reset app state
      } else {
        alert(response.message || "Logout failed.");
      }
    } catch (error) {
      alert("Logout failed. Please try again.");
      console.error("Logout error:", error);
    } finally {
      setLoadingLogout(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <div className="flex justify-between items-center m-2 px-6 py-4 bg-white bg-opacity-30 backdrop-blur-md shadow-md rounded-md">
        <div>
          <img
            className="h-16"
            src="/src/assets/InventoryProLogo.png"
            alt="Logo"
          />
        </div>

        <nav className="flex gap-8 text-gray-700 text-sm font-semibold mx-auto">
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

        <div className="flex items-center gap-2">
          {!user ? (
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
          ) : (
            <>
              <span className="mr-2 font-semibold text-orange-600">
                Hi, {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                disabled={loadingLogout}
              >
                {loadingLogout ? "Logging out..." : "Logout"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Confirm Logout
            </h2>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
                disabled={loadingLogout}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                disabled={loadingLogout}
              >
                {loadingLogout ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
