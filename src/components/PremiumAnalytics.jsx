import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";

const PremiumAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axios.get(BASE_URL + "/premium/analytics", { withCredentials: true });
        setStats(data);
      } catch (err) {
        const message = err?.response?.data?.message || "Failed to load analytics.";
        setError(message);
      }
    };
    fetchAnalytics();
  }, []);

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <p className="text-error">{error}</p>
        <Link to="/premium" className="btn btn-primary mt-4">Upgrade to Premium</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-primary mb-6">📊 Your Profile Analytics</h2>

      {!stats ? (
        <p className="text-base-content/60">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat border border-base-300 rounded-xl p-4">
            <div className="stat-title">Last 7 Days</div>
            <div className="stat-value text-primary">{stats.viewsLast7Days}</div>
            <div className="stat-desc">profile views</div>
          </div>
          <div className="stat border border-base-300 rounded-xl p-4">
            <div className="stat-title">Last 30 Days</div>
            <div className="stat-value text-primary">{stats.viewsLast30Days}</div>
            <div className="stat-desc">profile views</div>
          </div>
          <div className="stat border border-base-300 rounded-xl p-4">
            <div className="stat-title">All Time</div>
            <div className="stat-value text-primary">{stats.totalViews}</div>
            <div className="stat-desc">profile views</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumAnalytics;