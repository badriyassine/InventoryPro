import React, { useState } from "react";

const ResetPassword = ({ email, code, onDone }) => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost/inventory-backend/reset-password.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code, password }),
        }
      );
      const data = await res.json();
      setMessage(data.message);
      if (data.success) onDone(); // go to login
    } catch (err) {
      setMessage("Reset failed.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-md shadow-md">
      <h2 className="text-2xl mb-4">Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          className="w-full mb-4 p-2 border rounded"
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="bg-orange-500 text-white w-full py-2 rounded"
          type="submit"
        >
          Reset
        </button>
        {message && <p className="mt-2 text-sm text-center">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
