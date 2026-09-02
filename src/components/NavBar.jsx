import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";

const FIVE_MINUTES = 5 * 60 * 1000;

const NavBar = () => {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "devtinder-light");
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        const storedTimestamp = user ? localStorage.getItem("loginTimestamp") : null;
        const remaining = storedTimestamp
            ? FIVE_MINUTES - (Date.now() - parseInt(storedTimestamp, 10))
            : 0;

        if (remaining > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with localStorage/system clock (external, impure sources), not mirroring render-time state
            setShowWelcome(true);
            const timer = setTimeout(() => setShowWelcome(false), remaining);
            return () => clearTimeout(timer);
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with localStorage/system clock (external, impure sources), not mirroring render-time state
        setShowWelcome(false);
    }, [user]);

    const toggleTheme = (e) => {
        setTheme(e.target.checked ? "synthwave" : "devtinder-light");
    };

    const handleLogout = async () => {
        try {
            await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
            localStorage.removeItem("loginTimestamp");
            dispatch(removeUser());
            return navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="navbar bg-base-300 shadow-sm">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl text-primary font-bold">
                    DevTinder🚀
                </Link>
            </div>

            {user && (
                <div className="flex-none flex items-center gap-4">
                    <label
                        className="toggle"
                        style={{ "--input-color": "var(--color-primary)" }}
                    >
                        <input
                            type="checkbox"
                            value="synthwave"
                            className="theme-controller"
                            checked={theme === "synthwave"}
                            onChange={toggleTheme}
                        />
                        <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="!text-white">
                            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="4"></circle>
                                <path d="M12 2v2"></path>
                                <path d="M12 20v2"></path>
                                <path d="m4.93 4.93 1.41 1.41"></path>
                                <path d="m17.66 17.66 1.41 1.41"></path>
                                <path d="M2 12h2"></path>
                                <path d="M20 12h2"></path>
                                <path d="m6.34 17.66-1.41 1.41"></path>
                                <path d="m19.07 4.93-1.41 1.41"></path>
                            </g>
                        </svg>
                        <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                            </g>
                        </svg>
                    </label>

                    {showWelcome && (
                        <p className="text-primary font-semibold">Welcome, {user.firstName}</p>
                    )}

                    <div className="dropdown dropdown-bottom dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img alt="User Photo" src={user.photoUrl} />
                            </div>
                        </div>
                        <ul
                            tabIndex={-1}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-1 w-52 p-2 shadow"
                        >
                            <li>
                                <Link to="/profile" className="justify-between text-primary font-medium">
                                    Profile
                                    <span className="badge">New</span>
                                </Link>
                            </li>
                            <li><a className="text-primary font-medium">Settings</a></li>
                            <li><a className="text-primary font-medium" onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavBar;