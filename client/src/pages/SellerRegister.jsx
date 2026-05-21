import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function SellerRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        businessName: "",
        address: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone || !formData.businessName || !formData.address) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:3000/seller/register",
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    businessName: formData.businessName,
                    address: formData.address
                },
                {
                    withCredentials: true
                }
            );

            console.log(res.data);

            if (res.data.success) {
                alert("Seller Registration Successful! Please login with your credentials.");
                navigate("/sellerlogin");
            } else {
                setError(res.data.message || "Registration failed");
            }

        } catch (err) {
            console.log(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <form className="Register-Box" onSubmit={handleSubmit}>
                <h1>Seller Registration</h1>

                {error && <p style={{ color: 'red', fontSize: '14px', fontWeight: 'bold', margin: '10px 0', background: '#ffe0e0', padding: '10px', borderRadius: '5px' }}>{error}</p>}

                <div className="input-group">
                    <input
                        className="input"
                        type="text"
                        placeholder="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="input"
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="input"
                        type="tel"
                        placeholder="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="input"
                        type="text"
                        placeholder="Business Name"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="input"
                        type="text"
                        placeholder="Business Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="input"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="input"
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className="submitbtn" disabled={loading}>
                        {loading ? "Registering..." : "Register as Seller"}
                    </button>

                    <p className="togglebtn">
                        Already have an account? <Link to="/sellerlogin">Login here</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default SellerRegister;
