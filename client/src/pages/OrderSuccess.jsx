import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

function OrderSuccess() {
    const location = useLocation();
    const navigate = useNavigate();

    // Data passed from Checkout after successful payment
    const { paymentId, orderId, amount } = location.state || {};

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Inter', sans-serif",
            padding: "20px"
        }}>
            <div style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                padding: "50px 40px",
                maxWidth: "550px",
                width: "100%",
                textAlign: "center",
                boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
            }}>
                {/* Animated Checkmark */}
                <div style={{
                    width: "90px",
                    height: "90px",
                    background: "linear-gradient(135deg, #00c853, #69f0ae)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 30px auto",
                    fontSize: "45px",
                    animation: "pulse 2s ease-in-out infinite"
                }}>
                    ✓
                </div>

                <h1 style={{
                    color: "#ffffff",
                    fontSize: "2.2rem",
                    fontWeight: "700",
                    marginBottom: "10px"
                }}>
                    Payment Successful!
                </h1>

                <p style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "1rem",
                    marginBottom: "35px"
                }}>
                    Thank you for shopping at <strong style={{ color: "#fff" }}>Black Lake</strong>. Your order has been placed.
                </p>

                {/* Payment Details */}
                <div style={{
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "30px",
                    textAlign: "left"
                }}>
                    <h3 style={{ color: "#a0a0ff", marginBottom: "15px", fontSize: "0.9rem", letterSpacing: "1px", textTransform: "uppercase" }}>
                        Transaction Details
                    </h3>

                    {amount && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>Amount Paid</span>
                            <span style={{ color: "#69f0ae", fontWeight: "700", fontSize: "1rem" }}>₹{amount}</span>
                        </div>
                    )}

                    {paymentId && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>Payment ID</span>
                            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem", fontFamily: "monospace" }}>
                                {paymentId}
                            </span>
                        </div>
                    )}

                    {orderId && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>Order ID</span>
                            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem", fontFamily: "monospace" }}>
                                {orderId}
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                    <button
                        onClick={() => navigate("/home")}
                        style={{
                            background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            padding: "14px 20px",
                            fontSize: "1rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease"
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(108,99,255,0.4)"; }}
                        onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                        Continue Shopping
                    </button>
                </div>

                <style>{`
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,200,83,0.4); }
                        50% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(0,200,83,0); }
                    }
                `}</style>
            </div>
        </div>
    );
}

export default OrderSuccess;
