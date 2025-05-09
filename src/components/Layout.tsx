// ProtectedLayout.jsx
import { Outlet } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SideBar from './common/SideBar';
import NavBar from './common/NavBar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoggedIn } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [location.pathname, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
      <div className="flex h-screen bg-gray-100" >
      {isLoggedIn && (
        <>
          <SideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
            <NavBar toggleSidebar={toggleSidebar} />
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
