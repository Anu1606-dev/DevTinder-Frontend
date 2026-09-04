import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success" | "error", message }

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      await axios.post(
        BASE_URL + "/signup",
        {
          firstName,
          lastName,
          emailId,
          password,
          age: age || undefined,
          gender: gender || undefined,
        },
        { withCredentials: true }
      );

      showToast("success", "Account created! Logging you in...");

      // /signup doesn't set a login cookie on its own, so we chain a real
      // login call with the same credentials to actually get the user in.
      const loginRes = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );

      dispatch(addUser(loginRes.data));
      localStorage.setItem("loginTimestamp", Date.now().toString());

      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      const message = err?.response?.data;
      showToast(
        "error",
        typeof message === "string" ? message : "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-linear-to-br from-primary/10 via-base-100 to-secondary/10">
      <fieldset className="fieldset bg-base-100/80 backdrop-blur-md border border-base-300 rounded-box w-full max-w-sm p-6 shadow-2xl shadow-primary/10">
        <legend className="fieldset-legend text-2xl font-bold px-3 text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
          Sign Up
        </legend>

        <label className="label">First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={loading}
          className="input input-bordered w-full disabled:opacity-50"
          placeholder="First Name"
        />

        <label className="label mt-2">Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={loading}
          className="input input-bordered w-full disabled:opacity-50"
          placeholder="Last Name"
        />

        <label className="label mt-2">Email</label>
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
        <p className="text-xs text-base-content/50 mt-1">
          Min 8 characters, with uppercase, lowercase, a number & a symbol.
        </p>

        <div className="flex gap-3 mt-2">
          <label className="form-control w-1/2">
            <div className="label"><span className="label-text">Age</span></div>
            <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              disabled={loading}
              className="input input-bordered w-full disabled:opacity-50"
              placeholder="Age"
            />
          </label>
          <label className="form-control w-1/2">
            <div className="label"><span className="label-text">Gender</span></div>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              disabled={loading}
              className="select select-bordered w-full disabled:opacity-50"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="btn mt-5 w-full border-none text-primary-content bg-linear-to-r from-primary to-secondary hover:brightness-110 transition shadow-lg shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-base-content/60 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium">Login</Link>
        </p>
      </fieldset>

      {toast && (
        <div className="toast toast-top toast-center z-50">
          <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;