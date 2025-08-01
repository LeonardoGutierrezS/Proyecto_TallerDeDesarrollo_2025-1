import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';
import '@styles/layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/register';

  // No mostrar sidebar en páginas de autenticación
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
