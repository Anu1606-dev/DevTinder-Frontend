import axios from "axios";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { BASE_URL } from "../utils/constants";
import { addFeed, appendFeed, removeUserFromFeed } from "../utils/feedSlice";
import { setFeedPage, setFeedHasMore } from "../utils/feedMetaSlice";
import SwipeCard from "./SwipeCard";

const LIMIT = 10;
const PREFETCH_THRESHOLD = 3; // fetch the next page once this many cards or fewer remain

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const { page, hasMore } = useSelector((store) => store.feedMeta);
  const dispatch = useDispatch();
  const isFetchingRef = useRef(false);

  const fetchPage = async (pageToFetch) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const res = await axios.get(
        BASE_URL + `/user/feed?page=${pageToFetch}&limit=${LIMIT}`,
        { withCredentials: true }
      );
      const newUsers = res.data.data;

      if (pageToFetch === 1) {
        dispatch(addFeed(newUsers));
      } else {
        dispatch(appendFeed(newUsers));
      }

      dispatch(setFeedPage(pageToFetch));
      if (newUsers.length < LIMIT) {
        dispatch(setFeedHasMore(false));
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      isFetchingRef.current = false;
    }
  };

  // Only fetch page 1 if we've genuinely never loaded the feed (fresh login),
  // not on every remount — otherwise navigating away and back would reset progress.
  useEffect(() => {
    if (feed === null) {
      fetchPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Quietly loads the next batch once the stack runs low, so the user
  // ideally never actually hits a hard "out of profiles" wall mid-swipe.
  useEffect(() => {
    if (feed && feed.length <= PREFETCH_THRESHOLD && hasMore) {
      fetchPage(page + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feed, hasMore]);

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
  const isEmpty = Array.isArray(feed) && feed.length === 0 && !hasMore;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-linear-to-br from-primary/10 via-base-100 to-secondary/10">
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

      {!isLoading && !isEmpty && visibleCards.length > 0 && (
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