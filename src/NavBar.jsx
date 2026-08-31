import { useSelector } from "react-redux";

const NavBar = () => {
    const user = useSelector((store) => store.user);
    console.log(user);

    return (
        <div className="navbar bg-base-300 shadow-sm">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">DevTinder🚀</a>
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
                                <a className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </a>
                            </li>
                            <li><a>Settings</a></li>
                            <li><a>Logout</a></li>
                        </ul>
                    </div>
                </div>
            )}

        </div>
    )
}

export default NavBar