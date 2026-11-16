export function Loading({ label = "Loading..." }) {
  return <div className="state-panel"><span className="loader-dot" /><p>{label}</p></div>;
}
export function Notice({ children, type = "error" }) {
  if (!children) return null;
  return <div className={`notice notice-${type}`} role="status">{children}</div>;
}
