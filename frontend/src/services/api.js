const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export const productsAPI = {
  getAll: () => fetchAPI("/products"),
  getById: (id) => fetchAPI(`/products/${id}`),
  create: (data) =>
    fetchAPI("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    fetchAPI(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    fetchAPI(`/products/${id}`, {
      method: "DELETE",
    }),
};

export const categoriesAPI = {
  getAll: () => fetchAPI("/categories"),
  getById: (id) => fetchAPI(`/categories/${id}`),
  create: (data) =>
    fetchAPI("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    fetchAPI(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    fetchAPI(`/categories/${id}`, {
      method: "DELETE",
    }),
};

export const newsAPI = {
  getAll: () => fetchAPI("/news"),
  getById: (id) => fetchAPI(`/news/${id}`),
  create: (data) =>
    fetchAPI("/news", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    fetchAPI(`/news/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    fetchAPI(`/news/${id}`, {
      method: "DELETE",
    }),
};

export const ordersAPI = {
  getAll: () => fetchAPI("/orders"),
  getById: (id) => fetchAPI(`/orders/${id}`),
  create: (data) =>
    fetchAPI("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    fetchAPI(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    fetchAPI(`/orders/${id}`, {
      method: "DELETE",
    }),
};

export const partnersAPI = {
  getAll: () => fetchAPI("/partners"),
  create: (data) =>
    fetchAPI("/partners", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    fetchAPI(`/partners/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    fetchAPI(`/partners/${id}`, {
      method: "DELETE",
    }),
};

export const pagesAPI = {
  getAll: () => fetchAPI("/pages"),
  getBySlug: (slug) => fetchAPI(`/pages/${slug}`),
  create: (data) =>
    fetchAPI("/pages", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    fetchAPI(`/pages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    fetchAPI(`/pages/${id}`, {
      method: "DELETE",
    }),
};

export const configAPI = {
  get: () => fetchAPI("/config"),
  update: (data) =>
    fetchAPI("/config", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export const authAPI = {
  login: (email, password) =>
    fetchAPI("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

export default {
  products: productsAPI,
  categories: categoriesAPI,
  news: newsAPI,
  orders: ordersAPI,
  partners: partnersAPI,
  pages: pagesAPI,
  config: configAPI,
  auth: authAPI,
};
