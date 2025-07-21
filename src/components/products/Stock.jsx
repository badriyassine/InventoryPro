import React, { useState, useEffect } from "react";
import {
  getProducts,
  getStock,
  addStock,
  deleteStock,
  updateStock,
  addNotification
} from "../../api/api";
import Loading from "../common/Loading";
import { useAuth } from "../../context/AuthContext";

const AddStockModal = ({ isOpen, onClose, onStockAdded, userId }) => {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getProducts(userId)
        .then((res) => {
          if (res.success) setProducts(res.products);
          else setProducts([]);
        })
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));

      setProductId("");
      setQuantity("");
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

    setLoading(true);
    try {
      const result = await addStock(productId, quantity, userId, notes);
      if (result.success) {
        await addNotification("Stock added successfully", "stock");
        onStockAdded();
        onClose();
      } else {
        setError(result.message || "Failed to add stock");
      }
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add Stock</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {loading && products.length === 0 ? (
          <Loading />
        ) : (
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
                {loading ? "Adding..." : "Add Stock"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const UpdateStockModal = ({
  isOpen,
  onClose,
  onStockUpdated,
  userId,
  stockItem,
}) => {
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && stockItem) {
      setQuantity(stockItem.quantity);
      setError("");
    }
  }, [isOpen, stockItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      setError("Enter a valid quantity");
      return;
    }

    setLoading(true);
    try {
      const result = await updateStock(stockItem.id, quantity, userId);
      if (result.success) {
        onStockUpdated();
        onClose();
      } else {
        setError(result.message || "Failed to update stock");
      }
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Update Stock</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Quantity"
            className="w-full mb-4 px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:outline-none"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              if (error) setError("");
            }}
            min="1"
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
              {loading ? "Updating..." : "Update Stock"}
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
          <h2 className="text-xl font-bold text-gray-800">Stock Details</h2>
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
            <span className="font-semibold">Notes:</span>
            <span>{details.notes || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Date:</span>
            <span>{new Date(details.date).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({
  isOpen,
  onCancel,
  onConfirm,
  itemName = "this item",
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800">
          Confirm Deletion
        </h3>
        <p className="text-gray-600 mt-2 mb-4">
          Are you sure you want to delete <strong>{itemName}</strong>?
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

const Stock = () => {
  const { user } = useAuth();
  const [stockItems, setStockItems] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [stockToUpdate, setStockToUpdate] = useState(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(null); // { id, name }
  const [deleting, setDeleting] = useState(false);

  const fetchStock = async () => {
    try {
      setLoading(true);
      const result = await getStock(user?.id);
      if (result.success) {
        setStockItems(result.stock || []);
        setError("");
      } else {
        setError(result.message || "Failed to fetch stock data");
      }
    } catch (err) {
      setError("Error loading stock data");
      console.error("Error fetching stock:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchStock();
  }, [user]);

  const openViewModal = (details) => {
    setSelectedDetails(details);
    setViewModalOpen(true);
  };

  const openUpdateModal = (stockItem) => {
    setStockToUpdate(stockItem);
    setUpdateModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const res = await deleteStock(confirmDelete.id, user?.id);
      if (res.success) {
        fetchStock();
        setConfirmDelete(null);
      } else {
        alert(res.message || "Failed to delete");
      }
    } catch {
      alert("Server error during deletion");
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="p-6 max-w-6xl mt-3 mx-auto text-red-600 font-semibold text-lg">
          You should login or sign up first.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-[calc(100vh-8rem)] relative flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-orange-600">
          Stock Operations
        </h2>
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          Add Stock
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="text-center p-4">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchStock}
            className="mt-2 text-orange-500 hover:text-orange-600"
          >
            Try Again
          </button>
        </div>
      ) : stockItems.length === 0 ? (
        <p className="text-center text-gray-500">No stock operations found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-orange-300 rounded-lg">
            <thead className="bg-orange-100">
              <tr>
                <th className="px-6 py-4 text-left">#</th>
                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4 text-left">Quantity</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {stockItems.map((item, index) => (
                <tr key={item.id} className="border-t border-orange-300">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{item.product_name}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openViewModal(item)}
                      className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openUpdateModal(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() =>
                        setConfirmDelete({
                          id: item.id,
                          name: item.product_name,
                        })
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
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
      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onStockAdded={fetchStock}
        userId={user?.id}
      />

      <UpdateStockModal
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onStockUpdated={fetchStock}
        userId={user?.id}
        stockItem={stockToUpdate}
      />

      <ViewDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setViewModalOpen(false)}
        details={selectedDetails}
      />

      <DeleteConfirmationModal
        isOpen={!!confirmDelete}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={handleDeleteConfirm}
        itemName={confirmDelete?.name}
        loading={deleting}
      />
    </div>
  );
};

export default Stock;
