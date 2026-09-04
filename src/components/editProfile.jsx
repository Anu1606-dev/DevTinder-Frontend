import { useState } from "react";
import UserCard from "./userCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(
    Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || ""
  );
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const skillsArray = skills.split(",").map((s) => s.trim()).filter(Boolean);

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, photoUrl, age, gender, about, skills: skillsArray },
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
      <div className="max-w-6xl mx-auto px-4 my-6">
        <button onClick={() => navigate("/")} className="btn btn-ghost btn-sm mb-4 gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>

        <div className="flex flex-wrap lg:flex-nowrap justify-center gap-10">
          {/* Form — fixed-size card, only this scrolls internally */}
          <div className="card bg-base-100 border border-base-300 w-full max-w-sm shadow-xl">
            <div className="card-body max-h-[70vh] overflow-y-auto">
              <h2 className="card-title justify-center text-primary">Edit Profile</h2>

              <label className="form-control w-full my-2">
                <div className="label"><span className="label-text">First Name:</span></div>
                <input type="text" value={firstName} className="input input-bordered w-full" onChange={(e) => setFirstName(e.target.value)} />
              </label>

              <label className="form-control w-full my-2">
                <div className="label"><span className="label-text">Last Name:</span></div>
                <input type="text" value={lastName} className="input input-bordered w-full" onChange={(e) => setLastName(e.target.value)} />
              </label>

              <label className="form-control w-full my-2">
                <div className="label"><span className="label-text">Photo URL:</span></div>
                <input type="text" value={photoUrl} className="input input-bordered w-full" onChange={(e) => setPhotoUrl(e.target.value)} />
              </label>

              <label className="form-control w-full my-2">
                <div className="label"><span className="label-text">Age:</span></div>
                <input type="text" value={age} className="input input-bordered w-full" onChange={(e) => setAge(e.target.value)} />
              </label>

              <label className="form-control w-full my-2">
                <div className="label"><span className="label-text">Gender:</span></div>
                <select value={gender} className="select select-bordered w-full" onChange={(e) => setGender(e.target.value)}>
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="form-control w-full my-2">
                <div className="label"><span className="label-text">Skills (comma separated):</span></div>
                <input
                  type="text"
                  value={skills}
                  placeholder="React, Node.js, MongoDB"
                  className="input input-bordered w-full"
                  onChange={(e) => setSkills(e.target.value)}
                />
              </label>

              <label className="form-control w-full my-2">
                <div className="label"><span className="label-text">About:</span></div>
                <input type="text" value={about} className="input input-bordered w-full" onChange={(e) => setAbout(e.target.value)} />
              </label>

              {error && <p className="text-error text-sm mt-2">{error}</p>}

              <div className="card-actions justify-center m-2">
                <button className="btn btn-primary" onClick={saveProfile}>
                  Save Profile
                </button>
              </div>
            </div>
          </div>

          {/* Live preview — stays put while the form above scrolls */}
          <div className="lg:sticky lg:top-24 self-start">
            <UserCard
              user={{ firstName, lastName, photoUrl, age, gender, about, skills: skillsArray }}
              onIgnore={() => {}}
              onInterested={() => {}}
            />
          </div>
        </div>
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