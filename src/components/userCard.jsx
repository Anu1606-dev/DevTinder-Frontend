const UserCard = ({ user, onIgnore, onInterested }) => {
  if (!user) return null;

  const { _id, firstName, lastName, photoUrl, about, age, skills } = user;

  const fullName = `${firstName || ""} ${lastName || ""}`.trim() || "Developer";
  const profileImage =
    photoUrl ||
    "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp";

  // Handles skills whether it's stored as an array or a comma-separated string
  const skillList = Array.isArray(skills)
    ? skills
    : typeof skills === "string" && skills.length > 0
    ? skills.split(",").map((s) => s.trim())
    : [];

  return (
    <div className="card w-80 bg-slate-800/70 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-2xl shadow-blue-500/10 overflow-hidden">
      {/* Photo with name overlay */}
      <div className="relative h-80 w-full">
        <img src={profileImage} alt={fullName} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h2 className="text-2xl font-bold text-white">
            {fullName}
            {age ? <span className="font-normal text-slate-300">, {age}</span> : null}
          </h2>
        </div>
      </div>

      {/* Info section */}
      <div className="p-4 space-y-3">
        {about && <p className="text-sm text-slate-300 line-clamp-3">{about}</p>}

        {skillList.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skillList.map((skill, idx) => (
              <span
                key={idx}
                className="badge border-none text-xs font-medium text-blue-200 bg-blue-500/20"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-6 pt-2">
          <button
            onClick={() => onIgnore?.(_id)}
            className="btn btn-circle btn-lg bg-slate-700 hover:bg-red-500/80 border-none text-white transition"
            aria-label="Ignore"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={() => onInterested?.(_id)}
            className="btn btn-circle btn-lg bg-linear-to-r from-blue-600 via-blue-500 to-cyan-400 hover:brightness-110 border-none text-white shadow-lg shadow-blue-500/40 transition"
            aria-label="Interested"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21s-6.716-4.35-9.428-7.062C.657 12.023.657 8.977 2.572 7.062a5 5 0 017.071 0L12 9.42l2.357-2.358a5 5 0 017.071 0c1.915 1.915 1.915 4.961 0 6.876C18.716 16.65 12 21 12 21z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;