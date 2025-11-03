import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-blue-600">
          🎓 Joineazy
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-gray-500 capitalize">
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="btn btn-secondary text-sm px-3 py-1"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary text-sm px-3 py-1">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
