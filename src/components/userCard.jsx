const UserCard = ({ user }) => {
    if (!user) return null;

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Developer";
    const profileImage = user.photoUrl || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp";
    const title = user.designation || user.role || user.profession || "Full Stack Developer";

    return (
        <div className="card bg-base-100 w-96 shadow-sm border border-slate-200">
            <figure>
                <img
                    src={profileImage}
                    alt={fullName}
                    className="h-64 w-full object-cover"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{fullName}</h2>
                <p className="text-slate-600">{title}</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary">Connect</button>
                </div>
            </div>
        </div>
    );
};

export default UserCard;