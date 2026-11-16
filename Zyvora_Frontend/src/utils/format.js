export function formatPrice(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  });
}
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const body = error?.response?.data;
  if (typeof body === "string" && body.trim()) return body;
  return body?.error || body?.message || error?.message || fallback;
}
