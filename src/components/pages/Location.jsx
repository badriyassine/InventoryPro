import React from "react";

const Location = () => {
  return (
    <div className="location-container max-w-6xl p-6 backdrop-blur-xl bg-opacity-30 mb-40 mt-20 mx-auto bg-white rounded-md shadow-2xl ">
      {/* Logo at the top */}
      <div className="flex justify-center mb-6">
        <img
          src="/src/assets/InventoryPro.png"
          alt="InventoryPro Logo"
          className="h-32 object-contain" // increased height from 20 to 32
        />
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-center">Our Location</h2>

      <p className="mb-4 text-center">
        InventoryPro
        <br />
        12 Rue Ibnou Sina,
        <br />
        Casablanca 20000, Morocco
      </p>

      <div className="map-wrapper" style={{ width: "100%", height: "300px" }}>
        <iframe
          title="Company Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.059975682161!2d-7.61722238480039!3d33.57311078074262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdaf7ec31538a661%3A0x53a8b9e1cc66b77d!2sCasablanca!5e0!3m2!1sen!2sma!4v1690190123456!5m2!1sen!2sma"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Location;
