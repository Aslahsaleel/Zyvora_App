
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { getProducts } from "../services/productService";
import {
  addToCart,
  getCartItemCount
} from "../services/cartService";

import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import { Loading, Notice } from "../components/Status";
import { getErrorMessage } from "../utils/format";

export default function Products() {

  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addingId, setAddingId] = useState(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cartCount, setCartCount] = useState(0);

  // Load products from Spring Boot backend
  useEffect(() => {

    async function load() {

      try {

        const result = await getProducts();

        setProducts(result.products || []);

        if (result.user?.name) {

          const count = await getCartItemCount(
            result.user.name
          );

          setCartCount(Number(count) || 0);
        }

      } catch (err) {

        setError(
          getErrorMessage(
            err,
            "Unable to load the collection."
          )
        );

      } finally {

        setLoading(false);

      }
    }

    load();

  }, []);

  // Search and sort products
  const visible = useMemo(() => {

    const filtered = products.filter((product) => {

      const searchText = `
        ${product.name || ""}
        ${product.description || ""}
        ${product.category || ""}
      `.toLowerCase();

      return searchText.includes(
        query.trim().toLowerCase()
      );

    });

    if (sort === "price-low") {

      filtered.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );

    }

    if (sort === "price-high") {

      filtered.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );

    }

    return filtered;

  }, [products, query, sort]);

  // Add product to cart
  async function handleAdd(product) {

    setAddingId(product.product_id);
    setMessage("");
    setError("");

    try {

      await addToCart(
        user.username,
        product.product_id,
        1
      );

      const count = await getCartItemCount(
        user.username
      );

      setCartCount(Number(count) || 0);

      setMessage(
        `${product.name} has been added to your bag.`
      );

    } catch (err) {

      setError(
        getErrorMessage(
          err,
          "Unable to add this piece to your bag."
        )
      );

    } finally {

      setAddingId(null);

    }
  }

  return (

    <main className="collection-page">

      {/* Collection heading */}

      <section className="collection-intro">

        <span className="eyebrow">
          THE ZYVORA COLLECTION / 001
        </span>

        <h1>
          Considered <em>pieces.</em>
        </h1>

        <p>
          A wardrobe built around ease, individuality
          and the details that matter.
        </p>

        <div className="collection-meta">

          <span>
            {products.length} PIECES IN THE EDIT
          </span>

          <span>
            YOUR BAG · {cartCount}
          </span>

        </div>

      </section>

      {/* Premium search bar and sorting */}

      <section className="collection-controls">

        <div className="collection-search-wrap">

          <label
            className="collection-search"
            htmlFor="product-search"
          >

            <Search
              size={19}
              strokeWidth={1.7}
            />

            <input
              id="product-search"
              type="search"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search by product, style or category..."
              aria-label="Search fashion products"
            />

            {query && (

              <button
                className="search-clear"
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <X size={17} />
              </button>

            )}

          </label>

          <span className="search-hint">
            FIND YOUR NEXT FAVOURITE PIECE
          </span>

        </div>

        {/* Sorting */}

        <label className="sort-field">

          <SlidersHorizontal size={16} />

          <span>Sort</span>

          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
          >

            <option value="featured">
              Featured
            </option>

            <option value="price-low">
              Price: low to high
            </option>

            <option value="price-high">
              Price: high to low
            </option>

          </select>

        </label>

      </section>

      {/* Search results count */}

      {!loading && (

        <div className="search-result-count">

          {query
            ? `${visible.length} RESULTS FOR "${query}"`
            : `SHOWING ${visible.length} PIECES`}

        </div>

      )}

      {/* Notifications */}

      <div className="collection-feedback">

        <Notice type="success">
          {message}
        </Notice>

        <Notice>
          {error}
        </Notice>

      </div>

      {/* Product collection */}

      {loading ? (

        <Loading label="Curating the collection..." />

      ) : visible.length > 0 ? (

        <section className="product-grid">

          {visible.map((product) => (

            <ProductCard
              key={product.product_id}
              product={product}
              onAdd={handleAdd}
              adding={
                addingId === product.product_id
              }
            />

          ))}

        </section>

      ) : (

        <div className="empty-state">

          <h2>No pieces found.</h2>

          <p>
            Try another search or clear your filters.
          </p>

          <button
            className="button button-outline"
            onClick={() => setQuery("")}
          >
            Clear search
          </button>

        </div>

      )}

    </main>

  );
}
