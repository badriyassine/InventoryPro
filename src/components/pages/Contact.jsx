import React from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Contact = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-6 py-10 text-center text-gray-800">
      {/* Logo at the top */}
      <img
        src="/src/assets/InventoryPro.png"
        alt="Logo"
        className="h-48 mb-8"
      />

      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

      <div className="mb-6 space-y-4 text-lg">
        <p>
          Fixe:{" "}
          <a href="tel:+1234567890" className="text-blue-600 hover:underline">
            +212 558507706
          </a>
        </p>
        <p>
          Mobile:{" "}
          <a href="tel:+0987654321" className="text-blue-600 hover:underline">
            +212 730287508
          </a>
        </p>
        <p>
          Email:{" "}
          <a
            href="mailto:contact@inventorypro.com"
            className="text-blue-600 hover:underline"
          >
            contact@inventorypro.com
          </a>
        </p>
      </div>

      {/* Social media icons just below the contact info */}
      <div className="mb-8 flex space-x-6 text-2xl justify-center text-gray-600">
        <a
          href="https://facebook.com/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="hover:text-orange-500"
        >
          <Facebook className="h-8 w-8" />
        </a>

        <a
          href="https://twitter.com/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="hover:text-orange-500"
        >
          <Twitter className="h-8 w-8" />
        </a>

        <a
          href="https://instagram.com/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="hover:text-orange-500"
        >
          <Instagram className="h-8 w-8" />
        </a>

        <a
          href="https://linkedin.com/in/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="hover:text-orange-500"
        >
          <Linkedin className="h-8 w-8" />
        </a>
      </div>
    </div>
  );
};

export default Contact;
