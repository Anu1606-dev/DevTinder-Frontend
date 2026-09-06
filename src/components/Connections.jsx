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

  const isLoading = connections === null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-primary mb-6">Your Connections</h2>

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

      {!isLoading && connections && connections.length > 0 && (
        <div className="flex flex-col gap-4">
          {connections.map((user) => (
            <HorizontalUserCard key={user._id} user={user} />
          ))}
        </div>
      )}

      {!isLoading && connections && connections.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🤝</div>
          <h3 className="text-lg font-bold text-base-content mb-2">No connections yet</h3>
          <p className="text-base-content/60">
            Head to the feed and start connecting with other developers!
          </p>
        </div>
      )}
    </div>
  );
};

export default Connections;