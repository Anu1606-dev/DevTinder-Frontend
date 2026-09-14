import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useToast } from "../hooks/useToast";

const ReferralCard = () => {
  const [referralData, setReferralData] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const { data } = await axios.get(BASE_URL + "/referral/my-link", { withCredentials: true });
        setReferralData(data);
      } catch (err) {
        console.error("Failed to fetch referral link:", err);
      }
    };
    fetchLink();
  }, []);

  const handleCopy = () => {
    if (!referralData?.referralLink) return;
    navigator.clipboard.writeText(referralData.referralLink);
    showToast("success", "Referral link copied!");
  };

  if (!referralData) return null;

  return (
    <div className="border border-base-300 rounded-xl p-3 my-2 flex flex-col gap-2">
      <span className="text-sm font-semibold text-base-content/70">Invite Friends 🎁</span>
      <p className="text-xs text-base-content/60">
        Share your link — you and your friend both get 7 days of Premium free when they join.
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={referralData.referralLink}
          className="input input-bordered input-sm flex-1 text-xs"
        />
        <button onClick={handleCopy} className="btn btn-primary btn-sm">Copy</button>
      </div>
      <span className="text-xs text-base-content/50">
        {referralData.referralCount} friend{referralData.referralCount !== 1 ? "s" : ""} joined using your link
      </span>
    </div>
  );
};

export default ReferralCard;