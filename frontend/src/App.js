import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "./api";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";

function App() {
  const [products, setProducts] = useState([]);

  // ✅ cart with persistence
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // 🔄 fetch products
  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // 💾 save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ➕ add to cart (with quantity)
  const addToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // ➕ increase quantity
  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // ➖ decrease quantity
  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // 🔍 search + category filter
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || p.category === category;

    return matchesSearch && matchesCategory;
  });

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/cart">🧺 Cart ({cart.length})</Link> |{" "}
        {!isLoggedIn && <Link to="/login">Login</Link>} |{" "}
        {!isLoggedIn && <Link to="/register">Register</Link>} |{" "}
        {isLoggedIn && <button onClick={logout}>Logout</button>}
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div className="container">
              <h1>🛒 Online Grocery Store</h1>

              {/* 🔍 FILTERS */}
              <div className="filters">
                <input
                  type="text"
                  placeholder="Search groceries..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="category-select"
                >
                  <option value="All">All</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Essentials">Essentials</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Household">Household</option>
                  <option value="Grains">Grains</option>
                </select>
              </div>

              {/* 🛍️ PRODUCTS */}
              <div className="products-grid">
                {filteredProducts.map((p) => (
                  <div className="product-card" key={p._id}>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="product-image"
                    />
                    <h3>{p.name}</h3>
                    <p>₹ {p.price}</p>
                    <button onClick={() => addToCart(p)}>
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          }
        />

        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />

        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/" /> : <Register />}
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              increaseQty={increaseQty}
              decreaseQty={decreaseQty}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
