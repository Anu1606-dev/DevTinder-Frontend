import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { addSingleConnection } from "../utils/connectionSlice";
import { useToast } from "../hooks/useToast";
import HorizontalUserCard from "./HorizontalUserCard";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const fetchRequests = async () => {
    if (requests) return;
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reviewRequest = async (status, request) => {
    try {
      await axios.post(
        BASE_URL + `/request/review/${status}/${request._id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(request._id));

      if (status === "accepted") {
        dispatch(addSingleConnection(request.fromUserId));
        showToast("success", `You're now connected with ${request.fromUserId.firstName}!`);
      } else {
        showToast("info", `Request from ${request.fromUserId.firstName} declined.`);
      }
    } catch (error) {
      console.error("Error reviewing request:", error);
      showToast("error", "Something went wrong. Please try again.");
    }
  };

  const isLoading = requests === null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-primary mb-6">Connection Requests</h2>

      {isLoading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-base-300 rounded-2xl">
              <div className="skeleton h-20 w-20 rounded-full shrink-0"></div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="skeleton h-4 w-1/3 rounded"></div>
                <div className="skeleton h-3 w-2/3 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && requests && requests.length > 0 && (
        <div className="flex flex-col gap-4">
          {requests.map((req) => (
            <HorizontalUserCard
              key={req._id}
              user={req.fromUserId}
              onIgnore={() => reviewRequest("rejected", req)}
              onInterested={() => reviewRequest("accepted", req)}
            />
          ))}
        </div>
      )}

      {!isLoading && requests && requests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-lg font-bold text-base-content mb-2">No pending requests</h3>
          <p className="text-base-content/60">
            When someone's interested in connecting, you'll see them here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Requests;