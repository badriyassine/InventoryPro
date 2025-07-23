import React, { useState } from "react";
import { BiShow, BiHide } from "react-icons/bi";
import { login } from "../../api";

const Login = ({ onLogin, onForgot, onSignup }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await login(form.email, form.password);
      console.log("Login response:", response);

      if (response.success) {
        localStorage.setItem("user", JSON.stringify(response.user));
        setMessage("Login successful!");
        onLogin && onLogin(response.user); // Notify parent to show Nav etc.
      } else {
        setMessage(response.message || "Login failed");
      }
    } catch (error) {
      if (error.response && error.response.message) {
        setMessage(error.response.message);
      } else {
        setMessage("Server error. Please try again.");
      }
      console.error("Login error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-6 py-10 mt-32 text-center text-gray-800">
      <div className="bg-white bg-opacity-40 shadow-lg rounded-xl max-w-md w-full p-8">
        <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors duration-200"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors duration-200"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-xl cursor-pointer text-orange-500 hover:text-orange-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") setShowPassword(!showPassword);
              }}
            >
              {showPassword ? <BiHide /> : <BiShow />}
            </div>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={onForgot}
              className="text-sm text-orange-600 hover:text-orange-700 hover:underline focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold text-white transition-colors duration-200 focus:outline-none ${
              loading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 active:bg-orange-700"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 text-center text-sm font-medium ${
              message === "Login successful!"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <p className="mt-6 text-sm text-gray-700 text-center">
          Don't have an account?{" "}
          <button
            onClick={onSignup}
            className="text-orange-600 hover:text-orange-700 hover:underline focus:outline-none font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
