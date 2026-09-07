import { createSlice } from "@reduxjs/toolkit";

const feedMetaSlice = createSlice({
  name: "feedMeta",
  initialState: { page: 1, hasMore: true },
  reducers: {
    setFeedPage: (state, action) => {
      state.page = action.payload;
    },
    setFeedHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    resetFeedMeta: (state) => {
      state.page = 1;
      state.hasMore = true;
    },
  },
});

export const { setFeedPage, setFeedHasMore, resetFeedMeta } = feedMetaSlice.actions;
export default feedMetaSlice.reducer;