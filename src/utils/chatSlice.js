import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    unreadCounts: {},
    activeChatUserId: null,
  },
  reducers: {
    setActiveChatUserId: (state, action) => {
      state.activeChatUserId = action.payload;
      if (action.payload) {
        state.unreadCounts[action.payload] = 0;
      }
    },
    incrementUnread: (state, action) => {
      const fromUserId = action.payload;
      if (state.activeChatUserId === fromUserId) return;
      state.unreadCounts[fromUserId] = (state.unreadCounts[fromUserId] || 0) + 1;
    },
    setUnreadCounts: (state, action) => {
      state.unreadCounts = action.payload; // ← ADDED: bulk hydration from the backend
    },
    resetChat: () => ({
      unreadCounts: {},
      activeChatUserId: null,
    }),
  },
});

export const { setActiveChatUserId, incrementUnread, setUnreadCounts, resetChat } = chatSlice.actions;
export default chatSlice.reducer;