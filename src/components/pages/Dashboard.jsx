import React, { useEffect, useState } from "react";
import { Package, TrendingUp, Layers } from "lucide-react";
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

import { getDashboardStats } from "../../api/api";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total_products: 0,
    total_sales: 0,
    total_stock_entries: 0,
    total_sales_amount: 0,
    daily_sales: [],
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  useEffect(() => {
    if (user?.id) {
      getDashboardStats(user.id)
        .then((data) => {
          console.log("Dashboard stats response:", data);
          if (data.success || data.status === "success") {
            setStats(data.data);
          } else {
            console.error("Failed to load dashboard stats:", data.message);
          }
        })
        .catch((err) => console.error("Error fetching dashboard stats:", err));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="p-6 max-w-6xl m-7 mx-auto text-center text-red-600 font-semibold text-lg">
        You should login or sign up first.
      </div>
    );
  }

  const salesToday = stats.total_sales;

  let stockLevel = "Low";
  let stockColor = "text-red-500";
  if (stats.total_stock_entries >= 100 && stats.total_stock_entries < 300) {
    stockLevel = "Medium";
    stockColor = "text-yellow-500";
  } else if (stats.total_stock_entries >= 300) {
    stockLevel = "High";
    stockColor = "text-green-500";
  }

  const chartData = stats.daily_sales || [];

  return (
    <div className="p-6 max-w-6xl m-7 mx-auto">
      <h1 className="text-3xl font-bold mb-10 text-orange-600 text-center">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-[1.05] hover:shadow-orange-400/60 cursor-pointer">
          <Package className="text-orange-500 w-10 h-10" />
          <div>
            <p className="text-sm text-gray-700">Total Products</p>
            <p className="text-2xl font-bold text-orange-600">
              {stats.total_products}
            </p>
          </div>
        </div>

        <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-[1.05] hover:shadow-orange-400/60 cursor-pointer">
          <TrendingUp className="text-orange-500 w-10 h-10" />
          <div>
            <p className="text-sm text-gray-700">Sales Today</p>
            <p className="text-2xl font-bold text-orange-600">{salesToday}</p>
          </div>
        </div>

        <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-[1.05] hover:shadow-orange-400/60 cursor-pointer">
          <Layers className="text-orange-500 w-10 h-10" />
          <div>
            <p className="text-sm text-gray-700">Stock Quantity</p>
            <p className="text-2xl font-bold text-orange-600">
              {stats.total_stock_entries}
            </p>
            <p className={`text-sm font-semibold ${stockColor}`}>
              {stockLevel} Stock
            </p>
          </div>
        </div>

        <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-[1.05] hover:shadow-orange-400/60 cursor-pointer">
          <TrendingUp className="text-orange-500 w-10 h-10" />
          <div>
            <p className="text-sm text-gray-700">Total Revenue</p>
            <p className="text-2xl font-bold text-orange-600">
              ${stats.total_sales_amount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

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
              activeDot={{ r: 8 }}
              strokeWidth={3}
              name="Sales"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
