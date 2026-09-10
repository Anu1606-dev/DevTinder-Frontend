import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const ChatList = () => {
  const [conversations, setConversations] = useState(null);
  const unreadCounts = useSelector((store) => store.chat.unreadCounts);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get(BASE_URL + "/chats", { withCredentials: true });
        setConversations(data.data);
      } catch (err) {
        console.error("Failed to load chats:", err);
        setConversations([]);
      }
    };
    fetchChats();
  }, []);

  const isLoading = conversations === null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-primary mb-6">Chats</h2>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-3 border border-base-300 rounded-xl">
              <div className="skeleton h-14 w-14 rounded-full shrink-0"></div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="skeleton h-4 w-1/3 rounded"></div>
                <div className="skeleton h-3 w-2/3 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && conversations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-lg font-bold text-base-content mb-2">No conversations yet</h3>
          <p className="text-base-content/60">Start chatting with your connections to see them here.</p>
        </div>
      )}

      {!isLoading && conversations.length > 0 && (
        <div className="flex flex-col gap-2">
          {conversations.map((chat) => {
            const unread = unreadCounts[chat.targetUserId] || 0;
            return (
              <Link
                key={chat.targetUserId}
                to={`/chat/${chat.targetUserId}`}
                className="flex items-center gap-4 p-3 border border-base-300 rounded-xl hover:bg-base-200 transition-colors"
              >
                <img
                  src={chat.photoUrl || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"}
                  alt={chat.firstName}
                  className="w-14 h-14 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className={`truncate ${unread > 0 ? "font-bold text-base-content" : "font-medium text-base-content/90"}`}>
                    {chat.firstName} {chat.lastName}
                  </h3>
                  <p className={`text-sm truncate ${unread > 0 ? "font-semibold text-base-content" : "text-base-content/60"}`}>
                    {chat.lastMessageText || "Say hi 👋"}
                  </p>
                </div>
                {unread > 0 && <span className="badge badge-primary badge-sm">{unread}</span>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatList;