import api from "./api";

export async function getProducts(category = "") {
  const { data } = await api.get("/api/products", {
    params: category ? { category } : {}
  });
  return data;
}
