import api from "./api";

export async function addToCart(username, productId, quantity = 1) {
  const { data } = await api.post("/api/cart/add", { username, productId, quantity });
  return data;
}
export async function getCartItemCount(username) {
  const { data } = await api.get("/api/cart/items/count", { params: { username } });
  return data;
}
export async function getCartItems() {
  const { data } = await api.get("/api/cart/items");
  return data;
}
export async function updateCartItem(username, productId, quantity) {
  const { data } = await api.put("/api/cart/update", { username, productId, quantity });
  return data;
}
export async function removeCartItem(username, productId) {
  const { data } = await api.delete("/api/cart/delete", { data: { username, productId } });
  return data;
}
