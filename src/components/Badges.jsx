import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Badges = () => {
  const [badgeData, setBadgeData] = useState(null);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const { data } = await axios.get(BASE_URL + "/user/badges", { withCredentials: true });
        setBadgeData(data);
      } catch (err) {
        console.error("Failed to fetch badges:", err);
      }
    };
    fetchBadges();
  }, []);

  if (!badgeData) return null;

  return (
    <div className="border border-base-300 rounded-xl p-3 my-2 flex flex-col gap-2">
      <span className="text-sm font-semibold text-base-content/70">
        Achievements ({badgeData.connectionCount} connections)
      </span>
      <div className="flex flex-wrap gap-2">
        {badgeData.badges.map((badge) => (
          <div
            key={badge.id}
            title={badge.description}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-center w-20 ${
              badge.achieved
                ? "border-primary bg-primary/10"
                : "border-base-300 opacity-40 grayscale"
            }`}
          >
            <span className="text-2xl">{badge.icon}</span>
            <span className="text-[10px] leading-tight">{badge.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badges;