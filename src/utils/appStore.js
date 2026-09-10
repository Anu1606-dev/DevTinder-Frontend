import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import feedReducer from './feedSlice';
import feedMetaReducer from './feedMetaSlice';
import connectionReducer from './connectionSlice';
import requestReducer from './requestSlice';
import chatReducer from './chatSlice'; // ← ADDED

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    feedMeta: feedMetaReducer,
    connections: connectionReducer,
    requests: requestReducer,
    chat: chatReducer, // ← ADDED
  },
});

export default appStore;