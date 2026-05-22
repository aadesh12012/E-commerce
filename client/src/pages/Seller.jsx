import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Seller() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("add");

    // Add Product State
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [info, setInfo] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Orders & Earnings State
    const [orders, setOrders] = useState([]);
    const [earnings, setEarnings] = useState({ totalEarnings: 0, transferredEarnings: 0, pendingEarnings: 0 });
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [loadingEarnings, setLoadingEarnings] = useState(false);

    // Payout Details State
    const [upiId, setUpiId] = useState("");
    const [bankAccount, setBankAccount] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [accountHolderName, setAccountHolderName] = useState("");
    const [payoutMsg, setPayoutMsg] = useState("");
    const [payoutError, setPayoutError] = useState("");

    // Load seller info from localStorage
    const seller = JSON.parse(localStorage.getItem("seller") || "{}");

    useEffect(() => {
        if (activeTab === "orders") fetchOrders();
        if (activeTab === "earnings") { fetchOrders(); fetchEarnings(); }
        if (activeTab === "payout") loadPayoutDetails();
    }, [activeTab]);

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const res = await axios.get("http://localhost:3000/seller/orders", { withCredentials: true });
            setOrders(res.data.orders || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingOrders(false);
        }
    };

    const fetchEarnings = async () => {
        setLoadingEarnings(true);
        try {
            const res = await axios.get("http://localhost:3000/seller/earnings", { withCredentials: true });
            setEarnings({
                totalEarnings: res.data.totalEarnings || 0,
                transferredEarnings: res.data.transferredEarnings || 0,
                pendingEarnings: res.data.pendingEarnings || 0
            });
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingEarnings(false);
        }
    };

    const loadPayoutDetails = () => {
        // Pre-fill from saved seller data in localStorage
        if (seller.upiId) setUpiId(seller.upiId);
        if (seller.bankAccount) setBankAccount(seller.bankAccount);
        if (seller.ifscCode) setIfscCode(seller.ifscCode);
        if (seller.accountHolderName) setAccountHolderName(seller.accountHolderName);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");
        if (!name || !price || !image || !info) { setError("All fields are required"); return; }
        try {
            const res = await axios.post("http://localhost:3000/addproduct", { name, price, image, info }, { withCredentials: true });
            if (res.data.success) {
                setSuccess("Product added successfully!");
                setName(""); setPrice(""); setImage(""); setInfo("");
            } else {
                setError(res.data.message || "Failed to add product");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    const handleSavePayoutDetails = async (e) => {
        e.preventDefault();
        setPayoutMsg(""); setPayoutError("");
        try {
            const res = await axios.post(
                "http://localhost:3000/seller/payout-details",
                { upiId, bankAccount, ifscCode, accountHolderName },
                { withCredentials: true }
            );
            if (res.data.success) {
                setPayoutMsg("Payout details saved successfully!");
                // Update localStorage
                const updatedSeller = { ...seller, upiId, bankAccount, ifscCode, accountHolderName };
                localStorage.setItem("seller", JSON.stringify(updatedSeller));
            } else {
                setPayoutError(res.data.message || "Failed to save payout details");
            }
        } catch (err) {
            setPayoutError(err.response?.data?.message || "Something went wrong.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("seller");
        navigate("/sellerlogin");
    };

    // Styles
    const styles = {
        wrapper: {
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            color: "#fff",
            paddingTop: "60px"
        },
        header: {
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "16px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
        },
        logo: { fontSize: "1.3rem", fontWeight: "700", color: "#a78bfa", letterSpacing: "0.5px" },
        logoutBtn: {
            background: "rgba(255,59,59,0.15)",
            color: "#ff6b6b",
            border: "1px solid rgba(255,59,59,0.3)",
            padding: "8px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "600",
            transition: "all 0.3s ease"
        },
        container: { maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" },
        welcome: {
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "20px 30px",
            marginBottom: "30px",
            backdropFilter: "blur(10px)"
        },
        tabs: { display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" },
        tabBtn: (active) => ({
            padding: "10px 20px",
            borderRadius: "8px",
            border: active ? "none" : "1px solid rgba(255,255,255,0.2)",
            background: active ? "linear-gradient(135deg, #6c63ff, #a78bfa)" : "rgba(255,255,255,0.05)",
            color: active ? "#fff" : "rgba(255,255,255,0.7)",
            cursor: "pointer",
            fontWeight: active ? "600" : "400",
            fontSize: "0.95rem",
            transition: "all 0.3s ease"
        }),
        card: {
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "30px",
            backdropFilter: "blur(10px)"
        },
        input: {
            width: "100%",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "10px",
            padding: "12px 16px",
            color: "#fff",
            fontSize: "0.95rem",
            marginBottom: "15px",
            outline: "none",
            boxSizing: "border-box",
            transition: "all 0.3s ease"
        },
        submitBtn: {
            background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "12px 28px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            width: "100%",
            marginTop: "5px",
            transition: "all 0.3s ease"
        },
        statCard: (color) => ({
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "20px 25px",
            flex: "1 1 200px",
            backdropFilter: "blur(10px)"
        }),
        orderItem: {
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "18px 20px",
            marginBottom: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px"
        }
    };

    return (
        <div style={styles.wrapper}>
            {/* Header */}
            <div style={styles.header}>
                <span style={styles.logo}>Seller Dashboard</span>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
                        {seller.email || "Seller"}
                    </span>
                    <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div style={styles.container}>
                {/* Welcome Banner */}
                <div style={styles.welcome}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "600" }}>
                            Welcome back, <span style={{ color: "#a78bfa" }}>{seller.name || "Seller"}</span>!
                        </h2>
                        <p style={{ margin: "5px 0 0", color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>
                            Manage your products, track orders and earnings from here.
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div style={styles.tabs}>
                    {["add", "orders", "earnings", "payout"].map(tab => (
                        <button
                            key={tab}
                            style={styles.tabBtn(activeTab === tab)}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === "add" && " Add Product"}
                            {tab === "orders" && " My Orders"}
                            {tab === "earnings" && " Earnings"}
                            {tab === "payout" && " Payout Details"}
                        </button>
                    ))}
                </div>

                {/* ─── ADD PRODUCT TAB ─── */}
                {activeTab === "add" && (
                    <div style={styles.card}>
                        <h2 style={{ marginBottom: "25px", fontSize: "1.3rem", fontWeight: "600" }}>Add New Product</h2>
                        {error && <p style={{ color: "#ff6b6b", fontWeight: "600", marginBottom: "15px", background: "rgba(255, 107, 107, 0.1)", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(255, 107, 107, 0.2)" }}>{error}</p>}
                        {success && <p style={{ color: "#a78bfa", fontWeight: "600", marginBottom: "15px", background: "rgba(167, 139, 250, 0.1)", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(167, 139, 250, 0.2)" }}>{success}</p>}
                        <form onSubmit={handleAddProduct}>
                            <input style={styles.input} type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required />
                            <input style={styles.input} type="number" placeholder="Price (₹)" value={price} onChange={e => setPrice(e.target.value)} required />
                            <input style={styles.input} type="text" placeholder="Image URL" value={image} onChange={e => setImage(e.target.value)} required />
                            <textarea
                                style={{ ...styles.input, height: "100px", resize: "vertical" }}
                                placeholder="Product Description"
                                value={info}
                                onChange={e => setInfo(e.target.value)}
                                required
                            />
                            <button type="submit" style={styles.submitBtn}>Add Product</button>
                        </form>
                    </div>
                )}

                {/* ─── MY ORDERS TAB ─── */}
                {activeTab === "orders" && (
                    <div style={styles.card}>
                        <h2 style={{ marginBottom: "25px", fontSize: "1.3rem", fontWeight: "600" }}>
                            My Orders <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", fontWeight: "400" }}>({orders.length})</span>
                        </h2>
                        {loadingOrders ? (
                            <p style={{ color: "rgba(255,255,255,0.6)" }}>Loading orders...</p>
                        ) : orders.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>
                                <p style={{ fontSize: "0.9rem", fontStyle: "italic" }}>No orders yet. Once customers buy your products, they'll appear here.</p>
                            </div>
                        ) : (
                            orders.map(order => (
                                <div key={order._id} style={styles.orderItem}>
                                    <div>
                                        <p style={{ fontWeight: "600", margin: 0 }}>{order.productId?.name || "Product"}</p>
                                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", margin: "4px 0 0" }}>
                                            Buyer: {order.userId?.name || "Unknown"} • {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", margin: "2px 0 0", fontFamily: "monospace" }}>
                                            Payment ID: {order.paymentId}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <p style={{ color: "#a78bfa", fontWeight: "700", fontSize: "1.1rem", margin: 0 }}>
                                            ₹{order.amount}
                                        </p>
                                        <span style={{
                                            background: order.paymentStatus === "successful" ? "rgba(167, 139, 250, 0.1)" : "rgba(255, 152, 0, 0.1)",
                                            color: order.paymentStatus === "successful" ? "#a78bfa" : "#ffa726",
                                            padding: "4px 12px",
                                            borderRadius: "20px",
                                            fontSize: "0.75rem",
                                            fontWeight: "600",
                                            border: order.paymentStatus === "successful" ? "1px solid rgba(167, 139, 250, 0.3)" : "1px solid rgba(255, 152, 0, 0.3)"
                                        }}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ─── EARNINGS TAB ─── */}
                {activeTab === "earnings" && (
                    <div>
                        {loadingEarnings ? (
                            <p style={{ color: "rgba(255,255,255,0.6)" }}>Calculating earnings...</p>
                        ) : (
                            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
                                <div style={styles.statCard("#a78bfa")}>
                                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", margin: "0 0 8px", fontWeight: "500" }}>Total Earnings</p>
                                    <h2 style={{ color: "#a78bfa", margin: 0, fontSize: "2rem", fontWeight: "700" }}>₹{earnings.totalEarnings}</h2>
                                </div>
                                <div style={styles.statCard("#ffa726")}>
                                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", margin: "0 0 8px", fontWeight: "500" }}>Pending Payout</p>
                                    <h2 style={{ color: "#ffa726", margin: 0, fontSize: "2rem", fontWeight: "700" }}>₹{earnings.pendingEarnings}</h2>
                                </div>
                                <div style={styles.statCard("#6ee7b7")}>
                                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", margin: "0 0 8px", fontWeight: "500" }}>Transferred</p>
                                    <h2 style={{ color: "#a78bfa", margin: 0, fontSize: "2rem", fontWeight: "700" }}>₹{earnings.transferredEarnings}</h2>
                                </div>
                            </div>
                        )}

                        <div style={styles.card}>
                            <h2 style={{ marginBottom: "25px", fontSize: "1.3rem", fontWeight: "600" }}>Order Breakdown</h2>
                            {orders.length === 0 ? (
                                <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "30px 0" }}>No orders yet</p>
                            ) : (
                                orders.map(order => (
                                    <div key={order._id} style={styles.orderItem}>
                                        <div>
                                            <p style={{ fontWeight: "600", margin: 0 }}>{order.productId?.name || "Product"}</p>
                                            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", margin: "4px 0 0" }}>
                                                {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                            </p>
                                        </div>
                                        <p style={{ color: "#a78bfa", fontWeight: "700", margin: 0 }}>₹{order.amount}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* ─── PAYOUT DETAILS TAB ─── */}
                {activeTab === "payout" && (
                    <div style={styles.card}>
                        <h2 style={{ marginBottom: "8px", fontSize: "1.3rem", fontWeight: "600" }}>Bank / UPI Payout Details</h2>
                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "25px" }}>
                            Admin will use these details to manually transfer your earnings.
                        </p>

                        {payoutMsg && <p style={{ color: "#a78bfa", fontWeight: "600", marginBottom: "15px", background: "rgba(167, 139, 250, 0.1)", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(167, 139, 250, 0.2)" }}>{payoutMsg}</p>}
                        {payoutError && <p style={{ color: "#ff6b6b", fontWeight: "600", marginBottom: "15px", background: "rgba(255, 107, 107, 0.1)", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(255, 107, 107, 0.2)" }}>{payoutError}</p>}

                        <form onSubmit={handleSavePayoutDetails}>
                            <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>UPI ID</label>
                            <input style={styles.input} type="text" placeholder="e.g. seller@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />

                            <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Account Holder Name</label>
                            <input style={styles.input} type="text" placeholder="Full name on bank account" value={accountHolderName} onChange={e => setAccountHolderName(e.target.value)} />

                            <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Bank Account Number</label>
                            <input style={styles.input} type="text" placeholder="Account Number" value={bankAccount} onChange={e => setBankAccount(e.target.value)} />

                            <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>IFSC Code</label>
                            <input style={styles.input} type="text" placeholder="e.g. HDFC0001234" value={ifscCode} onChange={e => setIfscCode(e.target.value)} />

                            <button type="submit" style={styles.submitBtn}>Save Payout Details</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Seller;