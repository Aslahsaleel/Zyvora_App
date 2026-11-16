import { ShoppingBag, Check } from "lucide-react";
import { formatPrice } from "../utils/format";

export default function ProductCard({ product, onAdd, adding }) {
  const image = product.images?.[0] || product.image_url;
  return <article className="product-card">
    <div className="product-card-image">
      {image ? <img src={image} alt={product.name} loading="lazy" /> : <div className="image-fallback">ZYVORA<br /><span>THE EDIT</span></div>}
      <span className="product-index">ZYVORA / {String(product.product_id).padStart(3, "0")}</span>
      <button className="quick-add" onClick={() => onAdd(product)} disabled={Number(product.stock) <= 0 || adding} aria-label={`Add ${product.name} to cart`}>{adding ? "Adding" : <><ShoppingBag size={17} /> Add</>}</button>
    </div>
    <div className="product-card-info"><div><span className="product-category">THE COLLECTION</span><h3>{product.name}</h3></div><strong>{formatPrice(product.price)}</strong></div>
    <p className="product-description">{product.description}</p>
    {Number(product.stock) <= 0 && <span className="out-stock">Currently unavailable</span>}
  </article>;
}
