import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
function Regester() {
    const navigate = useNavigate();
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e)=>{
        e.preventDefault();
        setError("");
        const data = {
            name,
            email,
            password
        }
        axios.post("http://localhost:3000/create",data,
        {
             withCredentials: true
        })
        .then((res)=>{
            console.log(res);
            if (res.data.success) {
                navigate('/');
            } else {
                setError(res.data.message);
            }
        })
        .catch((err)=>{
            console.log(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        })
    }

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
        link: {
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            marginTop: "20px"
        },
        linkAnchor: {
            color: "#a78bfa",
            fontWeight: "600",
            textDecoration: "none",
            transition: "all 0.3s ease",
            marginLeft: "5px"
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <h2 style={styles.title}>Register</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Username"
                        onChange={(e)=>setName(e.target.value)}
                        required
                    />
                    <input
                        style={styles.input}
                        type="email"
                        placeholder="Email"
                        onChange={(e)=>setEmail(e.target.value)}
                        required
                    />
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Password"
                        onChange={(e)=>setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" style={styles.button}>Register</button>
                    <p style={styles.link}>
                        Already have an account? <Link style={styles.linkAnchor} to="/">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Regester;