import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSocket } from "../hooks/useSocket";
import { setActiveChatUserId } from "../utils/chatSlice";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const socket = useSocket();
  const dispatch = useDispatch();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null); // ← ADDED
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const { data } = await axios.get(BASE_URL + "/chat/" + targetUserId, {
          withCredentials: true,
        });
        const formatted = data.messages.map((msg) => ({
          firstName: msg.senderId?.firstName,
          text: msg.text,
          senderId: msg.senderId?._id || msg.senderId,
        }));
        setMessages(formatted);

        // ← ADDED: pull the other participant's info for the avatar
        const other = data.participants?.find((p) => p._id !== userId);
        setTargetUser(other || null);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };
    fetchChatHistory();
  }, [targetUserId, userId]);

  useEffect(() => {
    dispatch(setActiveChatUserId(targetUserId));
    return () => dispatch(setActiveChatUserId(null));
  }, [targetUserId, dispatch]);

  useEffect(() => {
    if (!socket || !userId) return;

    socket.emit("joinChat", { targetUserId });

    const handleMessageReceived = ({ firstName, text, senderId }) => {
      setMessages((prev) => [...prev, { firstName, text, senderId }]);
    };

    socket.on("messageReceived", handleMessageReceived);

    return () => {
      socket.off("messageReceived", handleMessageReceived);
    };
  }, [socket, userId, targetUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !socket) return;

    socket.emit("sendMessage", {
      firstName: user.firstName,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto border border-base-300 rounded-lg mt-6">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => {
          const isOwn = msg.senderId === userId;
          const avatarUrl = isOwn ? user.photoUrl : targetUser?.photoUrl; // ← ADDED

          return (
            <div key={index} className={`chat ${isOwn ? "chat-end" : "chat-start"}`}>
              <div className="chat-image avatar"> {/* ← ADDED */}
                <div className="w-8 h-8 rounded-full">
                  <img src={avatarUrl} alt={msg.firstName} />
                </div>
              </div>
              <div className="chat-header">{msg.firstName}</div>
              <div className="chat-bubble">{msg.text}</div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="flex p-4 border-t border-base-300 gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="input input-bordered flex-1 rounded-2xl"
          placeholder="Type a message..."
        />
        <button className="btn btn-primary rounded-2xl" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;