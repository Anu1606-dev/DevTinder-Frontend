import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../utils/connectionSlice";
import { addRequests, removeRequest } from "../utils/requestSlice";
import UserCard from "./userCard";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    if (connections) return;
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

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
    fetchConnections();
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ASSUMPTION: POST /request/review/:status/:requestId — needs confirming
  // against your actual routes/request.js
  const reviewRequest = async (status, requestId) => {
    try {
      await axios.post(
        BASE_URL + `/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(requestId));
    } catch (error) {
      console.error("Error reviewing request:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-primary mb-4">Pending Requests</h2>
        {requests && requests.length > 0 ? (
          <div className="flex flex-wrap gap-6">
            {requests.map((req) => (
              <UserCard
                key={req._id}
                user={req.fromUserId}
                onIgnore={() => reviewRequest("rejected", req._id)}
                onInterested={() => reviewRequest("accepted", req._id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-base-content/50">No pending requests right now.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary mb-4">Your Connections</h2>
        {connections && connections.length > 0 ? (
          <div className="flex flex-wrap gap-6">
            {connections.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-base-content/50">You don't have any connections yet.</p>
        )}
      </section>
    </div>
  );
};

export default Connections;