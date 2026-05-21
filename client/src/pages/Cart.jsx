import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import "../product.css";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";

function Cart() {

    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const userString = localStorage.getItem("user");
            if (!userString) {
                setLoading(false);
                return;
            }
            const user = JSON.parse(userString);
            const res = await axios.get(
                `http://localhost:3000/cart-total/${user._id}`,
                { withCredentials: true }
            );
            setCart(res.data.cart || []);
            setTotal(res.data.totalAmount || 0);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (cartItemId) => {
        try {
            const userString = localStorage.getItem("user");
            if (!userString) return;
            const user = JSON.parse(userString);
            await axios.post(
                "http://localhost:3000/removeitem",
                { userId: user._id, cartItemId },
                { withCredentials: true }
            );
            fetchCart();
        } catch (err) {
            console.log(err);
        }
    };

    // Navigate to checkout page instead of handling payment here
    const handleProceedToCheckout = () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        navigate("/checkout");
    };

    if (loading) {
        return (
            <div className="home-wrapper">
                <Navbar />
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="home-wrapper">
            <Navbar />
            <div className="products-container">

                <div className="section-header">
                    <h1>Your Cart</h1>
                    <p className="section-subtitle">
                        {cart.length > 0 ? `${cart.length} item(s) in your cart` : "Your cart is empty"}
                    </p>
                </div>

                {cart.length === 0 ? (
                    <div className="no-products-message">
                        <p>No items in cart yet. Start shopping!</p>
                        <button className="home-button-go" onClick={() => navigate("/home")} style={{ marginTop: "15px" }}>
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="products-wrapper">
                            {cart.map((item) => (
                                <div className="product-item" key={item._id}>
                                    {item.productId ? (
                                        <>
                                            <div className="product-img-container">
                                                <img
                                                    src={item.productId.image}
                                                    alt={item.productId.name}
                                                    className="product-img"
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/250x250?text=No+Image";
                                                    }}
                                                />
                                            </div>

                                            <div className="product-info-container">
                                                <h3 className="product-title">{item.productId.name}</h3>

                                                <div className="price-container">
                                                    <span className="price">₹{item.productId.price}</span>
                                                </div>

                                                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                                                    <div style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        background: "#f5f5f5",
                                                        padding: "8px 12px",
                                                        borderRadius: "6px"
                                                    }}>
                                                        <span>Quantity:</span>
                                                        <span style={{ fontWeight: "bold" }}>{item.quantity}</span>
                                                    </div>

                                                    <div style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        background: "#f5f5f5",
                                                        padding: "8px 12px",
                                                        borderRadius: "6px"
                                                    }}>
                                                        <span>Subtotal:</span>
                                                        <span style={{ fontWeight: "bold", color: "#000" }}>
                                                            ₹{Number(item.productId.price) * item.quantity}
                                                        </span>
                                                    </div>

                                                    <button
                                                        className="cart-btn"
                                                        style={{ background: "#d32f2f" }}
                                                        onClick={() => removeItem(item._id)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="product-info-container">
                                            <h3 className="product-title" style={{ color: "#d32f2f" }}>
                                                Product Unavailable
                                            </h3>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div style={{
                            background: "#fff",
                            border: "1px solid #eee",
                            borderRadius: "12px",
                            padding: "25px 30px",
                            maxWidth: "420px",
                            margin: "30px auto",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
                        }}>
                            <h2 style={{ marginBottom: "15px", fontSize: "1.2rem" }}>Order Summary</h2>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                <span style={{ color: "#555" }}>Items ({cart.length})</span>
                                <span>₹{total}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                                <span style={{ color: "#555" }}>Shipping</span>
                                <span style={{ color: "#00b300", fontWeight: "600" }}>FREE</span>
                            </div>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                borderTop: "2px solid #000",
                                paddingTop: "15px",
                                marginBottom: "20px"
                            }}>
                                <strong style={{ fontSize: "1.1rem" }}>Total</strong>
                                <strong style={{ fontSize: "1.1rem" }}>₹{total}</strong>
                            </div>

                            <button
                                className="cart-btn"
                                onClick={handleProceedToCheckout}
                                style={{ background: "#000", width: "100%", fontSize: "1rem", padding: "14px" }}
                            >
                                Proceed to Checkout
                            </button>
                        </div>

                        <div style={{ textAlign: "center" }}>
                            <button
                                className="home-button-go"
                                onClick={() => navigate("/home")}
                                type="button"
                            >
                                ← Continue Shopping
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Cart;