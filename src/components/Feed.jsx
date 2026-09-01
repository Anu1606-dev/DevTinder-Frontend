import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import UserCard from "./userCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data.data));
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  useEffect(() => {
    getFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // These currently just remove the card locally.
  // Share your request.js backend route and I'll wire these to actually
  // call the connection-request API (send interested/ignored).
  const handleIgnore = (userId) => dispatch(removeUserFromFeed(userId));
  const handleInterested = (userId) => dispatch(removeUserFromFeed(userId));

  return (
    <div className="min-h-[calc(100vh-8rem)] p-6 flex flex-wrap gap-6 justify-center items-start bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {feed && feed.length > 0 ? (
        feed.map((user) => (
          <UserCard
            key={user?._id}
            user={user}
            onIgnore={handleIgnore}
            onInterested={handleInterested}
          />
        ))
      ) : (
        <div className="text-slate-400 mt-10">No profiles found.</div>
      )}
    </div>
  );
};

export default Feed;