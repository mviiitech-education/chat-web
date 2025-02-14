import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Chat = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState(localStorage.getItem("username") || "");
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

    useEffect(() => {
        socket.on("receiveMessage", (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socket.on("loadMessages", (msgs) => {
            setMessages(msgs);
        });

        return () => {
            socket.off("receiveMessage");
            socket.off("loadMessages");
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("sendMessage", { sender: username, text: message });
            setMessage("");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        setUsername("");
        navigate("/");
    };

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col items-center p-6 text-white">
            <h2 className="text-blue-500 text-3xl font-bold">⚡ Chat App</h2>
            <p className="mt-2 text-gray-400">
                Logged in as: {username}
                <button onClick={logout} className="ml-2 bg-red-500 px-4 py-1 rounded-lg hover:bg-red-600">
                    Logout
                </button>
            </p>

            <div className="w-full max-w-lg mt-4 h-80 overflow-y-auto bg-white text-black p-4 rounded-lg shadow-lg">
                {messages.map((msg, index) => (
                    <p key={index} className={`mb-2 ${msg.sender === username ? "text-right" : "text-left"}`}>
                        <strong className="text-blue-500">{msg.sender}: </strong> {msg.message}
                    </p>
                ))}
            </div>

            <div className="w-full max-w-lg flex mt-4 gap-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 p-3 border rounded-lg bg-white text-black"
                />
                <button onClick={sendMessage} className="bg-blue-500 text-white px-6 py-3 rounded-lg">
                    Send
                </button>
            </div>

            <button onClick={() => navigate("/")} className="mt-6 bg-gray-700 px-4 py-2 rounded-lg">
                Back to Home
            </button>
        </div>
    );
};

export default Chat;
