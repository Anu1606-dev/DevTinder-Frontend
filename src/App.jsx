import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Body from './components/Body';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import { Provider } from 'react-redux';
import appStore from './utils/appStore';
import Feed from './components/Feed';
import Connections from './components/Connections';
import Requests from './components/Requests';
import NotFound from './components/NotFound';
import Premium from "./components/Premium";
import Chat from "./components/Chat";
import ChatList from "./components/ChatList";
import AdminReports from "./components/AdminReports"; // ← ADDED
import { SocketProvider } from "./contexts/SocketProvider";
import PremiumAnalytics from "./components/PremiumAnalytics";

function App() {
  return (
    <Provider store={appStore}>
      <SocketProvider>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/chat/:targetUserId" element={<Chat />} />
              <Route path="/chatlist" element={<ChatList />} />
              <Route path="/admin/reports" element={<AdminReports />} /> 
              <Route path="/premium/analytics" element={<PremiumAnalytics />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </Provider>
  );
}

export default App;