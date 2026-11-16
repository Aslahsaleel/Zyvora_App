import api from "./api";

export async function loginUser(username, password) {
  const { data } = await api.post("/api/auth/login", { username, password });
  return data;
}

export async function logoutUser() {
  const { data } = await api.post("/api/auth/logout");
  return data;
}

export async function registerUser(form) {
  const { data } = await api.post("/api/users/register", { ...form, role: "CUSTOMER" });
  return data;
}
