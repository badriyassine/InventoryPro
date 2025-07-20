import React from "react";

const About = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] px-6 pb-24 py-10 text-center text-gray-800">
      {/* Big logo at the top */}
      <img
        src="/src/assets/InventoryPro.png"
        alt="Logo"
        className="h-48 mb-8"
      />

      <h1 className="text-4xl font-bold mb-6 text-orange-500">About Us</h1>

      <p className="text-lg leading-relaxed max-w-3xl text-justify">
        Welcome to our advanced Stock and Sales Management System — a
        comprehensive platform designed to empower businesses of all sizes to
        manage their inventory, sales, and operations with unmatched efficiency.
        Whether you're a small shop owner or a large retailer, our system is
        built to scale with your needs.
        <br />
        <br />
        Our intuitive dashboard allows you to monitor product availability,
        stock levels, and sales trends in real-time. With features like smart
        stock alerts, low inventory warnings, and sales analytics, you’ll always
        be in control and ready to make data-driven decisions. Forget the hassle
        of manual stock-taking or relying on outdated spreadsheets — our
        solution automates key tasks to save time and reduce human error.
        <br />
        <br />
        In addition to inventory management, the platform offers seamless sales
        tracking, giving you a clear picture of your business performance. You
        can analyze daily, weekly, or monthly sales data, identify your
        best-selling products, and optimize your sales strategy accordingly.
        <br />
        <br />
        Security and reliability are at the core of our platform. Your data is
        protected, and our responsive design ensures you can access your
        dashboard anytime, anywhere — whether you're in the office or on the go.
        <br />
        <br />
        Join hundreds of satisfied users who have transformed their inventory
        and sales workflows with our system. We are committed to helping your
        business grow by giving you the tools and insights you need to succeed
        in today’s competitive market.
      </p>
    </div>
  );
};

export default About;
