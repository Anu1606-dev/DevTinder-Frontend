const HorizontalUserCard = ({ user, onIgnore, onInterested }) => {
  if (!user) return null;

  const { _id, firstName, lastName, photoUrl, about, age, gender, skills } = user;
  const fullName = `${firstName || ""} ${lastName || ""}`.trim() || "Developer";
  const profileImage =
    photoUrl || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp";

  const skillList = Array.isArray(skills)
    ? skills
    : typeof skills === "string" && skills.length > 0
    ? skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const showActions = onIgnore || onInterested;

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 bg-base-100 border border-base-300 rounded-2xl shadow-md p-4 w-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
      <img
        src={profileImage}
        alt={fullName}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-primary/30 shrink-0"
      />

      <div className="flex-1 min-w-0 text-center sm:text-left">
        <h3 className="text-lg font-bold text-base-content truncate">
          {fullName}
          {age ? <span className="font-normal text-base-content/60">, {age}</span> : null}
        </h3>
        {gender && <p className="text-xs text-base-content/50 capitalize">{gender}</p>}
        {about && <p className="text-sm text-base-content/70 mt-1 line-clamp-2">{about}</p>}
        {skillList.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 justify-center sm:justify-start">
            {skillList.slice(0, 5).map((skill, idx) => (
              <span key={idx} className="badge badge-primary badge-outline badge-sm">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex gap-2 shrink-0">
          <button onClick={() => onIgnore?.(_id)} className="btn btn-outline btn-error btn-sm">
            Reject
          </button>
          <button onClick={() => onInterested?.(_id)} className="btn btn-primary btn-sm">
            Accept
          </button>
        </div>
      )}
    </div>
  );
};

export default HorizontalUserCard;