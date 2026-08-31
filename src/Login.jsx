import axios from "axios";
import { useState } from "react";

const Login = () => {
  const [emailId, setEmailId] = useState("dhoni@gmail.com");
  const [password, setPassword] = useState("Dhoni@1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      console.log("Attempting login with:", { emailId, password });

      const response = await axios.post(
        "http://localhost:7777/login",
        { emailId, password },
        { withCredentials: true }
      );

      console.log("Login successful:", response.data);
      // Handle successful login here (store token, redirect, etc.)
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950">
      <fieldset className="fieldset bg-slate-800/70 backdrop-blur-md border border-slate-700/60 rounded-box w-96 p-6 shadow-2xl shadow-blue-500/10">
        <legend className="fieldset-legend text-2xl font-bold px-3 text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">
          Login
        </legend>

        {error && (
          <div className="alert alert-error mb-4 bg-red-900/30 border border-red-500/50 text-red-200 text-sm rounded">
            {error}
          </div>
        )}

        <label className="label text-slate-300">Email</label>
        <input
          type="email"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          disabled={loading}
          className="input w-full bg-slate-900/70 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none disabled:opacity-50"
          placeholder="Email"
        />

        <label className="label text-slate-300 mt-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="input w-full bg-slate-900/70 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none disabled:opacity-50"
          placeholder="Password"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="btn mt-5 w-full border-none text-white bg-linear-to-r from-blue-600 via-blue-500 to-cyan-400 hover:brightness-110 transition shadow-lg shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </fieldset>
    </div>
  );
};

export default Login;