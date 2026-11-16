import api from "./api";

export async function getOverallBusiness() {
  const { data } = await api.get("/admin/business/overall");
  return data;
}
export async function getDailyBusiness(date) {
  const { data } = await api.get("/admin/business/daily", { params: { date } });
  return data;
}
export async function getMonthlyBusiness(month, year) {
  const { data } = await api.get("/admin/business/monthly", { params: { month, year } });
  return data;
}
export async function getYearlyBusiness(year) {
  const { data } = await api.get("/admin/business/yearly", { params: { year } });
  return data;
}
export async function createProduct(product) {
  const { data } = await api.post("/admin/products/add", product);
  return data;
}
export async function deleteProduct(productId) {
  const { data } = await api.delete("/admin/products/delete", { data: { productId: Number(productId) } });
  return data;
}
export async function modifyUser(user) {
  const { data } = await api.put("/admin/user/modify", {
    userId: Number(user.userId),
    username: user.username,
    email: user.email,
    role: user.role
  });
  return data;
}
