import React, { useState, useEffect } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  addNotification,
} from "../../api/api";

const validNameRegex = /^[a-zA-Z0-9 ]*$/;

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProductName("");
      setDescription("");
      setCategory("");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = productName.trim();
    const trimmedDescription = description.trim();
    const trimmedCategory = category.trim();

    if (!trimmedName) {
      setError("Product name is required");
      return;
    }
    if (!validNameRegex.test(trimmedName)) {
      setError("Product name can contain only letters, numbers, and spaces");
      return;
    }
    // Optional: you can add validation for description/category if needed

    setLoading(true);
    try {
      const result = await addProduct({
        name: trimmedName,
        description: trimmedDescription,
        category: trimmedCategory,
      });
      if (result.success) {
        await addNotification(`Product added: ${trimmedName}`, "product");
        onProductAdded();
        onClose();
      } else {
        setError(result.message || "Failed to add product");
      }
    } catch (err) {
      if (err.message.includes("401")) {
        alert("Session expired. Please log in again.");
        onClose();
        window.location.reload();
      } else {
        setError("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-96"
        style={{ marginTop: "-20px" }}
      >
        <h2 className="text-xl font-bold mb-4 text-orange-600">Add Product</h2>
        <input
          type="text"
          value={productName}
          onChange={(e) => {
            if (validNameRegex.test(e.target.value) || e.target.value === "") {
              setProductName(e.target.value);
              if (error) setError("");
            }
          }}
          className="w-full px-3 py-2 border border-orange-400 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Enter product name"
          disabled={loading}
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-orange-400 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Enter product description"
          disabled={loading}
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-orange-400 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Enter category"
          disabled={loading}
        />
        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setError("");
              onClose();
            }}
            className="text-gray-600 px-4 py-2 rounded hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setProductName(product.name || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
      setError("");
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = productName.trim();
    const trimmedDescription = description.trim();
    const trimmedCategory = category.trim();

    if (!trimmedName) {
      setError("Product name is required");
      return;
    }
    if (!validNameRegex.test(trimmedName)) {
      setError("Product name can contain only letters, numbers, and spaces");
      return;
    }

    setLoading(true);
    try {
      const result = await updateProduct(product.id, {
        name: trimmedName,
        description: trimmedDescription,
        category: trimmedCategory,
      });
      if (result.success) {
        await addNotification(`Product updated: ${trimmedName}`, "product");
        onClose();
      } else {
        setError(result.message || "Failed to update product");
      }
    } catch (err) {
      if (err.message.includes("401")) {
        alert("Session expired. Please log in again.");
        onClose();
        window.location.reload();
      } else {
        setError("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-96"
        style={{ marginTop: "-20px" }}
      >
        <h2 className="text-xl font-bold mb-4 text-orange-600">Edit Product</h2>
        <input
          type="text"
          value={productName}
          onChange={(e) => {
            if (validNameRegex.test(e.target.value) || e.target.value === "") {
              setProductName(e.target.value);
              if (error) setError("");
            }
          }}
          className="w-full px-3 py-2 border border-orange-400 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Product name"
          disabled={loading}
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-orange-400 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Description"
          disabled={loading}
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-orange-400 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Category"
          disabled={loading}
        />
        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setError("");
              onClose();
            }}
            className="text-gray-600 px-4 py-2 rounded hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
  loading,
}) => {
  if (!isOpen) return null;
  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-white p-6 rounded shadow-lg w-96"
        style={{ marginTop: "-20px" }}
      >
        <h3 className="text-lg font-semibold mb-4 text-red-600">
          Delete Product
        </h3>
        <p className="mb-6">
          Are you sure you want to delete{" "}
          <span className="font-bold text-red-600">{productName}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      if (res.success && Array.isArray(res.products)) {
        setProducts(res.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      if (err.message.includes("401")) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("user");
        setUser(null);
        window.location.reload();
      } else {
        alert("Error loading products. Please try again.");
      }
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) loadProducts();
  }, [user]);

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setDeleteLoading(true);
    try {
      const res = await deleteProduct(selectedProduct.id);
      if (res.success) {
        await addNotification(`Product deleted: ${selectedProduct.name}`, "product");
        setDeleteModalOpen(false);
        setSelectedProduct(null);
        loadProducts();
      } else {
        alert(res.message || "Failed to delete product");
      }
    } catch (err) {
      if (err.message.includes("401")) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("user");
        setUser(null);
        window.location.reload();
      } else {
        alert("Failed to delete product");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  if (!user) {
    return (
      <div className="p-6 max-w-6xl m-7 mx-auto text-center text-red-600 font-semibold text-lg">
        You should login or sign up first.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 p-4">
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded w-full md:w-auto"
          >
            + Add Product
          </button>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 px-5 py-3 rounded w-full pr-10 text-sm"
            />
            <svg
              key="search-icon"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="24"
              height="24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500">
            No products available.
          </div>
        ) : (
          <table className="w-full border border-orange-300 rounded-lg">
            <thead className="bg-orange-100">
              <tr>
                <th className="px-6 py-4 text-left">#</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product.id} className="border-t border-orange-300">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.description}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setEditModalOpen(true);
                      }}
                      className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setDeleteModalOpen(true);
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onProductAdded={loadProducts}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        product={selectedProduct}
        onProductUpdated={loadProducts}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        productName={selectedProduct?.name || ""}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Products;
