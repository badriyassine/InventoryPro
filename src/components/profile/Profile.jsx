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
      <div className="w-full max-w-7xl bg-white/20 backdrop-blur-md shadow-xl rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-orange-600">
            {userData.username || "My Profile"}
          </h2>
          {userData.role && (
            <p
              className={`text-sm mt-1 italic font-medium ${
                userData.role === "admin" ? "text-green-500" : "text-orange-500"
              }`}
            >
              {userData.role}
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Side: Avatar + Buttons */}
          <div className="w-full md:w-1/3 flex flex-col items-center gap-6">
            {/* Avatar */}
            <label className="relative group cursor-pointer">
              <img
                src={
                  userData.avatar_url
                    ? `http://localhost/inventory-backend${userData.avatar_url}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        username || "User"
                      )}&background=FFEDD5&color=EA580C&size=256`
                }
                alt="Avatar"
                className="w-40 h-40 rounded-full mt-2 shadow-lg border-4 border-orange-300 object-cover"
              />

              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center rounded-md transition">
                <svg
                  className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 7h14M12 11v6m7-6v6m-7-6H5"
                  />
                </svg>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>

            {/* Buttons */}
            <div className="w-40 flex flex-col gap-4 mt-6">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-md"
              >
                Logout
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
              >
                Delete Account
              </button>
            </div>
          </div>

          {/* Right Side: Profile Forms */}
          <div className="w-full md:w-2/3 space-y-6">
            {/* Update Profile */}
            <form
              onSubmit={handleUpdateProfile}
              className="bg-white/40 p-6 rounded-lg shadow-inner space-y-4"
            >
              <div>
                <label className="font-semibold">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="font-semibold">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md"
              >
                Update Profile
              </button>
            </form>

            {/* Change Password */}
            <form
              onSubmit={handleChangePassword}
              className="bg-white/40 p-6 rounded-lg shadow-inner space-y-4"
            >
              <div>
                <label className="font-semibold">Old Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="font-semibold">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md"
              >
                Change Password
              </button>
            </form>

            {message && (
              <div className="mt-4 text-center text-gray-800 bg-white/40 py-2 rounded-md">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-semibold text-red-600 mb-4">
              Delete Account
            </h3>
            <p className="mb-4">Enter your password to confirm:</p>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 mb-4 rounded-md border"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setConfirmPassword("");
                  setMessage("");
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmDelete();
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
