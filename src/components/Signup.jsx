import axios from "axios";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const DEFAULT_PHOTO_URL = "https://img.icons8.com/nolan/1200/user-default.jpg";

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const hideTimeoutRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const revealPasswordBriefly = () => {
    setShowPassword(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setShowPassword(false), 3000);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (showPassword) {
      setShowPassword(false);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    }
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
          photoUrl: DEFAULT_PHOTO_URL,
        },
        { withCredentials: true }
      );

      showToast("success", "Account created! Logging you in...");

      const loginRes = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );

      dispatch(addUser(loginRes.data));
      localStorage.setItem("loginTimestamp", Date.now().toString());
      localStorage.setItem("lastEmail", emailId);

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
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            disabled={loading}
            className="input input-bordered w-full pr-10 disabled:opacity-50"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={revealPasswordBriefly}
            tabIndex={-1}
            aria-label="Show password briefly"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-primary transition"
          >
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        </div>
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
              <option value="" disabled hidden>Select</option>
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