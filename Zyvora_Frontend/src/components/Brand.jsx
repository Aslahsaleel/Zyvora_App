import { Link } from "react-router-dom";
export default function Brand({ light = false }) {
  return <Link className={`brand-mark${light ? " brand-mark-light" : ""}`} to="/">ZYVORA<span>.</span></Link>;
}
