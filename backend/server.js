const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");

dotenv.config();
connectDB();

const app = express();

/* 🔴 THESE TWO LINES MUST COME FIRST */
app.use(cors());
app.use(express.json());

/* 🔴 ROUTES COME AFTER */
app.use("/api/auth", require("./Routes/authRoutes"));
app.use("/api/products", require("./Routes/productRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
