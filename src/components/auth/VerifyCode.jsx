import React, { useState } from "react";

const VerifyCode = ({ email, onVerified }) => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost/inventory-backend/verify-code.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        }
      );
      const data = await res.json();
      setMessage(data.message);
      if (data.success) onVerified(code); // proceed to reset step
    } catch (err) {
      setMessage("Verification failed.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-md shadow-md">
      <h2 className="text-2xl mb-4">Enter Verification Code</h2>
      <form onSubmit={handleVerify}>
        <input
          className="w-full mb-4 p-2 border rounded"
          type="number"
          placeholder="Enter the code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button
          className="bg-orange-500 text-white w-full py-2 rounded"
          type="submit"
        >
          Verify
        </button>
        {message && <p className="mt-2 text-sm text-center">{message}</p>}
      </form>
    </div>
  );
};

export default VerifyCode;
