function Cart({ cart, increaseQty, decreaseQty }) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container">
      <h1>🧺 Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty. Add items to proceed to checkout.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div className="cart-item" key={item._id}>
              <img
                src={item.image}
                alt={item.name}
                className="cart-image"
              />

              <div className="cart-details">
                <h3>{item.name}</h3>
                <p>₹ {item.price}</p>

                <div className="qty-controls">
                  <button onClick={() => decreaseQty(item._id)}>
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item._id)}>
                    +
                  </button>
                </div>
              </div>

              <p>₹ {item.price * item.quantity}</p>
            </div>
          ))}

          <div className="cart-summary">
            <h2>Total: ₹ {total}</h2>
          </div>

          <button
            onClick={() => {
              alert("✅ Order placed successfully!");
              localStorage.removeItem("cart");
              window.location.href = "/";
            }}
            style={{
              backgroundColor: "#2e7d32",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              marginTop: "10px",
              cursor: "pointer",
            }}
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
