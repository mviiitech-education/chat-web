import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-4xl font-bold">Welcome to Chat App</h1>
            <p className="text-lg mt-2 text-gray-400">Join us to start chatting in real-time.</p>
            <div className="mt-6 flex gap-4">
                <Link to="/sign" className="bg-blue-500 px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition">
                    Sign In
                </Link>
                <Link to="/chat" className="bg-green-500 px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition">
                    Enter Chat
                </Link>
            </div>
        </div>
    );
};

export default Landing;
