import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "./api";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";


function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const removeFromCart = (id) => {
  setCart(cart.filter((item) => item._id !== id));
};

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const addToCart = (product) => {
    const exists = cart.find((item) => item._id === product._id);
    if (exists) return;
    setCart([...cart, product]);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/cart">🧺 Cart ({cart.length})</Link>
 |{" "}
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

              <div className="products-grid">
                {products.map((p) => (
                  <div className="product-card" key={p._id}>
  <img src={p.image} alt={p.name} className="product-image" />
  <h3>{p.name}</h3>
  <p>₹ {p.price}</p>
  <button onClick={() => addToCart(p)}>Add to Cart</button>
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
    <Cart cart={cart} removeFromCart={removeFromCart} />
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
