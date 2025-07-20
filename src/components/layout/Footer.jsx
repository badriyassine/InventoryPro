import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const Footer = ({ setActiveComponent }) => {
  // Helper function to change component and scroll to top smoothly
  const handleNavigation = (componentName) => {
    setActiveComponent(componentName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-transparent shadow-md rounded-md mx-2 mb-2 mt-8">
      <div className="px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="/src/assets/InventoryPro.png"
                alt="Logo"
                className="h-24 w-auto"
              />
            </div>
            <p className="text-gray-600 text-sm">
              Streamline your inventory management with our powerful and
              intuitive platform designed for modern businesses.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigation("home")}
                  className="text-left text-gray-600 hover:text-orange-500 transition-colors duration-200"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("products")}
                  className="text-left text-gray-600 hover:text-orange-500 transition-colors duration-200"
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("stock")}
                  className="text-left text-gray-600 hover:text-orange-500 transition-colors duration-200"
                >
                  Stock Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("sales")}
                  className="text-left text-gray-600 hover:text-orange-500 transition-colors duration-200"
                >
                  Sales Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Support</h4>
            <ul className="space-y-2">
              <li>
                <button
                  className="text-left text-gray-600 hover:text-orange-500 transition-colors duration-200"
                  onClick={() => alert("Redirect to Help Center")}
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  className="text-left text-gray-600 hover:text-orange-500 transition-colors duration-200"
                  onClick={() => alert("Redirect to Documentation")}
                >
                  Documentation
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("contact")}
                  className="text-left text-gray-600 hover:text-orange-500 transition-colors duration-200"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  className="text-left text-gray-600 hover:text-orange-500 transition-colors duration-200"
                  onClick={() => alert("Redirect to Privacy Policy")}
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-orange-500" />
                <span className="text-gray-600 text-sm">
                  support@inventorypro.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-orange-500" />
                <span className="text-gray-600 text-sm">+212 758507706</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span className="text-gray-600 text-sm">
                  12 Rue Ibnou Sina, Casablanca 20000, Morocco
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-orange-400 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gray-600 text-sm">
                © 2024 InventoryPro. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
