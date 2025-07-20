const BASE_URL = "http://localhost/inventory-backend/api";

// Generic API request function
async function apiFetch(endpoint, method = "POST", body = null) {
  const options = {
    method,
    credentials: "include", // send session cookies
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}/${endpoint}`, options);
  const json = await response.json();

  if (!response.ok) {
    // Throw error with backend message if available
    const errorMessage = json.message || `HTTP error! Status: ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.response = json;
    throw error;
  }

  return json;
}

// PRODUCTS
export const getProducts = () => apiFetch("products/get.php", "POST");
export const addProduct = (product) =>
  apiFetch("products/add.php", "POST", product);
export const updateProduct = (id, product) =>
  apiFetch("products/update.php", "POST", { id, ...product });
export const deleteProduct = (id, user_id) =>
  apiFetch("products/delete.php", "POST", { id, user_id });

// STOCK
export const getStock = () => apiFetch("stock/get.php", "POST");
export const addStock = (product_id, quantity, notes = "") =>
  apiFetch("stock/add.php", "POST", { product_id, quantity, notes });
export const updateStock = (id, quantity, notes = "") =>
  apiFetch("stock/update.php", "POST", { id, quantity, notes });
export const deleteStock = (id) => apiFetch("stock/delete.php", "POST", { id });

// SALES
export const getSales = () => apiFetch("sales/get.php", "POST");
export const addSale = (product_id, quantity, price, notes = "") =>
  apiFetch("sales/add.php", "POST", {
    product_id,
    quantity,
    price,
    notes,
  });
export const deleteSale = (id) => apiFetch("sales/delete.php", "POST", { id });

// USER (Profile)
export const updateUserProfile = (id, username, email) =>
  apiFetch("user/update.php", "POST", { id, name: username, email });
export const changeUserPassword = (id, old_password, new_password) =>
  apiFetch("user/change_password.php", "POST", {
    id,
    old_password,
    new_password,
  });

// AUTH
export const signup = (username, email, password) =>
  apiFetch("auth/signup.php", "POST", { username, email, password });
export const login = (email, password) =>
  apiFetch("auth/login.php", "POST", { email, password });
export const logout = () => apiFetch("auth/logout.php", "POST");
export const forgotPassword = (email) =>
  apiFetch("auth/forgot-password.php", "POST", { email });
export const resetPassword = (email, code, password) =>
  apiFetch("auth/reset-password.php", "POST", { email, code, password });

// DASHBOARD
export const getDashboardStats = () => apiFetch("dashboard/stats.php", "POST");

export { apiFetch };

