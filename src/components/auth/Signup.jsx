import React, { useState } from "react";
import { signup } from "../../api";
import { BiShow, BiHide } from "react-icons/bi";

function Signup({ onSignup, onLoginClick }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const usernamePattern = /^(?:[a-zA-Z]{3,}[0-9]*|[a-zA-Z]+)[_]*$/;
  const passwordPattern = /^[a-zA-Z0-9_.-]{6,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!usernamePattern.test(form.username)) {
      return setMessage(
        "Username must contain only letters, optionally numbers (after 3 letters), and underscores."
      );
    }
    if (!passwordPattern.test(form.password)) {
      return setMessage(
        "Password must be at least 6 characters and can contain letters, numbers, _, -, ."
      );
    }
    if (form.password !== form.confirmPassword) {
      return setMessage("Passwords do not match.");
    }

    setLoading(true);
    try {
      const response = await signup(form.username, form.email, form.password);
      console.log("Signup response:", response);

      if (response && response.success && response.user) {
        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(response.user));

        // Call onSignup to update Auth context and switch to home
        if (onSignup) {
          onSignup(response.user);
        }

        setMessage("Signup successful!");
        window.location.reload();
      } else {
        setMessage(response?.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessage(
        "Unable to connect to the server. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-6 py-10 mt-28 text-center text-gray-800">
      <div className="w-full max-w-lg p-8 bg-white bg-opacity-40 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors duration-200"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors duration-200"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors duration-200"
            />
            <div
              className="absolute right-3 top-3 text-xl cursor-pointer text-orange-500 hover:text-orange-600"
              onClick={() => setShowPassword(!showPassword)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  setShowPassword(!showPassword);
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <BiHide /> : <BiShow />}
            </div>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors duration-200"
            />
            <div
              className="absolute right-3 top-3 text-xl cursor-pointer text-orange-500 hover:text-orange-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  setShowConfirmPassword(!showConfirmPassword);
              }}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? <BiHide /> : <BiShow />}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`py-3 rounded-lg text-white font-semibold transition-colors duration-200 ${
              loading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 active:bg-orange-700"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              message.toLowerCase().includes("success")
                ? "bg-green-50 text-green-600 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        <p className="mt-6 text-sm text-gray-700">
          Already have an account?{" "}
          <button
            onClick={onLoginClick}
            className="text-orange-600 font-semibold hover:text-orange-700 hover:underline focus:outline-none transition-colors duration-200"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;


