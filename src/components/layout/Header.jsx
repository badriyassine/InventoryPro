import React, { useState, useEffect, useRef } from "react";
import { BiHome, BiPhone, BiInfoCircle, BiMap, BiBell } from "react-icons/bi";
import { User as LucideUser } from "lucide-react";
import {
  apiFetch,
  markNotificationsAsSeen as markNotificationsAsSeenAPI,
} from "../../api/api";
import { useAuth } from "../../context/AuthContext"; // import your auth hook

const Header = ({ setActiveComponent, activeComponent }) => {
  const { user } = useAuth();  // <-- get user reactively from context

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [error, setError] = useState(null);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  const notificationsRef = useRef(null);

  // Fetch notifications every 10 seconds if user logged in
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      setError(null);
      try {
        const data = await apiFetch("notifications/get.php", "POST");
        setNotifications(data);

        // Check if there are unseen notifications from server
        const unseenExists = data.some((n) => !n.isSeen);
        setHasNewNotifications(unseenExists);
      } catch (err) {
        setError("Failed to load notifications.");
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // Mark notifications as seen when dropdown opens and there are new notifications
  useEffect(() => {
    if (showNotifications && hasNewNotifications) {
      const markAsSeen = async () => {
        try {
          const response = await markNotificationsAsSeenAPI();
          if (response.success) {
            setNotifications((prev) =>
              prev.map((n) => ({ ...n, isSeen: true }))
            );
            setHasNewNotifications(false);
          }
        } catch (err) {
          console.error("Failed to mark notifications as seen:", err);
        }
      };
      markAsSeen();
    }
  }, [showNotifications, hasNewNotifications]);

  // Close notifications dropdown on outside click
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

  const clearNotifications = async () => {
    try {
      const response = await apiFetch("notifications/delete.php", "POST");
      if (response.success) {
        setNotifications([]);
        setHasNewNotifications(false);
      } else {
        console.error(response.message);
      }
    } catch (err) {
      console.error("Failed to delete notifications", err);
    }
  };

  const handleNotificationClick = (targetComponent) => {
    if (targetComponent) {
      setActiveComponent(targetComponent);
      setShowNotifications(false);
    }
  };

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

        {/* Right Side: Notification Icon & User Icon */}
        <div className="flex items-center gap-4 relative">
          {user ? (
            <>
              {/* Notification Icon & Dropdown */}
              <div className="relative mt-2" ref={notificationsRef}>
                <button
                  onClick={() => setShowNotifications((prev) => !prev)}
                  className="relative text-gray-700 hover:text-orange-500 transition"
                  aria-label="Notifications"
                >
                  <BiBell className="w-5 h-5" />
                  {/* Show dot only if hasNewNotifications is true */}
                  {hasNewNotifications && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                  )}
                </button>

                {showNotifications && (
                  <div
                    className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto bg-white backdrop-blur-md border border-orange-300 rounded-lg shadow-lg z-[9999]"
                    style={{ top: "100%" }}
                  >
                    <div className="p-4 font-semibold text-orange-600 border-b border-orange-300">
                      Notifications
                    </div>
                    {loadingNotifications ? (
                      <p className="p-4 text-center text-gray-600">Loading...</p>
                    ) : error ? (
                      <p className="p-4 text-center text-red-600">{error}</p>
                    ) : notifications.length === 0 ? (
                      <p className="p-4 text-center text-gray-600">No notifications</p>
                    ) : (
                      <ul>
                        {notifications.map(
                          ({ id, message, date, targetComponent }) => (
                            <li
                              key={id}
                              className="px-4 py-3 border-b border-orange-200 hover:bg-orange-50 cursor-pointer"
                              onClick={() => handleNotificationClick(targetComponent)}
                            >
                              <p className="text-gray-800">{message}</p>
                              <p className="text-xs text-gray-500 mt-1">{date}</p>
                            </li>
                          )
                        )}
                      </ul>
                    )}
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

              {/* User Icon */}
              <button
                onClick={() => setActiveComponent("profile")}
                className="text-gray-700 hover:text-orange-500 transition"
                aria-label="User Profile"
              >
                <LucideUser className="w-5 h-5" />
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
    </div>
  );
};

export default Header;

