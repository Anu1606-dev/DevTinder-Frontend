import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: "connections",
    initialState: null,
    reducers: {
        addConnections: (state, action) => action.payload,
        addSingleConnection: (state, action) => {
            if (!state) return [action.payload];
            if (state.some((u) => u._id === action.payload._id)) return state;
            return [...state, action.payload];
        },
        clearConnections: () => null,
    },
});

export const { addConnections, addSingleConnection, clearConnections } = connectionSlice.actions;
export default connectionSlice.reducer;