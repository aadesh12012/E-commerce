import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import "../App.css";
import "../product.css";

function Checkout() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    
    // Shipping Address Details
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const userString = localStorage.getItem("user");
            if (!userString) {
                setLoading(false);
                navigate("/");
                return;
            }

            const user = JSON.parse(userString);
            // Pre-fill user name
            setName(user.name || "");

            const res = await axios.get(
                `http://localhost:3000/cart-total/${user._id}`,
                { withCredentials: true }
            );

            setCart(res.data.cart || []);
            setTotal(res.data.totalAmount || 0);
        } catch (err) {
            console.log("Error fetching cart details:", err);
            setError("Could not load cart details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setError("");

        if (!address || !city || !zip || !phone) {
            setError("Please fill in all shipping details");
            return;
        }

        try {
            const userString = localStorage.getItem("user");
            if (!userString) return;
            const user = JSON.parse(userString);

            // 1. Create order on backend
            const orderRes = await axios.post(
                "http://localhost:3000/create-order",
                { amount: total },
                { withCredentials: true }
            );

            const order = orderRes.data;

            // 2. Open Razorpay checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_xxxxxxxxx",
                amount: order.amount,
                currency: "INR",
                name: "Black Lake Store",
                description: "E-Commerce Checkout",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 3. Verify payment on backend
                        const verifyRes = await axios.post(
                            "http://localhost:3000/verify-payment",
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                cartItems: cart,
                                userId: user._id
                            },
                            { withCredentials: true }
                        );

                        if (verifyRes.data.success) {
                            // Navigate to Order Success page
                            navigate("/order-success", {
                                state: {
                                    paymentId: response.razorpay_payment_id,
                                    orderId: response.razorpay_order_id,
                                    amount: total
                                }
                            });
                        } else {
                            setError(verifyRes.data.message || "Payment verification failed");
                        }
                    } catch (verifyErr) {
                        console.error("Verification error:", verifyErr);
                        setError(
                            verifyErr.response?.data?.message || 
                            "Payment verification failed. Please contact support."
                        );
                    }
                },
                prefill: {
                    name: name,
                    email: user.email,
                    contact: phone
                },
                theme: {
                    color: "#000000"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("Payment initiation failed:", err);
            setError("Failed to start payment. Please check your backend.");
        }
    };

    if (loading) {
        return (
            <div className="home-wrapper">
                <Navbar />
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading checkout...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="home-wrapper">
            <Navbar />
            <div className="products-container">
                <div className="section-header">
                    <h1>Checkout</h1>
                    <p className="section-subtitle">Complete your purchase</p>
                </div>

                {error && (
                    <p style={{ color: "red", fontWeight: "bold", margin: "10px 0", textAlign: "center" }}>
                        {error}
                    </p>
                )}

                <div className="checkout-content" style={{ display: "flex", flexWrap: "wrap", gap: "40px", marginTop: "20px" }}>
                    {/* Shipping Form */}
                    <div style={{ flex: "1 1 500px", background: "#fff", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                        <h2 style={{ marginBottom: "20px" }}>Shipping Details</h2>
                        <form onSubmit={handlePayment}>
                            <div className="input-group" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Shipping Address"
                                    className="input"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                                <div style={{ display: "flex", gap: "15px" }}>
                                    <input
                                        type="text"
                                        placeholder="City"
                                        className="input"
                                        style={{ flex: 1 }}
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="ZIP / Postal Code"
                                        className="input"
                                        style={{ flex: 1 }}
                                        value={zip}
                                        onChange={(e) => setZip(e.target.value)}
                                        required
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    className="input"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                                <button type="submit" className="submitbtn" style={{ background: "#000", color: "#fff", marginTop: "20px" }}>
                                    Pay ₹{total} via Razorpay
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div style={{ flex: "1 1 350px", background: "#f9f9f9", padding: "30px", borderRadius: "10px", border: "1px solid #ddd" }}>
                        <h2 style={{ marginBottom: "20px" }}>Order Summary</h2>
                        {cart.length === 0 ? (
                            <p>No items in cart</p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                {cart.map((item) => (
                                    <div key={item._id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                                        <div>
                                            <p style={{ fontWeight: "bold", margin: 0 }}>{item.productId?.name}</p>
                                            <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>Qty: {item.quantity}</p>
                                        </div>
                                        <p style={{ fontWeight: "bold", margin: 0 }}>₹{item.productId?.price * item.quantity}</p>
                                    </div>
                                ))}
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", borderTop: "2px solid #000", paddingTop: "15px" }}>
                                    <h3 style={{ margin: 0 }}>Total</h3>
                                    <h3 style={{ margin: 0 }}>₹{total}</h3>
                                </div>
                            </div>
                        )}
                        <button
                            className="home-button-go"
                            onClick={() => navigate("/cart")}
                            style={{ width: "100%", marginTop: "20px" }}
                        >
                            Back to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
