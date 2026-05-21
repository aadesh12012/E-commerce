import React, { useState } from "react";

import axios from "axios";

import { useNavigate, Link } from "react-router-dom";

import "../App.css";

function SellerLogin() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        try {

            const res = await axios.post(
                "http://localhost:3000/sellerlogin",
                {
                    email,
                    password
                },
                {
                    withCredentials: true
                }
            );

            console.log(res.data);

            if (res.data.success) {

                alert("Seller Login Successful");

                localStorage.setItem("seller", JSON.stringify(res.data.seller));

                navigate("/seller");

            } else {

                setError(res.data.message || "Login failed");

            }

        } catch (err) {

            console.log("Error:", err);

            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.message === "Network Error" || err.code === "ERR_NETWORK") {
                setError("Cannot connect to server. Make sure backend is running on port 3000");
            } else {
                setError("Something went wrong. Please try again.");
            }

        }

    };


    return (

        <div className="container">

            <form
                className="login-Box"
                onSubmit={handleSubmit}
            >

                <h1>Seller Login</h1>

                {error && <p style={{ color: 'red', fontSize: '14px', fontWeight: 'bold', margin: '10px 0', background: '#ffe0e0', padding: '10px', borderRadius: '5px' }}>{error}</p>}

                <input
                    type="email"
                    placeholder="Enter Email"
                    className="input"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    className="input"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button
                    type="submit"
                    className="submitbtn"
                >
                    Login
                </button>

                <p className="togglebtn">
                    Don't have an account? <Link to="/sellerregister">Register here</Link>
                </p>

            </form>

        </div>
    );
}

export default SellerLogin;