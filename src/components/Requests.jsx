import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { addSingleConnection } from "../utils/connectionSlice";
import HorizontalUserCard from "./HorizontalUserCard";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

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
      // Accepted? We already have this person's full profile from the
      // populated request — push it straight into Connections, no refetch needed.
      if (status === "accepted") {
        dispatch(addSingleConnection(request.fromUserId));
      }
    } catch (error) {
      console.error("Error reviewing request:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-primary mb-6">Connection Requests</h2>
      {requests && requests.length > 0 ? (
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
      ) : (
        <p className="text-base-content/50">No pending requests right now.</p>
      )}
    </div>
  );
};

export default Requests;