import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useToast } from "../hooks/useToast";

const AdminReports = () => {
  const [reports, setReports] = useState(null);
  const { showToast } = useToast();

  const fetchReports = async () => {
    try {
      const { data } = await axios.get(BASE_URL + "/admin/reports", { withCredentials: true });
      setReports(data.data);
    } catch (err) {
      showToast("error", "Failed to load reports. Admin access required.");
      setReports([]);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAction = async (reportId, status) => {
    try {
      await axios.patch(BASE_URL + "/admin/reports/" + reportId, { status }, { withCredentials: true });
      showToast("success", `Report marked as ${status}.`);
      setReports((prev) => prev.filter((r) => r._id !== reportId));
    } catch (err) {
      showToast("error", "Failed to update report.");
    }
  };

  const isLoading = reports === null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-primary mb-6">Pending Reports</h2>

      {isLoading && <p className="text-base-content/60">Loading...</p>}

      {!isLoading && reports.length === 0 && (
        <p className="text-base-content/60">No pending reports. 🎉</p>
      )}

      <div className="flex flex-col gap-4">
        {!isLoading && reports.map((report) => (
          <div key={report._id} className="border border-base-300 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-base-content">
                  {report.reportedUserId?.firstName} {report.reportedUserId?.lastName}
                </p>
                <p className="text-xs text-base-content/50">
                  Reported by {report.reporterId?.firstName} {report.reporterId?.lastName} · {new Date(report.createdAt).toLocaleString()}
                </p>
                <span className="badge badge-error badge-sm mt-2">{report.reason.replace(/_/g, " ")}</span>
                {report.details && <p className="text-sm text-base-content/70 mt-2">{report.details}</p>}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn btn-sm btn-outline" onClick={() => handleAction(report._id, "dismissed")}>
                Dismiss
              </button>
              <button className="btn btn-sm btn-error" onClick={() => handleAction(report._id, "reviewed")}>
                Mark Reviewed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;