import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector, useEffect } from 'react-redux';
import { addFeed } from "../utils/feedSlice";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  useEffect(() => {
    getFeed();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>Feed</div>
  )
}

export default Feed;