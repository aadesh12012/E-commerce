import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import "../product.css";
import Navbar from "../components/Navbar.jsx";
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoints = [
        "http://localhost:3000/products",
      ];

      let response = null;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          console.log("Trying endpoint:", endpoint);
          response = await axios.get(endpoint, { timeout: 5000 });
          console.log("Success with endpoint:", endpoint);
          console.log("Response data:", response.data);
          break;
        } catch (err) {
          lastError = err;
          console.log("Failed with endpoint:", endpoint);
          continue;
        }
      }

      if (!response) {
        throw lastError || new Error("No endpoints available");
      }

      const productsData = response.data.products || response.data || [];

      if (Array.isArray(productsData)) {
        setProducts(productsData);
      } else {
        throw new Error("Products data is not in expected format");
      }

    } catch (err) {
      console.error("Error fetching products:", err);
      setError(
        err.message ||
        "Failed to load products. Please check your server is running on port 3000"
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };


  const setcartdata = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please login first");
        return;
      }

      const res = await axios.post(
        "http://localhost:3000/addtocart",
        {
          userId: user._id,
          productId: productId
        },
        {
          withCredentials: true
        }
      );

      console.log(res.data);
      alert("Product added to cart");

    } catch (err) {
      console.log(err);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.info.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="home-wrapper">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-wrapper">
        <Navbar />
        <div className="error-container">
          <h2>Error Loading Products</h2>
          <p>{error}</p>
          <div className="error-tips">
            <p><strong>Troubleshooting:</strong></p>
            <ul>
              <li>Make sure your backend server is running on port 3000</li>
              <li>Check that seller routes are properly configured</li>
              <li>Verify the endpoint matches your app.js setup</li>
              <li>Check browser console (F12) for detailed errors</li>
            </ul>
          </div>
          <button onClick={fetchProducts} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="products-container">
        <div className="section-header">
          <h1>Our Products</h1>
          <p className="section-subtitle">
            {filteredProducts.length > 0
              ? `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`
              : "No products available"}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-products-message">
            <p>{searchTerm ? "No products found matching your search." : "No products available at the moment."}</p>
          </div>
        ) : (
          <div className="products-wrapper">
            {filteredProducts.map((product) => (
              <div className="product-item" key={product._id}>
                <div className="product-img-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-img"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/250x250?text=No+Image";
                    }}
                  />
                </div>

                <div className="product-info-container">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.info}</p>

                  <div className="price-container">
                    <span className="price">₹{product.price}</span>
                  </div>

                  <button
                    className="cart-btn"
                    onClick={() => setcartdata(product._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
