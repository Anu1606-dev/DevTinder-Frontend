import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link } from "react-router-dom";

const Premium = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [isBoosting, setIsBoosting] = useState(false);

  const isPremiumActive = user?.isPremium && user?.premiumExpiresAt && new Date(user.premiumExpiresAt) > new Date();

  const refreshProfile = async () => {
    try {
      const { data } = await axios.get(BASE_URL + "/profile", { withCredentials: true });
      dispatch(addUser(data));
    } catch (err) {
      console.error("Failed to refresh profile:", err);
    }
  };

  const handleBuyClick = async () => {
    try {
      const { data } = await axios.post(
        BASE_URL + "/payment/create",
        { amount: 499 },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "DevTinder",
        description: "Premium Membership",
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              BASE_URL + "/payment/verify",
              response,
              { withCredentials: true }
            );
            console.log("Payment verified:", verifyRes.data);
            alert("Payment successful! Welcome to Premium.");
            refreshProfile(); // ← ADDED: pull the now-updated isPremium status into Redux
          } catch (err) {
            console.error("Verification failed:", err);
            alert("Payment verification failed. Contact support.");
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Order creation failed:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  // ← ADDED
  const handleBoost = async () => {
    setIsBoosting(true);
    try {
      await axios.post(BASE_URL + "/premium/boost", {}, { withCredentials: true });
      alert("Your profile is boosted for the next 24 hours!");
      refreshProfile();
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to activate boost.";
      alert(message);
    } finally {
      setIsBoosting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20 gap-4">
      <h1 className="text-2xl font-bold">
        {isPremiumActive ? "You're a Premium member! ⭐" : "Upgrade to Premium"}
      </h1>

      {!isPremiumActive && (
        <>
          <p className="text-gray-500">Unlock unlimited connections for ₹499</p>
          <button className="btn btn-primary" onClick={handleBuyClick}>
            Buy Premium
          </button>
        </>
      )}

      {/* ← ADDED: Boost + Analytics, only visible to active premium members */}
      {isPremiumActive && (
        <>
          <p className="text-gray-500">
            Active until {new Date(user.premiumExpiresAt).toLocaleDateString()}
          </p>
          <button className="btn btn-secondary" onClick={handleBoost} disabled={isBoosting}>
            {isBoosting ? "Boosting..." : "⚡ Boost my profile for 24 hours"}
          </button>
          <Link to="/premium/analytics" className="btn btn-outline">
            📊 View my profile analytics
          </Link>
        </>
      )}
    </div>
  );
};

export default Premium;