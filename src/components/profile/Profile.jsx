import React, { useEffect, useState } from "react";
import { changeUserPassword } from "../../api/api"; // adjust import path as needed

const Profile = ({ setActiveComponent }) => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    id: null,
  });
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState({ username: "", email: "" });

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [changePasswordMessage, setChangePasswordMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Load user data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const username = parsedUser.username || parsedUser.email.split("@")[0];
      setUserData({
        username,
        email: parsedUser.email,
        id: parsedUser.id || parsedUser.user_id || null,
      });
      setEditedData({ username, email: parsedUser.email });
    }
  }, []);

  // Handle profile input changes
  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  // Save edited profile (only localStorage, can extend to backend)
  const handleSave = () => {
    setUserData(editedData);
    localStorage.setItem(
      "user",
      JSON.stringify({ ...editedData, id: userData.id })
    );
    setEditing(false);
  };

  const handleCancel = () => {
    setEditedData({ username: userData.username, email: userData.email });
    setEditing(false);
  };

  // Handle change password inputs
  const handlePasswordInputChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Call backend API to change password using api function
  const handleChangePassword = async () => {
    setChangePasswordMessage("");

    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setChangePasswordMessage("New passwords do not match.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setChangePasswordMessage("Password must be at least 6 characters.");
      return;
    }

    if (!userData.id) {
      setChangePasswordMessage("User ID missing. Please login again.");
      return;
    }

    try {
      const result = await changeUserPassword(
        userData.id,
        passwords.currentPassword,
        passwords.newPassword
      );

      if (result.success) {
        setShowSuccessPopup(true);
        setShowChangePassword(false);
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } else {
        setChangePasswordMessage(
          result.message || "Failed to change password."
        );
      }
    } catch (err) {
      setChangePasswordMessage("Server error. Try again later.");
    }
  };

  // If not logged in
  if (!localStorage.getItem("user")) {
    return (
      <div className="max-w-md mx-auto mt-32 p-8 bg-white bg-opacity-30 backdrop-blur-xl rounded-xl shadow-2xl text-gray-800 text-center">
        <h2 className="text-3xl font-bold mb-6">You are not logged in</h2>
        <div className="flex justify-center gap-6">
          <button
            onClick={() => setActiveComponent("login")}
            className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold text-lg"
          >
            Login
          </button>
          <button
            onClick={() => setActiveComponent("signup")}
            className="px-8 py-3 bg-orange-300 text-orange-800 rounded-lg hover:bg-orange-400 transition font-semibold text-lg"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  // Logged in profile UI
  return (
    <div className="max-w-6xl mx-auto mt-24 p-12 bg-white bg-opacity-30 mb-36 backdrop-blur-xl rounded-3xl shadow-2xl text-gray-800">
      {/* Avatar + Username + Email */}
      <div className="flex items-center space-x-10 mb-12">
        <img
          className="w-36 h-36 rounded-full shadow-lg border-4 border-orange-300"
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            userData.username
          )}&background=FFEDD5&color=EA580C&size=256`}
          alt="User Avatar"
        />
        <div>
          <h2 className="text-4xl font-bold">{userData.username}</h2>
          <p className="text-lg text-gray-700 mt-2">{userData.email}</p>
          <p className="text-lg text-gray-700 mt-1">User Profile</p>
        </div>
      </div>

      {/* Editable User Info */}
      <div className="max-w-lg">
        {["username", "email"].map((field) => (
          <div key={field} className="mb-6">
            <label className="block text-sm font-semibold text-gray-600 capitalize mb-1">
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            {editing ? (
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={editedData[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
              />
            ) : (
              <p className="text-lg text-gray-900">
                {userData[field] || "N/A"}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Buttons: Modify and Change Password */}
      <div className="flex justify-start mt-12 max-w-lg space-x-4">
        <div>
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-orange-500 text-white text-lg font-medium rounded-lg hover:bg-orange-600 transition mr-4"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-300 text-gray-800 text-lg font-medium rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-3 bg-orange-500 text-white text-lg font-medium rounded-lg hover:bg-orange-600 transition"
            >
              Modify
            </button>
          )}
        </div>

        <button
          onClick={() => setShowChangePassword(true)}
          className="px-6 py-3 bg-orange-500 text-white text-lg font-medium rounded-lg hover:bg-orange-600 transition"
        >
          Change Password
        </button>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-6 text-center text-orange-600">
              Change Password
            </h3>

            <div className="flex flex-col gap-4 mb-4">
              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={passwords.currentPassword}
                onChange={handlePasswordInputChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={handlePasswordInputChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="password"
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                value={passwords.confirmNewPassword}
                onChange={handlePasswordInputChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {changePasswordMessage && (
              <p className="text-red-600 text-center mb-4 font-semibold">
                {changePasswordMessage}
              </p>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowChangePassword(false)}
                className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-orange-500 text-white px-8 py-4 rounded-xl shadow-lg font-semibold text-center animate-pulse max-w-xs mx-auto">
            Password changed successfully!
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
