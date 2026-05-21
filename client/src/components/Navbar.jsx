import React from "react";
import logoImg from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Navbar({ searchTerm = "", setSearchTerm = () => {} }) {
    const navigate = useNavigate();
    return (
        <div className="NavBar">
            <div className="logo-section">
                <img src={logoImg} alt="Logo" className="logo-img" />
                <h4 className="Title-Main">Black Lake</h4>
            </div>
            <input
                className="Search-Nav"
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="logoutbtn" onClick={() => navigate('/cart')} type="button">Cart</button>
            <button className="logoutbtn" onClick={() => navigate('/')} type="button">Logout</button>
        </div>
    );
}
export default Navbar;