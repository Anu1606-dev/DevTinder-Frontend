import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Premium = () => {
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

  return (
    <div className="flex flex-col items-center justify-center mt-20 gap-4">
      <h1 className="text-2xl font-bold">Upgrade to Premium</h1>
      <p className="text-gray-500">Unlock unlimited connections for ₹499</p>
      <button className="btn btn-primary" onClick={handleBuyClick}>
        Buy Premium
      </button>
    </div>
  );
};

export default Premium;