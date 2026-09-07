import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: null,
    reducers: {
        addFeed: (state, action) => {
            return action.payload;
        },
        appendFeed: (state, action) => {
            if (!state) return action.payload;
            const existingIds = new Set(state.map((u) => u._id));
            const newUnique = action.payload.filter((u) => !existingIds.has(u._id));
            return [...state, ...newUnique];
        },
        removeUserFromFeed: (state, action) => {
            if (!state) return state;
            return state.filter((user) => user._id !== action.payload);
        },
        removeFeed: () => {
            return null;
        }
    },
});

export const {addFeed, appendFeed, removeUserFromFeed, removeFeed} = feedSlice.actions;
export default feedSlice.reducer;