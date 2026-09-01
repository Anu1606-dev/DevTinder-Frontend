import { useState } from "react";
import UserCard from "./userCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, photoUrl, age, gender, about },
        { withCredentials: true }
      );

      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data || "Something went wrong");
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-center gap-10 my-10 px-4">
        {/* Edit form */}
        <div className="card bg-slate-800/70 backdrop-blur-md border border-slate-700/60 rounded-2xl w-96 shadow-2xl shadow-blue-500/10">
          <div className="card-body">
            <h2 className="card-title justify-center text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">
              Edit Profile
            </h2>

            <label className="form-control w-full my-2">
              <div className="label">
                <span className="label-text text-slate-300">First Name:</span>
              </div>
              <input
                type="text"
                value={firstName}
                className="input input-bordered w-full bg-slate-900/70 border-slate-600 text-white focus:border-blue-500 focus:outline-none"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>

            <label className="form-control w-full my-2">
              <div className="label">
                <span className="label-text text-slate-300">Last Name:</span>
              </div>
              <input
                type="text"
                value={lastName}
                className="input input-bordered w-full bg-slate-900/70 border-slate-600 text-white focus:border-blue-500 focus:outline-none"
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>

            <label className="form-control w-full my-2">
              <div className="label">
                <span className="label-text text-slate-300">Photo URL:</span>
              </div>
              <input
                type="text"
                value={photoUrl}
                className="input input-bordered w-full bg-slate-900/70 border-slate-600 text-white focus:border-blue-500 focus:outline-none"
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </label>

            <label className="form-control w-full my-2">
              <div className="label">
                <span className="label-text text-slate-300">Age:</span>
              </div>
              <input
                type="text"
                value={age}
                className="input input-bordered w-full bg-slate-900/70 border-slate-600 text-white focus:border-blue-500 focus:outline-none"
                onChange={(e) => setAge(e.target.value)}
              />
            </label>

            <label className="form-control w-full my-2">
              <div className="label">
                <span className="label-text text-slate-300">Gender:</span>
              </div>
              <input
                type="text"
                value={gender}
                className="input input-bordered w-full bg-slate-900/70 border-slate-600 text-white focus:border-blue-500 focus:outline-none"
                onChange={(e) => setGender(e.target.value)}
              />
            </label>

            <label className="form-control w-full my-2">
              <div className="label">
                <span className="label-text text-slate-300">About:</span>
              </div>
              <input
                type="text"
                value={about}
                className="input input-bordered w-full bg-slate-900/70 border-slate-600 text-white focus:border-blue-500 focus:outline-none"
                onChange={(e) => setAbout(e.target.value)}
              />
            </label>

            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

            <div className="card-actions justify-center m-2">
              <button
                className="btn border-none text-white bg-linear-to-r from-blue-600 via-blue-500 to-cyan-400 hover:brightness-110 shadow-lg shadow-blue-500/40"
                onClick={saveProfile}
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>

        {/* Live preview using your existing card design */}
        <UserCard user={{ firstName, lastName, photoUrl, age, gender, about }} />
      </div>

      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;