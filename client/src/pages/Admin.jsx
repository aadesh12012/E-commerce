import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [payoutInput, setPayoutInput] = useState({});
    const [payoutMsg, setPayoutMsg] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        if (activeTab === "users") fetchUsers();
        if (activeTab === "products") fetchProducts();
        if (activeTab === "sellers") fetchSellers();
        if (activeTab === "orders") fetchOrders();
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:3000/admin/users", { withCredentials: true });
            setUsers(res.data);
        } catch (e) { console.log(e); }
        setLoading(false);
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:3000/admin/products", { withCredentials: true });
            setProducts(res.data);
        } catch (e) { console.log(e); }
        setLoading(false);
    };

    const fetchSellers = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:3000/admin/sellers", { withCredentials: true });
            setSellers(res.data);
        } catch (e) { console.log(e); }
        setLoading(false);
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:3000/admin/orders", { withCredentials: true });
            setOrders(res.data);
        } catch (e) { console.log(e); }
        setLoading(false);
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        try {
            await axios.delete(`http://localhost:3000/admin/user/${id}`, { withCredentials: true });
            fetchUsers();
        } catch (e) { console.log(e); }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await axios.delete(`http://localhost:3000/admin/product/${id}`, { withCredentials: true });
            fetchProducts();
        } catch (e) { console.log(e); }
    };

    const handlePayout = async (sellerId, sellerName) => {
        const amount = payoutInput[sellerId];
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            alert("Please enter a valid payout amount.");
            return;
        }
        if (!window.confirm(`Mark ₹${amount} as paid to ${sellerName}?`)) return;
        try {
            const res = await axios.post(
                "http://localhost:3000/admin/payout-seller",
                { sellerId, amount: Number(amount) },
                { withCredentials: true }
            );
            if (res.data.success) {
                setPayoutMsg(`✅ ${res.data.message}`);
                setPayoutInput(prev => ({ ...prev, [sellerId]: "" }));
                fetchSellers();
                setTimeout(() => setPayoutMsg(""), 4000);
            }
        } catch (e) { console.log(e); }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    // --- Styles ---
    const s = {
        wrapper: {
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
            fontFamily: "'Inter','Segoe UI',sans-serif",
            color: "#fff",
        },
        header: {
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "18px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        logo: { fontSize: "1.5rem", fontWeight: "800", color: "#f59e0b", letterSpacing: "-0.5px" },
        logoutBtn: {
            background: "rgba(255,59,59,0.15)",
            color: "#ff6b6b",
            border: "1px solid rgba(255,59,59,0.3)",
            padding: "8px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.9rem",
        },
        container: { maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" },
        statRow: { display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "30px" },
        statCard: (color) => ({
            flex: "1 1 180px",
            background: `linear-gradient(135deg, ${color}28, ${color}10)`,
            border: `1px solid ${color}44`,
            borderRadius: "14px",
            padding: "22px 24px",
        }),
        tabs: { display: "flex", gap: "10px", marginBottom: "28px", flexWrap: "wrap" },
        tabBtn: (active) => ({
            padding: "10px 22px",
            borderRadius: "8px",
            border: active ? "none" : "1px solid rgba(255,255,255,0.12)",
            background: active ? "linear-gradient(135deg,#f59e0b,#ef4444)" : "rgba(255,255,255,0.05)",
            color: active ? "#fff" : "rgba(255,255,255,0.55)",
            cursor: "pointer",
            fontWeight: active ? "700" : "400",
            fontSize: "0.9rem",
        }),
        card: {
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "28px",
        },
        row: {
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "16px 20px",
            marginBottom: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
        },
        deleteBtn: {
            background: "rgba(239,68,68,0.15)",
            color: "#f87171",
            border: "1px solid rgba(239,68,68,0.3)",
            padding: "7px 16px",
            borderRadius: "7px",
            cursor: "pointer",
            fontSize: "0.85rem",
        },
        badge: (color) => ({
            background: `${color}22`,
            color: color,
            padding: "3px 10px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: "600",
        }),
        payoutInput: {
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "7px",
            padding: "7px 12px",
            color: "#fff",
            width: "100px",
            fontSize: "0.9rem",
            outline: "none",
        },
        payBtn: {
            background: "linear-gradient(135deg,#10b981,#059669)",
            color: "#fff",
            border: "none",
            padding: "7px 14px",
            borderRadius: "7px",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: "600",
        },
    };

    const totalRevenue = orders.filter(o => o.paymentStatus === "successful").reduce((s, o) => s + o.amount, 0);

    return (
        <div style={s.wrapper}>
            {/* Header */}
            <div style={s.header}>
                <span style={s.logo}>🛡 Admin Panel</span>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem" }}>{user.email}</span>
                    <button style={s.logoutBtn} onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div style={s.container}>

                {/* Stats */}
                <div style={s.statRow}>
                    {[
                        { label: "Total Users", value: users.length, color: "#6c63ff", icon: "👥" },
                        { label: "Sellers", value: sellers.length, color: "#f59e0b", icon: "🏪" },
                        { label: "Products", value: products.length, color: "#10b981", icon: "📦" },
                        { label: "Total Revenue", value: `₹${totalRevenue}`, color: "#ef4444", icon: "💰" },
                        { label: "Orders", value: orders.length, color: "#a78bfa", icon: "🧾" },
                    ].map(stat => (
                        <div key={stat.label} style={s.statCard(stat.color)}>
                            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", margin: "0 0 6px" }}>{stat.icon} {stat.label}</p>
                            <h2 style={{ color: stat.color, margin: 0, fontSize: "1.8rem", fontWeight: "800" }}>{stat.value}</h2>
                        </div>
                    ))}
                </div>

                {payoutMsg && (
                    <div style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "8px", padding: "12px 20px", marginBottom: "20px", color: "#6ee7b7" }}>
                        {payoutMsg}
                    </div>
                )}

                {/* Tabs */}
                <div style={s.tabs}>
                    {["users","products","sellers","orders"].map(tab => (
                        <button key={tab} style={s.tabBtn(activeTab === tab)} onClick={() => setActiveTab(tab)}>
                            {tab === "users" && "👥 Users"}
                            {tab === "products" && "📦 Products"}
                            {tab === "sellers" && "🏪 Sellers & Payouts"}
                            {tab === "orders" && "🧾 All Orders"}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.4)" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "10px" }}>⏳</div>
                        <p>Loading...</p>
                    </div>
                ) : (
                    <div style={s.card}>

                        {/* ─── USERS ─── */}
                        {activeTab === "users" && (
                            <>
                                <h2 style={{ marginBottom: "22px" }}>All Users <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "1rem", fontWeight: "400" }}>({users.length})</span></h2>
                                {users.length === 0 ? <p style={{ color: "rgba(255,255,255,0.4)" }}>No users found.</p> : users.map(u => (
                                    <div key={u._id} style={s.row}>
                                        <div>
                                            <p style={{ fontWeight: "600", margin: 0 }}>{u.name}</p>
                                            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", margin: "3px 0 0" }}>{u.email}</p>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <span style={s.badge(u.role === "admin" ? "#f59e0b" : "#6c63ff")}>{u.role}</span>
                                            {u.role !== "admin" && (
                                                <button style={s.deleteBtn} onClick={() => deleteUser(u._id)}>Delete</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* ─── PRODUCTS ─── */}
                        {activeTab === "products" && (
                            <>
                                <h2 style={{ marginBottom: "22px" }}>All Products <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "1rem", fontWeight: "400" }}>({products.length})</span></h2>
                                {products.length === 0 ? <p style={{ color: "rgba(255,255,255,0.4)" }}>No products found.</p> : products.map(p => (
                                    <div key={p._id} style={s.row}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                            <img src={p.image} alt={p.name} style={{ width: "52px", height: "52px", borderRadius: "8px", objectFit: "cover", background: "#333" }} onError={e => { e.target.style.display = "none"; }} />
                                            <div>
                                                <p style={{ fontWeight: "600", margin: 0 }}>{p.name}</p>
                                                <p style={{ color: "#10b981", fontWeight: "700", margin: "3px 0 0", fontSize: "0.95rem" }}>₹{p.price}</p>
                                            </div>
                                        </div>
                                        <button style={s.deleteBtn} onClick={() => deleteProduct(p._id)}>Delete</button>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* ─── SELLERS & PAYOUTS ─── */}
                        {activeTab === "sellers" && (
                            <>
                                <h2 style={{ marginBottom: "22px" }}>Sellers & Payout Management</h2>
                                {sellers.length === 0 ? <p style={{ color: "rgba(255,255,255,0.4)" }}>No sellers found.</p> : sellers.map(sel => (
                                    <div key={sel._id} style={{ ...s.row, flexDirection: "column", alignItems: "flex-start" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: "10px" }}>
                                            <div>
                                                <p style={{ fontWeight: "700", margin: 0, fontSize: "1.05rem" }}>{sel.name}</p>
                                                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", margin: "3px 0 0" }}>{sel.email}</p>
                                            </div>
                                            <span style={s.badge("#f59e0b")}>Seller</span>
                                        </div>

                                        {/* Payout details */}
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "12px", width: "100%", fontSize: "0.85rem" }}>
                                            <div>
                                                <span style={{ color: "rgba(255,255,255,0.4)" }}>UPI: </span>
                                                <span style={{ color: sel.upiId ? "#fff" : "rgba(255,255,255,0.25)" }}>{sel.upiId || "Not set"}</span>
                                            </div>
                                            <div>
                                                <span style={{ color: "rgba(255,255,255,0.4)" }}>Bank: </span>
                                                <span style={{ color: sel.bankAccount ? "#fff" : "rgba(255,255,255,0.25)" }}>{sel.bankAccount || "Not set"}</span>
                                            </div>
                                            <div>
                                                <span style={{ color: "rgba(255,255,255,0.4)" }}>IFSC: </span>
                                                <span style={{ color: sel.ifscCode ? "#fff" : "rgba(255,255,255,0.25)" }}>{sel.ifscCode || "Not set"}</span>
                                            </div>
                                            <div>
                                                <span style={{ color: "rgba(255,255,255,0.4)" }}>Holder: </span>
                                                <span style={{ color: sel.accountHolderName ? "#fff" : "rgba(255,255,255,0.25)" }}>{sel.accountHolderName || "Not set"}</span>
                                            </div>
                                        </div>

                                        {/* Earnings */}
                                        <div style={{ display: "flex", gap: "20px", marginTop: "12px", flexWrap: "wrap" }}>
                                            <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "8px", padding: "8px 16px" }}>
                                                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem" }}>Transferred</span>
                                                <p style={{ color: "#10b981", fontWeight: "700", margin: "2px 0 0" }}>₹{sel.earningsTransferred || 0}</p>
                                            </div>
                                        </div>

                                        {/* Payout Action */}
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "14px" }}>
                                            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>Mark Paid:</span>
                                            <input
                                                type="number"
                                                placeholder="Amount ₹"
                                                style={s.payoutInput}
                                                value={payoutInput[sel._id] || ""}
                                                onChange={e => setPayoutInput(prev => ({ ...prev, [sel._id]: e.target.value }))}
                                            />
                                            <button style={s.payBtn} onClick={() => handlePayout(sel._id, sel.name)}>
                                                Pay Seller
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* ─── ALL ORDERS ─── */}
                        {activeTab === "orders" && (
                            <>
                                <h2 style={{ marginBottom: "22px" }}>All Orders <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "1rem", fontWeight: "400" }}>({orders.length})</span></h2>
                                {orders.length === 0 ? <p style={{ color: "rgba(255,255,255,0.4)" }}>No orders yet.</p> : orders.map(order => (
                                    <div key={order._id} style={s.row}>
                                        <div>
                                            <p style={{ fontWeight: "600", margin: 0 }}>{order.productId?.name || "Product"}</p>
                                            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", margin: "4px 0 0" }}>
                                                Buyer: {order.userId?.name} • Seller: {order.sellerId?.name || "Unknown"}
                                            </p>
                                            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", margin: "3px 0 0", fontFamily: "monospace" }}>
                                                {order.paymentId}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <p style={{ color: "#10b981", fontWeight: "800", fontSize: "1.1rem", margin: 0 }}>₹{order.amount}</p>
                                            <span style={s.badge(order.paymentStatus === "successful" ? "#10b981" : "#f59e0b")}>
                                                {order.paymentStatus}
                                            </span>
                                            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", margin: "4px 0 0" }}>
                                                {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}

export default Admin;