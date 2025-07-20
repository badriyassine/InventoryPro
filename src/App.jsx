import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Header from "./components/layout/Header";
import Nav from "./components/layout/Nav";
import Products from "./components/products/Products";
import Stock from "./components/products/Stock";
import Sales from "./components/sales/Sales";
import Home from "./components/pages/Home";
import Footer from "./components/layout/Footer";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import Profile from "./components/profile/Profile";
import Location from "./components/pages/Location";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";
import Loading from "./components/common/Loading";
import Dashboard from "./components/pages/Dashboard";

// Main App Content Component
const AppContent = () => {
  const { user, login, logout, loading: authLoading } = useAuth();
  const [activeComponent, setActiveComponent] = useState(() => {
    return localStorage.getItem("activeComponent") || "home";
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Load user from localStorage on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && !user) {
      login(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeComponent", activeComponent);
  }, [activeComponent]);

  useEffect(() => {
    const capitalized =
      activeComponent.charAt(0).toUpperCase() + activeComponent.slice(1);
    document.title = `${capitalized} - InventoryPro`;
  }, [activeComponent]);

  const handleUserLogin = (userData) => {
    login(userData);
    setActiveComponent("home");
    setShowForgotPassword(false);
  };

  const handleLogout = () => {
    logout();
    setActiveComponent("home");
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setActiveComponent("login");
  };

  const renderComponent = () => {
    if (authLoading) return <Loading />;
    if (showForgotPassword) return <ForgotPassword onBackToLogin={handleBackToLogin} />;

    const isLoggedIn = !!user;

    const protectedComponent = (Component) =>
      isLoggedIn ? (
        <Component />
      ) : (
        <Login
          onLogin={handleUserLogin}
          onForgot={handleForgotPassword}
          onSignup={() => setActiveComponent("signup")}
        />
      );

    switch (activeComponent) {
      case "home":
        return <Home setActiveComponent={setActiveComponent} isLoggedIn={isLoggedIn} />;
      case "products":
        return protectedComponent(Products);
      case "stock":
        return protectedComponent(Stock);
      case "sales":
        return protectedComponent(Sales);
      case "dashboard":
        return protectedComponent(Dashboard);
      case "profile":
        return protectedComponent(() => <Profile setActiveComponent={setActiveComponent} />);
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      case "location":
        return <Location />;
      case "login":
        return isLoggedIn ? (
          <Home setActiveComponent={setActiveComponent} isLoggedIn={true} />
        ) : (
          <Login
            onLogin={handleUserLogin}
            onForgot={handleForgotPassword}
            onSignup={() => setActiveComponent("signup")}
          />
        );
      case "signup":
        return isLoggedIn ? (
          <Home setActiveComponent={setActiveComponent} isLoggedIn={true} />
        ) : (
          <Signup
            onSignup={handleUserLogin}
            onLoginClick={() => setActiveComponent("login")}
          />
        );
      default:
        return <Home setActiveComponent={setActiveComponent} isLoggedIn={isLoggedIn} />;
    }
  };

  const shouldShowNav = () => {
    const hiddenNavPages = ["about", "contact", "login", "signup", "location"];
    return (
      !hiddenNavPages.includes(activeComponent) &&
      !showForgotPassword &&
      !authLoading
    );
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-orange-50">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 relative">
      {/* Background Animation */}
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div
          className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col flex-1">
        <Header
          setActiveComponent={setActiveComponent}
          activeComponent={activeComponent}
          isLoggedIn={!!user}
          onLogout={handleLogout}
        />

        {shouldShowNav() && (
          <Nav
            activeComponent={activeComponent}
            setActiveComponent={setActiveComponent}
          />
        )}

        <main className="flex-1">{renderComponent()}</main>
        <Footer setActiveComponent={setActiveComponent} />
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

