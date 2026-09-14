import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSocket } from "../hooks/useSocket";
import { setActiveChatUserId } from "../utils/chatSlice";
import { useToast } from "../hooks/useToast"; // ← ADDED
import ReportModal from "./ReportModal"; // ← ADDED

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const socket = useSocket();
  const dispatch = useDispatch();
  const { showToast } = useToast(); // ← ADDED

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [isGeneratingIcebreaker, setIsGeneratingIcebreaker] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // ← ADDED
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

    // ← ADDED: surface moderation/connection errors from the backend
    const handleErrorMessage = (message) => {
      showToast("error", message);
    };

    socket.on("messageReceived", handleMessageReceived);
    socket.on("errorMessage", handleErrorMessage); // ← ADDED

    return () => {
      socket.off("messageReceived", handleMessageReceived);
      socket.off("errorMessage", handleErrorMessage); // ← ADDED
    };
  }, [socket, userId, targetUserId, showToast]);

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

  const handleSuggestIcebreaker = async () => {
    setIsGeneratingIcebreaker(true);
    try {
      const { data } = await axios.get(BASE_URL + "/matching/icebreaker/" + targetUserId, {
        withCredentials: true,
      });
      setNewMessage(data.icebreaker);
    } catch (err) {
      console.error("Failed to generate icebreaker:", err);
    } finally {
      setIsGeneratingIcebreaker(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto border border-base-300 rounded-lg mt-6">
      {/* ← ADDED: chat header with target user info + Report button */}
      <div className="flex items-center justify-between p-3 border-b border-base-300">
        <div className="flex items-center gap-2">
          <img
            src={targetUser?.photoUrl || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"}
            alt={targetUser?.firstName}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold text-base-content">
            {targetUser?.firstName} {targetUser?.lastName}
          </span>
        </div>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="btn btn-ghost btn-xs text-error"
        >
          🚩 Report
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => {
          const isOwn = msg.senderId === userId;
          const avatarUrl = isOwn ? user.photoUrl : targetUser?.photoUrl;

          return (
            <div key={index} className={`chat ${isOwn ? "chat-end" : "chat-start"}`}>
              <div className="chat-image avatar">
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

      {messages.length === 0 && (
        <div className="px-4 pb-2">
          <button
            onClick={handleSuggestIcebreaker}
            disabled={isGeneratingIcebreaker}
            className="btn btn-outline btn-sm gap-2 w-full"
          >
            {isGeneratingIcebreaker ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "✨"
            )}
            {isGeneratingIcebreaker ? "Thinking of something..." : "Suggest an icebreaker"}
          </button>
        </div>
      )}

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

      {/* ← ADDED */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetUserId={targetUserId}
        targetUserName={targetUser?.firstName || "this user"}
      />
    </div>
  );
};

export default Chat;