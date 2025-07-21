import React, { useEffect, useState } from "react";
import { changeUserPassword } from "../../api/api"; // adjust import path as needed

const Profile = ({ setActiveComponent }) => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    id: null,
    role: "",  // Added role here
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

  // Logout confirmation modal state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutPasswords, setLogoutPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [logoutError, setLogoutError] = useState("");

  // Delete account confirmation modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePasswords, setDeletePasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const username = parsedUser.username || parsedUser.email.split("@")[0];
      setUserData({
        username,
        email: parsedUser.email,
        id: parsedUser.id || parsedUser.user_id || null,
        role: parsedUser.role || "User", // default role fallback
      });
      setEditedData({ username, email: parsedUser.email });
    }
  }, []);

  const handleLogoutPasswordChange = (e) => {
    setLogoutPasswords({ ...logoutPasswords, [e.target.name]: e.target.value });
  };
  const handleDeletePasswordChange = (e) => {
    setDeletePasswords({ ...deletePasswords, [e.target.name]: e.target.value });
  };

  const confirmLogout = () => {
    setLogoutError("");
    const { password, confirmPassword } = logoutPasswords;

    if (!password || !confirmPassword) {
      setLogoutError("Please fill in both password fields.");
      return;
    }
    if (password !== confirmPassword) {
      setLogoutError("Passwords do not match.");
      return;
    }

    localStorage.removeItem("user");
    setActiveComponent("login");
    setShowLogoutConfirm(false);
    setLogoutPasswords({ password: "", confirmPassword: "" });
  };

  const confirmDeleteAccount = () => {
    setDeleteError("");
    const { password, confirmPassword } = deletePasswords;

    if (!password || !confirmPassword) {
      setDeleteError("Please fill in both password fields.");
      return;
    }
    if (password !== confirmPassword) {
      setDeleteError("Passwords do not match.");
      return;
    }

    localStorage.removeItem("user");
    setActiveComponent("signup");
    setShowDeleteConfirm(false);
    setDeletePasswords({ password: "", confirmPassword: "" });
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUserData(editedData);
    localStorage.setItem(
      "user",
      JSON.stringify({ ...editedData, id: userData.id, role: userData.role })
    );
    setEditing(false);
  };

  const handleCancel = () => {
    setEditedData({ username: userData.username, email: userData.email });
    setEditing(false);
  };

  const handlePasswordInputChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

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

  return (
    <>
      <div className="max-w-6xl mx-auto mt-24 p-12 bg-white bg-opacity-30 mb-5 backdrop-blur-xl rounded-3xl shadow-2xl text-gray-800 min-h-[600px] flex flex-col justify-between">
        {/* Profile card content */}
        <div>
          <div className="flex items-center space-x-10 mb-12">
            <img
              className="w-36 h-36 rounded-full shadow-lg border-4 border-orange-300"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                userData.username
              )}&background=FFEDD5&color=EA580C&size=256`}
              alt="User Avatar"
            />
            <div>
              <h2 className="text-4xl font-bold flex items-center gap-4">
                {userData.username}
                <span className="px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded-full">
                  {userData.role}
                </span>
              </h2>
              <p className="text-lg text-gray-700 mt-2">{userData.email}</p>
              <p className="text-lg text-gray-700 mt-1">User Profile</p>
            </div>
          </div>

          <div className="max-w-lg">
            {"username email".split(" ").map((field) => (
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
                  <p className="text-lg text-gray-900">{userData[field] || "N/A"}</p>
                )}
              </div>
            ))}
          </div>

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
        </div>
      </div>

      {/* Buttons below the profile card aligned right */}
      <div className="max-w-6xl mx-auto pl-10 flex justify-end space-x-4 mb-36 ">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
        >
          Logout
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-semibold"
        >
          Delete Account
        </button>
      </div>

      {/* Modals here unchanged */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-6 text-center text-red-600">
              Confirm Logout
            </h3>

            <p className="mb-4 text-center">
              Please enter your password twice to confirm logout.
            </p>

            <div className="flex flex-col gap-4 mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={logoutPasswords.password}
                onChange={handleLogoutPasswordChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={logoutPasswords.confirmPassword}
                onChange={handleLogoutPasswordChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {logoutError && (
              <p className="text-red-600 text-center mb-4 font-semibold">{logoutError}</p>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  setLogoutPasswords({ password: "", confirmPassword: "" });
                  setLogoutError("");
                }}
                className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              Confirm Delete Account
            </h3>

            <p className="mb-4 text-center text-red-600 font-semibold">
              WARNING: This action is irreversible!
            </p>
            <p className="mb-4 text-center">
              Please enter your password twice to confirm account deletion.
            </p>

            <div className="flex flex-col gap-4 mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={deletePasswords.password}
                onChange={handleDeletePasswordChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={deletePasswords.confirmPassword}
                onChange={handleDeletePasswordChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>

            {deleteError && (
              <p className="text-red-600 text-center mb-4 font-semibold">{deleteError}</p>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePasswords({ password: "", confirmPassword: "" });
                  setDeleteError("");
                }}
                className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

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

      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-orange-500 text-white px-8 py-4 rounded-xl shadow-lg font-semibold text-center animate-pulse max-w-xs mx-auto">
            Password changed successfully!
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;


