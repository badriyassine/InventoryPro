import React, { useEffect, useState } from "react";
import { Package, TrendingUp, Layers, Users, Trash2, X } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

import { getDashboardStats, getAllUsers, deleteUserByAdmin } from "../../api/api";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total_products: 0,
    total_sales: 0,
    total_stock_entries: 0,
    total_sales_amount: 0,
    daily_sales: [],
    total_users: 0,
  });

  const [users, setUsers] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    userId: null,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  useEffect(() => {
    if (user?.id) {
      getDashboardStats(user.id).then((data) => {
        if (data.success || data.status === "success") {
          setStats(data.data);
        }
      });

      if (user.role === "admin") {
        getAllUsers().then((res) => {
          if (res.success) {
            setUsers(res.users || []);
          }
        });
      }
    }
  }, [user]);

  const handleDeleteUser = async () => {
    try {
      const res = await deleteUserByAdmin(confirmDelete.userId);
      if (res.success) {
        setUsers(users.filter((u) => u.id !== confirmDelete.userId));
        closeConfirmDialog();
      } else {
        alert("Failed to delete user: " + res.message);
      }
    } catch (err) {
      alert("Error deleting user.");
    }
  };

  const openConfirmDialog = (userId) => {
    setConfirmDelete({ open: true, userId });
  };
  const closeConfirmDialog = () => {
    setConfirmDelete({ open: false, userId: null });
  };

  if (!user) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Please log in first.
      </div>
    );
  }

  const salesToday = stats.total_sales;
  const stockLevel =
    stats.total_stock_entries >= 300
      ? "High"
      : stats.total_stock_entries >= 100
      ? "Medium"
      : "Low";

  const stockColor =
    stockLevel === "High"
      ? "text-green-500"
      : stockLevel === "Medium"
      ? "text-yellow-500"
      : "text-red-500";

  const chartData = stats.daily_sales || [];

  return (
    <div className="p-6 max-w-6xl m-7 mx-auto">
      <h1 className="text-3xl font-bold mb-10 text-orange-600 text-center">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<Package />}
          title="Total Products"
          value={stats.total_products}
        />
        <StatCard
          icon={<TrendingUp />}
          title="Sales Today"
          value={salesToday}
        />
        <StatCard
          icon={<Layers />}
          title="Stock Quantity"
          value={stats.total_stock_entries}
          subtitle={stockLevel}
          subtitleColor={stockColor}
        />
        <StatCard
          icon={<TrendingUp />}
          title="Total Revenue"
          value={`$${stats.total_sales_amount.toFixed(2)}`}
        />
        {user.role === "admin" && (
          <StatCard icon={<Users />} title="Total Users" value={users.length} />
        )}
      </div>

      {/* Sales chart */}
      <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-orange-600 text-center">
          Weekly Sales Overview
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#f97316"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Admin: List all users with stats */}
      {user.role === "admin" && (
        <div className="mt-10 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-orange-600">
            All Users
          </h2>
          <ul className="space-y-3">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex justify-between items-center bg-white/40 p-4 rounded-xl shadow"
              >
                <div>
                  <strong>{u.username}</strong> ({u.email})<br />
                  <small className="text-sm text-gray-700">
                    Products: {u.total_products ?? "N/A"} | Stock:{" "}
                    {u.total_stock_entries ?? "N/A"} | Sales:{" "}
                    {u.total_sales ?? "N/A"}
                  </small>
                </div>
                <button
                  onClick={() => openConfirmDialog(u.id)}
                  className="flex items-center gap-1 text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {confirmDelete.open && (
        <ConfirmDialog
          onCancel={closeConfirmDialog}
          onConfirm={handleDeleteUser}
          message="Are you sure you want to delete this user? This action cannot be undone."
        />
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value, subtitle, subtitleColor }) => (
  <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-[1.05] hover:shadow-orange-400/60 cursor-pointer">
    <div className="text-orange-500 w-10 h-10">{icon}</div>
    <div>
      <p className="text-sm text-gray-700">{title}</p>
      <p className="text-2xl font-bold text-orange-600">{value}</p>
      {subtitle && (
        <p className={`text-sm font-semibold ${subtitleColor}`}>{subtitle}</p>
      )}
    </div>
  </div>
);

// Confirm dialog component styled like app
const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg text-center">
      <p className="mb-6 text-lg text-gray-700">{message}</p>
      <div className="flex justify-center gap-6">
        <button
          onClick={onCancel}
          className="px-6 py-2 rounded-md border border-orange-600 text-orange-600 font-semibold hover:bg-orange-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default Dashboard;
