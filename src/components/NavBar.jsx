import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
// import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(BASE_URL + "/logout", {}, { withCredentials: true, });
            dispatch(removeUser());
            return navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    return (
        <div className="navbar bg-base-300 shadow-sm">
            <div className="flex-1">
                <link to="/" className="btn btn-ghost text-xl">
                    DevTinder🚀
                </link>
            </div>

            {user && (
                <div className="flex-none gap-2">
                    <div className="dropdown dropdown-bottom dropdown-end mx-5 flex items-center gap-2">
                        <p className="px-4"> Welcome, {user.firstName}</p>
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="User Photo"
                                    src={user.photoUrl} />
                            </div>
                        </div>
                        <ul
                            tabIndex={-1}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-1 w-52 p-2 shadow">
                            <li>
                                <link to="/profile" className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </link>
                            </li>
                            <li><a>Settings</a></li>
                            <li>
                                <a onClick={handleLogout}>Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

        </div>
    )
}

export default NavBar