import React, { useEffect, useState } from "react";
import {
  changeUserPassword,
  deleteUserAccount,
  updateUserProfile,
  uploadAvatar,
  logout,
} from "../../api/api"; // Make sure uploadAvatar and logout are exported in api.jsx

const Profile = ({ setActiveComponent }) => {
  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : {};
  });

  const [username, setUsername] = useState(userData.username || "");
  const [email, setEmail] = useState(userData.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setUsername(userData.username || "");
    setEmail(userData.email || "");
  }, [userData]);

  // Update profile handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUserProfile(userData.id, username, email);
      if (res.success) {
        const updated = { ...userData, username, email };
        setUserData(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        setMessage("✅ Profile updated.");
      } else {
        setMessage("❌ Update failed.");
      }
    } catch {
      setMessage("❌ Update failed due to network error.");
    }
  };

  // Change password handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setMessage("❌ Please fill both password fields.");
      return;
    }
    try {
      const res = await changeUserPassword(
        userData.id,
        oldPassword,
        newPassword
      );
      setMessage(res.message || "❌ Password change failed.");
      setOldPassword("");
      setNewPassword("");
    } catch {
      setMessage("❌ Password change failed due to network error.");
    }
  };

  // Avatar upload handler using uploadAvatar API function
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await uploadAvatar(file);
      if (res.success && res.avatar_url) {
        const updated = { ...userData, avatar_url: res.avatar_url };
        setUserData(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        setMessage("✅ Avatar updated.");
      } else {
        setMessage(res.message || "❌ Avatar upload failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload error.");
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignore logout errors here
    }
    localStorage.removeItem("user");
    setActiveComponent("login");
    window.location.reload();
  };

  // Confirm delete account handler
  const confirmDelete = async () => {
    if (!confirmPassword) {
      setMessage("❌ Enter password for deletion.");
      return;
    }
    try {
      const res = await deleteUserAccount(confirmPassword);
      if (res.success) {
        localStorage.removeItem("user");
        setActiveComponent("login");
      } else {
        setMessage(res.message || "❌ Delete failed.");
      }
    } catch {
      setMessage("❌ Delete failed due to network error.");
    }
  };

  return (
    <div className="bg-transparent min-h-screen px-4 py-10 flex justify-center">
      <div className="w-full max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mb-4 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-orange-600 mb-2">
            {userData.username || "My Profile"}
          </h2>
          {userData.role && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm">
              <div
                className={`w-2 h-2 rounded-full ${
                  userData.role === "admin" ? "bg-green-500" : "bg-orange-500"
                }`}
              ></div>
              <span
                className={`text-sm font-medium ${
                  userData.role === "admin"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Avatar & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white/20 backdrop-blur-md shadow-xl rounded-2xl p-8 text-center">
              {/* Avatar Section */}
              <div className="mb-8">
                <label className="relative group cursor-pointer inline-block">
                  <div className="relative">
                    <img
                      src={
                        userData.avatar_url
                          ? `http://localhost/inventory-backend${userData.avatar_url}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              username || "User"
                            )}&background=FFEDD5&color=EA580C&size=256`
                      }
                      alt="Avatar"
                      className="w-32 h-32 rounded-full shadow-2xl border-4 border-orange-300 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300">
                      <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <svg
                          className="w-6 h-6 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-600 mt-4">
                  Click to change avatar
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Profile Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Update Profile Card */}
            <div className="bg-white/20 backdrop-blur-md shadow-xl rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-orange-600">
                  Profile Information
                </h3>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your username"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-orange-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your email"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-orange-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Update Profile
                </button>
              </form>
            </div>

            {/* Change Password Card */}
            <div className="bg-white/20 backdrop-blur-md shadow-xl rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-orange-600">
                  Change Password
                </h3>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300"
                        placeholder="Enter current password"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-orange-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300"
                        placeholder="Enter new password"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-orange-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Change Password
                </button>
              </form>
            </div>

            {/* Message Display */}
            {message && (
              <div className="bg-white/30 backdrop-blur-sm border border-orange-200 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  {message.includes("✅") ? (
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                  <span className="text-gray-800 font-medium">{message}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl w-full max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-600 mb-8">
                Are you sure you want to log out of your account?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    handleLogout();
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl w-full max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-2">
                Delete Account
              </h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. Enter your password to confirm:
              </p>
              <div className="mb-6">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setConfirmPassword("");
                    setMessage("");
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmDelete();
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
