import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useToast } from "../hooks/useToast";

const REASONS = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment or abusive behavior" },
  { value: "fake_profile", label: "Fake profile" },
  { value: "inappropriate_content", label: "Inappropriate content" },
  { value: "other", label: "Other" },
];

const ReportModal = ({ isOpen, onClose, targetUserId, targetUserName }) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason) {
      showToast("error", "Please select a reason.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        BASE_URL + "/report/" + targetUserId,
        { reason, details },
        { withCredentials: true }
      );
      showToast("success", "Report submitted. Thank you for helping keep DevTinder safe.");
      setReason("");
      setDetails("");
      onClose();
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to submit report.";
      showToast("error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-primary">Report {targetUserName}</h3>
        <p className="text-sm text-base-content/60 mt-1">
          Your report is confidential. We'll review it and take appropriate action.
        </p>

        <label className="form-control w-full mt-4">
          <div className="label"><span className="label-text">Reason</span></div>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="" disabled>Select a reason</option>
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </label>

        <label className="form-control w-full mt-3">
          <div className="label"><span className="label-text">Additional details (optional)</span></div>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="textarea textarea-bordered w-full"
            rows={3}
            maxLength={500}
          />
        </label>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-error" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;