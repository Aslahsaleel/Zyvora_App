import api from "./api";

export async function getMyOrders() {
  const { data } = await api.get("/api/orders");
  return data;
}
