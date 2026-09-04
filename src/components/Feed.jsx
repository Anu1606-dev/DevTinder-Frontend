import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import SwipeCard from "./SwipeCard";

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

  const visibleCards = feed ? feed.slice(0, 3) : [];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
      {feed && feed.length > 0 ? (
        <div className="relative w-full max-w-sm h-[500px] sm:h-[560px]">
          {visibleCards.map((user, index) => (
            <SwipeCard key={user._id} user={user} stackIndex={index} onSwipe={sendRequest} />
          ))}
        </div>
      ) : (
        <div className="text-base-content/50 text-center">No profiles found.</div>
      )}
    </div>
  );
};

export default Feed;