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
          } catch (err) {
            console.error("Verification failed:", err);
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Order creation failed:", err);
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <button className="btn btn-primary" onClick={handleBuyClick}>
        Buy Premium
      </button>
    </div>
  );
};

export default Premium;