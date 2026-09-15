import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { createSocketConnection } from "../utils/socket";
import { incrementUnread, setUnreadCounts } from "../utils/chatSlice";
import { useToast } from "../hooks/useToast"; // ← ADDED
import { SocketContext } from "./SocketContext";

export const SocketProvider = ({ children }) => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const { showToast } = useToast(); // ← ADDED

  useEffect(() => {
    if (!user?._id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      return;
    }

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

    // ← ADDED: two staggered toasts when someone signs up using this user's referral link
    newSocket.on("referralBonusApplied", ({ newUserFirstName, bonusDays, newReferralCount }) => {
      showToast("success", `🎉 ${newUserFirstName} joined using your link! (${newReferralCount} friend${newReferralCount > 1 ? "s" : ""} total)`);
      setTimeout(() => {
        showToast("success", `You got ${bonusDays} days of Premium access!`);
      }, 700);
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id, dispatch, showToast]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};