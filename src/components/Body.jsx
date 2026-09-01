import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Body = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(res.data));

    } catch (error) {
      if (error.status === 401) {
        Navigate("/login");
      };
      console.error("Error fetching user:", error);
    };
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Body