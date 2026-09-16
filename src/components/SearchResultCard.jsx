import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useToast } from "../hooks/useToast";

const SearchResultCard = ({ user, onStatusChange }) => {
  const [isSending, setIsSending] = useState(false);
  const { showToast } = useToast();

  const {
    _id,
    firstName,
    lastName,
    photoUrl,
    about,
    age,
    skills,
    matchScore,
    isGithubVerified,
    connectionStatus,
  } = user;

  const fullName = `${firstName || ""} ${lastName || ""}`.trim() || "Developer";
  const profileImage =
    photoUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  const skillList = Array.isArray(skills) ? skills : [];
  const visibleSkills = skillList.slice(0, 5);
  const remainingCount = skillList.length - 5;

  const handleSendRequest = async () => {
    setIsSending(true);
    try {
      await axios.post(BASE_URL + `/request/send/interested/${_id}`, {}, { withCredentials: true });
      showToast("success", `Connection request sent to ${firstName}!`);
      onStatusChange(_id, "pending");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to send request.";
      showToast("error", message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 bg-base-100 border border-base-300 rounded-2xl shadow-md p-4 w-full">
      <img
        src={profileImage}
        alt={fullName}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-primary/30 shrink-0"
      />

      <div className="flex-1 min-w-0 text-center sm:text-left">
        <h3 className="text-lg font-bold text-base-content truncate flex items-center gap-1 justify-center sm:justify-start">
          {fullName}
          {age ? <span className="font-normal text-base-content/60">, {age}</span> : null}
          {isGithubVerified && <span className="badge badge-success badge-sm" title="GitHub Verified">✅</span>}
          {typeof matchScore === "number" && matchScore > 0 && (
            <span className="badge badge-primary badge-sm">🔧 {matchScore}%</span>
          )}
        </h3>
        {about && <p className="text-sm text-base-content/70 mt-1 line-clamp-2">{about}</p>}
        {skillList.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 justify-center sm:justify-start">
            {visibleSkills.map((skill, idx) => (
              <span key={idx} className="badge badge-primary badge-outline badge-sm">{skill}</span>
            ))}
            {remainingCount > 0 && <span className="badge badge-ghost badge-sm">+{remainingCount} more</span>}
          </div>
        )}
      </div>

      <div className="shrink-0">
        {connectionStatus === "connected" && (
          <Link to={`/chat/${_id}`} className="btn btn-primary btn-sm">Chat</Link>
        )}
        {connectionStatus === "pending" && (
          <button className="btn btn-outline btn-sm" disabled>Request Pending</button>
        )}
        {connectionStatus === "none" && (
          <button onClick={handleSendRequest} disabled={isSending} className="btn btn-primary btn-sm">
            {isSending ? "Sending..." : "Send Request"}
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchResultCard;