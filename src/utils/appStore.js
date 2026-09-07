import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import feedReducer from './feedSlice';
import feedMetaReducer from './feedMetaSlice';
import connectionReducer from './connectionSlice';
import requestReducer from './requestSlice';

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    feedMeta: feedMetaReducer,
    connections: connectionReducer,
    requests: requestReducer,
  },
});

export default appStore;