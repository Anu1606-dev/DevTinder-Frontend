import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { createSocketConnection } from "../utils/socket";
import { incrementUnread, setUnreadCounts } from "../utils/chatSlice";
import { SocketContext } from "./SocketContext";

export const SocketProvider = ({ children }) => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user?._id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      return;
    }

    // ← ADDED: pull real unread counts from the DB on every login/page load,
    // since Redux state alone doesn't survive a refresh
    const hydrateUnreadCounts = async () => {
      try {
        const { data } = await axios.get(BASE_URL + "/chats", { withCredentials: true });
        const counts = {};
        data.data.forEach((chat) => {
          if (chat.unreadCount > 0) counts[chat.targetUserId] = chat.unreadCount;
        });
        dispatch(setUnreadCounts(counts));
      } catch (err) {
        console.error("Failed to hydrate unread counts:", err);
      }
    };
    hydrateUnreadCounts();

    const newSocket = createSocketConnection();
    socketRef.current = newSocket;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing React state with an external socket connection's lifecycle, not mirroring render-time state
    setSocket(newSocket);

    newSocket.on("newMessageNotification", ({ fromUserId }) => {
      dispatch(incrementUnread(fromUserId));
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id, dispatch]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};