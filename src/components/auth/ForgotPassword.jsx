import React, { useState } from "react";
import { apiFetch } from "../../api/api";
import Loading from "../common/Loading";

const ForgotPassword = ({ onBackToLogin }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSendCode = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await apiFetch("forgot-password.php", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (result.success) {
        setMessage(result.message || "Verification code sent to your email.");
        setStep(2);
      } else {
        setError(result.message || "Failed to send verification code.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      setError("Please enter the verification code.");
      return;
    }

    if (code.length !== 6) {
      setError("Verification code must be 6 digits.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await apiFetch("verify-code.php", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });

      if (result.success) {
        setMessage(result.message || "Code verified successfully.");
        setStep(3);
      } else {
        setError(result.message || "Invalid verification code.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await apiFetch("reset-password.php", {
        method: "POST",
        body: JSON.stringify({ email, code, password }),
      });

      if (result.success) {
        alert(
          "Password reset successful! You can now login with your new password."
        );
        onBackToLogin();
      } else {
        setError(result.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = (e) => {
    if (e) e.preventDefault();
    if (loading) return;

    // Reset all state before going back
    setEmail("");
    setCode("");
    setPassword("");
    setError("");
    setMessage("");
    setStep(1);

    // Call the callback function directly
    onBackToLogin();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-orange-100 bg-opacity-40 backdrop-blur-sm z-50">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-orange-600 mb-6">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify Code"}
          {step === 3 && "Reset Password"}
        </h2>

        {loading && <Loading />}

        {step === 1 && (
          <>
            <p className="text-gray-600 mb-4">
              Enter your email address to receive a verification code.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              disabled={loading}
              className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
            />
            <button
              onClick={handleSendCode}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-gray-600 mb-4">
              Enter the 6-digit verification code sent to your email.
            </p>
            <input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                setError("");
              }}
              disabled={loading}
              className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
              maxLength={6}
            />
            <button
              onClick={handleVerifyCode}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-gray-600 mb-4">
              Create your new password (minimum 6 characters).
            </p>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              disabled={loading}
              className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
            />
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        {message && (
          <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">{message}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleBackToLogin}
          type="button"
          className="mt-6 text-sm text-orange-600 hover:underline disabled:opacity-50 cursor-pointer"
          disabled={loading}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
