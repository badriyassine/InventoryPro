import React from "react";
import {
  Home,
  LayoutDashboard,
  Package,
  BarChart3,
  TrendingUp,
  User,
} from "lucide-react";

const Nav = ({ activeComponent, setActiveComponent }) => {
  const handleNavClick = (component) => {
    setActiveComponent(component);
  };

  const navItems = [
    { component: "home", label: "Home", icon: Home },
    { component: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { component: "products", label: "Products", icon: Package },
    { component: "stock", label: "Stock", icon: BarChart3 },
    { component: "sales", label: "Sales", icon: TrendingUp },
    { component: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="sticky top-0 z-20 flex justify-around items-center mx-2 bg-white bg-opacity-30 backdrop-blur-md shadow-md rounded-md">
      {navItems.map(({ component, label, icon: Icon }) => (
        <button
          key={component}
          type="button"
          onClick={() => handleNavClick(component)}
          className={`w-full text-center cursor-pointer border-b-2 transition-all duration-300 py-3 px-2 ${
            activeComponent === component
              ? "border-orange-500 text-orange-500"
              : "border-transparent hover:border-orange-500 hover:text-orange-400"
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">{label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default Nav;
