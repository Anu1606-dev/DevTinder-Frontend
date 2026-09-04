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

  // status here must be "ignored" or "interested" — matches your
  // requestRouter's allowedStatus for /request/send, NOT the "accepted"/
  // "rejected" vocabulary used later in /request/review.
  const sendRequest = async (status, toUserId) => {
    try {
      await axios.post(
        BASE_URL + `/request/send/${status}/${toUserId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(toUserId));
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const handleIgnore = (userId) => sendRequest("ignored", userId);
  const handleInterested = (userId) => sendRequest("interested", userId);

  return (
    <div className="p-6 flex flex-wrap gap-6 justify-center items-start bg-linear-to-br from-primary/10 via-base-100 to-secondary/10">
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
        <div className="text-base-content/50 mt-10">No profiles found.</div>
      )}
    </div>
  );
};

export default Feed;