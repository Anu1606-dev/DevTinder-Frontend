import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    unreadCounts: {}, // { [userId]: count }
    activeChatUserId: null, // whichever chat page is currently open, if any
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
      if (state.activeChatUserId === fromUserId) return; // already viewing this chat
      state.unreadCounts[fromUserId] = (state.unreadCounts[fromUserId] || 0) + 1;
    },
    resetChat: () => ({
      unreadCounts: {},
      activeChatUserId: null,
    }),
  },
});

export const { setActiveChatUserId, incrementUnread, resetChat } = chatSlice.actions;
export default chatSlice.reducer;