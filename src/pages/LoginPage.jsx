import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === "professor") navigate("/professor");
      else navigate("/student");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-cyan-200 px-4">
      <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md transition-transform duration-300 hover:scale-[1.02]">
        {/* Logo / Title */}
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          LOGIN Portal
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Welcome 👋 — Login to continue
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Error Box */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-300 text-red-600 text-sm text-center animate-fadeIn">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-semibold text-white shadow-md transition-all duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
          <p className="font-semibold text-gray-800 mb-2">
            👨‍🏫 Professor Account
          </p>
          <p className="ml-2 mb-3">
            <strong>Email:</strong> prof@example.com <br />
            <strong>Password:</strong> 1234
          </p>

          <p className="font-semibold text-gray-800 mb-2">
            🎓 Student Accounts
          </p>
          <ul className="ml-4 list-disc space-y-1">
            <li>ritik@student.com / 1234</li>
            <li>aarav@student.com / 1234</li>
            <li>priya@student.com / 1234</li>
            <li>kabir@student.com / 1234</li>
            <li>sneha@student.com / 1234</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
