import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { createSocketConnection } from "../utils/socket";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);
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
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };
    fetchChatHistory();
  }, [targetUserId]);

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { targetUserId });

    socket.on("messageReceived", ({ firstName, text, senderId }) => {
      setMessages((prev) => [...prev, { firstName, text, senderId }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto border border-base-300 rounded-lg mt-6">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${msg.senderId === userId ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-header">{msg.firstName}</div>
            <div className="chat-bubble">{msg.text}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex p-4 border-t border-base-300 gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="input input-bordered flex-1"
          placeholder="Type a message..."
        />
        <button className="btn btn-primary" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;