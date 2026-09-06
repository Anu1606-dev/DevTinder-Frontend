import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
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
    dispatch(removeUserFromFeed(toUserId));
    try {
      await axios.post(
        BASE_URL + `/request/send/${status}/${toUserId}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const visibleCards = feed ? feed.slice(0, 3) : [];
  const isLoading = feed === null;
  const isEmpty = Array.isArray(feed) && feed.length === 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
      {isLoading && (
        <div className="w-full max-w-sm h-[500px] sm:h-[560px] flex flex-col gap-4">
          <div className="skeleton h-2/3 w-full rounded-2xl"></div>
          <div className="skeleton h-4 w-3/4 rounded"></div>
          <div className="skeleton h-4 w-1/2 rounded"></div>
          <div className="flex gap-3">
            <div className="skeleton h-8 w-16 rounded-full"></div>
            <div className="skeleton h-8 w-16 rounded-full"></div>
          </div>
        </div>
      )}

      {!isLoading && isEmpty && (
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-base-content mb-2">
            You're all caught up!
          </h3>
          <p className="text-base-content/60">
            No new developers to show right now. Check back later for more profiles.
          </p>
        </div>
      )}

      {!isLoading && !isEmpty && (
        <div className="relative w-full max-w-sm h-[500px] sm:h-[560px]">
          <AnimatePresence>
            {visibleCards.map((user, index) => (
              <SwipeCard key={user._id} user={user} stackIndex={index} onSwipe={sendRequest} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Feed;