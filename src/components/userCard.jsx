const UserCard = ({ user, onIgnore, onInterested }) => {
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
    <div className="card w-80 bg-base-100 border border-base-300 rounded-2xl shadow-xl overflow-hidden">
      <div className="relative h-56 w-full">
        <img src={profileImage} alt={fullName} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h2 className="text-2xl font-bold text-white drop-shadow">
            {fullName}
            {age ? <span className="font-normal text-white/80">, {age}</span> : null}
          </h2>
          {gender && <p className="text-xs text-white/70 capitalize">{gender}</p>}
        </div>
      </div>

      <div className="card-body p-4 space-y-3">
        {about && <p className="text-sm text-base-content/70 line-clamp-2">{about}</p>}

        {skillList.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skillList.map((skill, idx) => (
              <span key={idx} className="badge badge-primary badge-outline text-xs">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <span className="badge badge-ghost text-xs italic">No skills added yet</span>
        )}

        {showActions && (
          <div className="flex justify-center gap-6 pt-1">
            <button
              onClick={() => onIgnore?.(_id)}
              className="btn btn-circle btn-outline btn-error"
              aria-label="Ignore"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              onClick={() => onInterested?.(_id)}
              className="btn btn-circle btn-primary shadow-lg shadow-primary/30"
              aria-label="Interested"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21s-6.716-4.35-9.428-7.062C.657 12.023.657 8.977 2.572 7.062a5 5 0 017.071 0L12 9.42l2.357-2.358a5 5 0 017.071 0c1.915 1.915 1.915 4.961 0 6.876C18.716 16.65 12 21 12 21z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;