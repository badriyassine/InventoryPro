const BASE_URL = "http://localhost/inventory-backend/api";

// Generic API request function
async function apiFetch(endpoint, method = "GET", body = null) {
  const options = {
    method,
    credentials: "include", // send session cookies
    headers: {},
  };

  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  } else if (method === "POST") {
    // If POST but no body, remove Content-Type to avoid unnecessary preflight
    // Here, no body, so no Content-Type header set
  }

  const response = await fetch(`${BASE_URL}/${endpoint}`, options);

  // Get response text first to handle non-JSON responses
  const responseText = await response.text();

  // Try to parse as JSON
  let json;
  try {
    json = JSON.parse(responseText);
  } catch (parseError) {
    console.error("JSON parse error:", parseError);
    console.error("Response text:", responseText);
    throw new Error(
      "Server returned invalid JSON. Check server logs for PHP errors."
    );
  }

  if (!response.ok) {
    const errorMessage =
      json.message || `HTTP error! Status: ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.response = json;
    throw error;
  }

  return json;
}

// PRODUCTS
export const getProducts = () => apiFetch("products/get.php", "GET");
export const addProduct = (product) =>
  apiFetch("products/add.php", "POST", product);
export const updateProduct = (id, product) =>
  apiFetch("products/update.php", "POST", { id, ...product });
export const deleteProduct = (id, user_id) =>
  apiFetch("products/delete.php", "POST", { id, user_id });

// STOCK
export const getStock = () => apiFetch("stock/get.php", "GET");
export const addStock = (product_id, quantity, notes = "") =>
  apiFetch("stock/add.php", "POST", { product_id, quantity, notes });
export const updateStock = (id, quantity, notes = "") =>
  apiFetch("stock/update.php", "POST", { id, quantity, notes });
export const deleteStock = (id) => apiFetch("stock/delete.php", "POST", { id });

// SALES
export const getSales = () => apiFetch("sales/get.php", "GET");
export const addSale = (product_id, quantity, price, notes = "") =>
  apiFetch("sales/add.php", "POST", {
    product_id,
    quantity,
    price,
    notes,
  });
export const deleteSale = (id) => apiFetch("sales/delete.php", "POST", { id });

// USER (Profile)
export const getUserProfile = () => apiFetch("user/get.php", "GET");
export const updateUserProfile = (id, username, email) =>
  apiFetch("user/update.php", "POST", { id, username, email });
export const changeUserPassword = (id, old_password, new_password) =>
  apiFetch("user/change_password.php", "POST", {
    id,
    old_password,
    new_password,
  });

export const deleteUserByAdmin = (id) =>
  apiFetch("user/delete_by_admin.php", "POST", { id });

export const deleteUser = (userId) =>
  apiFetch("user/delete_user.php", "POST", { id: userId });
export const getAllUsers = () => apiFetch("user/get_all.php", "GET");

// Fixed delete account function - only sends password
export const deleteUserAccount = async (password) => {
  try {
    console.log("Sending delete request with password");
    const response = await fetch(`${BASE_URL}/user/delete.php`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    // Get response text for debugging
    const responseText = await response.text();
    console.log("Raw response:", responseText);

    // Try to parse as JSON
    let json;
    try {
      json = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Response text:", responseText);
      throw new Error(
        "Server returned invalid JSON. Check console for details."
      );
    }

    if (!response.ok) {
      const errorMessage =
        json.message || `HTTP error! Status: ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.response = json;
      throw error;
    }

    return json;
  } catch (error) {
    console.error("Delete account API error:", error);
    throw error;
  }
};


// USER - Avatar Upload (uses FormData, not apiFetch)
export const uploadAvatar = async (avatarFile) => {
  const formData = new FormData();
  formData.append("avatar", avatarFile);

  const response = await fetch(`${BASE_URL}/user/uploadAvatar.php`, {
    method: "POST",
    credentials: "include",
    body: formData,
    // DO NOT set Content-Type — browser sets it automatically for FormData
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to upload avatar");
  }

  return await response.json();
};




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

// NOTIFICATIONS
export const getNotifications = () => apiFetch("notifications/get.php", "GET");
export const addNotification = (message, targetComponent = null) =>
  apiFetch("notifications/add.php", "POST", { message, targetComponent });
export const deleteNotifications = () =>
  apiFetch("notifications/delete.php", "POST");
export const markNotificationsAsSeen = () =>
  apiFetch("notifications/mark_seen.php", "POST");

// DASHBOARD
export const getDashboardStats = () => apiFetch("dashboard/stats.php", "GET");

export { apiFetch };
