import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Sign = ({ setUsername, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [username, setLocalUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        try {
            await axios.post("http://localhost:5000/signup", { username, email, password });
            alert("Signup successful! Please log in.");
        } catch (error) {
            alert("Signup failed!");
        }
    };

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:5000/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", res.data.username);
            setUsername(res.data.username);
            setIsLoggedIn(true);
            navigate("/chat"); // Redirect to chat after login
        } catch (error) {
            alert("Login failed!");
        }
    };

    return (
        <div className="bg-white text-black p-6 mt-10 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-blue-500 text-2xl font-bold mb-4">Login / Signup</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setLocalUsername(e.target.value)}
                className="w-full p-3 mb-3 border rounded-lg"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-3 border rounded-lg"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mb-4 border rounded-lg"
            />
            <div className="flex gap-4">
                <button onClick={handleSignup} className="w-full bg-blue-500 text-white py-3 rounded-lg">
                    Signup
                </button>
                <button onClick={handleLogin} className="w-full bg-black text-white py-3 rounded-lg">
                    Login
                </button>
            </div>
        </div>
    );
};

export default Sign;
