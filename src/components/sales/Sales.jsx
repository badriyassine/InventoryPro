import React, { useState, useEffect } from "react";
import {
  getProducts,
  getStock,
  getSales,
  addSale,
  deleteSale,
  addNotification,
} from "../../api/api";
import Loading from "../common/Loading";

const AddSaleModal = ({ isOpen, onClose, onSaleAdded, userId }) => {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([getProducts(userId), getStock(userId)])
        .then(([productsData, stockData]) => {
          if (productsData.success) setProducts(productsData.products);
          else setProducts([]);

          if (stockData.success) setStock(stockData.stock);
          else setStock([]);
        })
        .catch((err) => {
          if (err.message && err.message.includes("401")) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("user");
            window.location.reload();
          } else {
            setError("Failed to load products or stock");
          }
          setProducts([]);
          setStock([]);
        })
        .finally(() => setLoading(false));

      // Reset form
      setProductId("");
      setQuantity("");
      setPrice("");
      setNotes("");
      setError("");
    }
  }, [isOpen, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId) {
      setError("Select a product");
      return;
    }
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      setError("Enter a valid quantity");
      return;
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      setError("Enter a valid price");
      return;
    }

    setLoading(true);
    try {
      // Fixed argument order here: userId before notes
      const result = await addSale(productId, quantity, price, userId, notes);
      if (result.success) {
        await addNotification("Sale added successfully", "sale");
        onSaleAdded();
        onClose();
      } else {
        setError(result.message || "Failed to add sale");
      }
    } catch (err) {
      if (err.message && err.message.includes("401")) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("user");
        window.location.reload();
      } else {
        setError("Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (!loading && (products.length === 0 || stock.length === 0)) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Inventory is empty
          </h2>
          <p className="mb-6">
            {products.length === 0 &&
              stock.length === 0 &&
              "Please add products and stock first before adding sales."}
            {products.length === 0 &&
              stock.length > 0 &&
              "Please add products first before adding sales."}
            {products.length > 0 &&
              stock.length === 0 &&
              "Please add stock first before adding sales."}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add Sale</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {loading && <Loading />}

        <form onSubmit={handleSubmit}>
          <select
            className="w-full mb-4 px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={productId}
            onChange={(e) => {
              setProductId(e.target.value);
              if (error) setError("");
            }}
            disabled={loading}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            className="w-full mb-4 px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              if (error) setError("");
            }}
            min="1"
            disabled={loading}
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full mb-4 px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              if (error) setError("");
            }}
            min="0.01"
            step="0.01"
            disabled={loading}
          />

          <textarea
            placeholder="Notes (optional)"
            className="w-full mb-4 px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
          />

          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ViewDetailsModal = ({ isOpen, onClose, details }) => {
  if (!isOpen || !details) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Sale Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Product:</span>
            <span>{details.product_name}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Quantity:</span>
            <span>{details.quantity}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Price:</span>
            <span>${Number(details.price).toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Notes:</span>
            <span>{details.notes || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Date:</span>
            <span>{new Date(details.sold_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800">
          Confirm Deletion
        </h3>
        <p className="text-gray-600 mt-2 mb-4">
          Are you sure you want to delete this sale?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Sales = () => {
  const [user, setUser] = useState(null);
  const [salesItems, setSalesItems] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const result = await getSales(user?.id);
      if (result.success) {
        setSalesItems(result.sales || []);
        setError("");
      } else {
        setError(result.message || "Failed to fetch sales data");
      }
    } catch (err) {
      if (err.message && err.message.includes("401")) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("user");
        setUser(null);
        window.location.reload();
      } else {
        setError("Error loading sales data");
        console.error("Error fetching sales:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchSales();
  }, [user]);

  const openViewModal = (details) => {
    setSelectedDetails(details);
    setViewModalOpen(true);
  };

  const requestDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    try {
      const res = await deleteSale(deleteId, user?.id);
      if (res.success) {
        fetchSales();
      } else {
        alert(res.message || "Failed to delete sale");
      }
    } catch (err) {
      if (err.message && err.message.includes("401")) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("user");
        setUser(null);
        window.location.reload();
      } else {
        alert("Server error during deletion");
      }
    } finally {
      setShowDeleteConfirm(false);
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 max-w-6xl mt-7 mx-auto text-center text-red-600 font-semibold text-lg">
        You should login or sign up first.
      </div>
    );
  }

  return (
    <div className="p-4 min-h-[calc(100vh-8rem)] relative flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-orange-600">Sales</h1>
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-200"
        >
          Add Sale
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="text-center p-4">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchSales}
            className="mt-2 text-orange-500 hover:text-orange-600"
          >
            Try Again
          </button>
        </div>
      ) : salesItems.length === 0 ? (
        <p className="text-center text-gray-500">No sales records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-orange-300 rounded-lg">
            <thead className="bg-orange-100 ">
              <tr>
                <th className="px-6 py-4 text-left">#</th>
                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4 text-left">Quantity</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {salesItems.map((sale, index) => (
                <tr
                  key={sale.id ?? index}
                  className="border-t border-orange-300"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{sale.product_name}</td>
                  <td className="px-6 py-4">{sale.quantity}</td>
                  <td className="px-6 py-4">
                    {Number(sale.price).toFixed(2)}$
                  </td>
                  <td className="px-6 py-4">
                    {new Date(sale.sold_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openViewModal(sale)}
                      className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => requestDelete(sale.id)}
                      disabled={deleteLoading}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <AddSaleModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSaleAdded={fetchSales}
        userId={user?.id}
      />
      <ViewDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setViewModalOpen(false)}
        details={selectedDetails}
      />
      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeleteId(null);
        }}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Sales;
