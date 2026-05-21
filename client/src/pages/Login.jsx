import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");

        try {

            const data = {
                email,
                password
            };

            const res = await axios.post(
                "http://localhost:3000/login",
                data,
                {
                    withCredentials: true
                }
            );

            console.log(res.data);

            if (res.data.success) {


                localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
    );
                // check role
                if (res.data.user && res.data.user.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/home");
                }
            } else {
                setError(res.data.message);
            }

        } catch (err) {

            console.log(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Something went wrong. Please try again.");
            }

        }
    };

    const styles = {
        wrapper: {
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
            fontFamily: "'Inter','Segoe UI',sans-serif",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            padding: "20px"
        },
        card: {
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "40px",
            width: "100%",
            maxWidth: "400px",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)"
        },
        title: {
            fontSize: "1.8rem",
            fontWeight: "700",
            marginBottom: "30px",
            textAlign: "center",
            color: "#fff"
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
        inputFocus: {
            background: "rgba(255,255,255,0.1)",
            borderColor: "rgba(255,255,255,0.3)",
            boxShadow: "0 0 0 4px rgba(255,255,255,0.05)"
        },
        button: {
            width: "100%",
            background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "13px 28px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            marginTop: "10px",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(108, 99, 255, 0.3)"
        },
        error: {
            color: "#ff6b6b",
            fontSize: "0.9rem",
            fontWeight: "600",
            marginBottom: "15px",
            background: "rgba(255, 107, 107, 0.1)",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid rgba(255, 107, 107, 0.2)"
        },
        links: {
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "20px"
        },
        link: {
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.7)",
            textAlign: "center"
        },
        linkAnchor: {
            color: "#a78bfa",
            fontWeight: "600",
            textDecoration: "none",
            transition: "all 0.3s ease"
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <form onSubmit={handleSubmit}>
                    <h2 style={styles.title}>Login</h2>

                    {error && <p style={styles.error}>{error}</p>}

                    <input
                        style={styles.input}
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" style={styles.button}>
                        Login
                    </button>

                    <div style={styles.links}>
                        <p style={styles.link}>
                            Don't have an account?
                            <Link style={styles.linkAnchor} to="/register"> Register here</Link>
                        </p>
                        <p style={styles.link}>
                            Are you a seller? <Link style={styles.linkAnchor} to="/Sellerlogin">Login as Seller</Link>
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Login;