import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../utils/connectionSlice";
import HorizontalUserCard from "./HorizontalUserCard";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
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

  useEffect(() => {
    fetchConnections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-primary mb-6">Your Connections</h2>
      {connections && connections.length > 0 ? (
        <div className="flex flex-col gap-4">
          {connections.map((user) => (
            <HorizontalUserCard key={user._id} user={user} />
          ))}
        </div>
      ) : (
        <p className="text-base-content/50">You don't have any connections yet.</p>
      )}
    </div>
  );
};

export default Connections;