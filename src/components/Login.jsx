import axios from "axios";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("dhoni@gmail.com");
  const [password, setPassword] = useState("Dhoni@1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));
      localStorage.setItem("loginTimestamp", Date.now().toString());
      return navigate("/");

    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-linear-to-br from-primary/10 via-base-100 to-secondary/10">
      <fieldset className="fieldset bg-base-100/80 backdrop-blur-md border border-base-300 rounded-box w-96 p-6 shadow-2xl shadow-primary/10">
        <legend className="fieldset-legend text-2xl font-bold px-3 text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
          Login
        </legend>

        {error && (
          <div className="alert alert-error mb-4 text-sm rounded">
            {error}
          </div>
        )}

        <label className="label">Email</label>
        <input
          type="email"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          disabled={loading}
          className="input input-bordered w-full disabled:opacity-50"
          placeholder="Email"
        />

        <label className="label mt-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="input input-bordered w-full disabled:opacity-50"
          placeholder="Password"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="btn mt-5 w-full border-none text-primary-content bg-linear-to-r from-primary to-secondary hover:brightness-110 transition shadow-lg shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </fieldset>
    </div>
  );
};

export default Login;