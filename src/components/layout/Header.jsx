import React, { useState, useEffect, useRef } from "react";
import { BiHome, BiPhone, BiInfoCircle, BiMap, BiBell } from "react-icons/bi";
import { User as LucideUser } from "lucide-react";

const Header = ({ setActiveComponent, activeComponent }) => {
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const notificationsRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [activeComponent]);

  useEffect(() => {
    if (user?.role === "admin") {
      setNotifications([
        { message: "Product data updated", date: "2025-07-20 09:20" },
        { message: "New user registered", date: "2025-07-20 10:00" },
      ]);
    } else if (user?.role === "user") {
      setNotifications([
        { message: "Stock levels updated", date: "2025-07-20 08:30" },
      ]);
    } else {
      setNotifications([]);
    }
  }, [user]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const clearNotifications = () => setNotifications([]);

  return (
    <div className="relative z-50">
      <div className="flex justify-between items-center m-2 px-6 py-4 bg-white bg-opacity-30 backdrop-blur-md shadow-md rounded-md">
        {/* Left Side: Logo */}
        <div>
          <img
            className="h-16"
            src="/src/assets/InventoryProLogo.png"
            alt="Logo"
          />
        </div>

        {/* Navigation */}
        <nav className="flex gap-8 text-gray-700 text-sm font-semibold">
          {[
            ["home", "Home", BiHome],
            ["contact", "Contact", BiPhone],
            ["about", "About Us", BiInfoCircle],
            ["location", "Our Location", BiMap],
          ].map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setActiveComponent(key)}
              className={`flex items-center gap-1 transition-colors duration-200 ${
                activeComponent === key
                  ? "text-orange-500 font-bold"
                  : "hover:text-orange-500"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>

        {/* Right Side: User Icon & Notification Icon */}
        <div className="flex items-center gap-3 relative">
          {user ? (
            <>
              {/* User Icon */}
              <button
                onClick={() => setActiveComponent("profile")}
                className="text-gray-700 hover:text-orange-500 transition"
                aria-label="User Profile"
              >
                <LucideUser className="w-5 h-5" />
              </button>

              {/* Notification Icon & Dropdown */}
              <div className="relative mt-2" ref={notificationsRef}>
                <button
                  onClick={() => setShowNotifications((prev) => !prev)}
                  className="relative text-gray-700 hover:text-orange-500 transition"
                  aria-label="Notifications"
                >
                  <BiBell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                  )}
                </button>

                {showNotifications && notifications.length > 0 && (
                  <div
                    className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto bg-white backdrop-blur-md border border-orange-300 rounded-lg shadow-lg z-[9999]"
                    style={{ top: "100%" }}
                  >
                    <div className="p-4 font-semibold text-orange-600 border-b border-orange-300">
                      Notifications
                    </div>
                    <ul>
                      {notifications.map(({ message, date }, index) => (
                        <li
                          key={index}
                          className="px-4 py-3 border-b border-orange-200 hover:bg-orange-50 cursor-default"
                        >
                          <p className="text-gray-800">{message}</p>
                          <p className="text-xs text-gray-500 mt-1">{date}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="p-3 flex justify-center">
                      <button
                        onClick={clearNotifications}
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition text-sm font-semibold"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
    </div>
  );
};

export default Header;
