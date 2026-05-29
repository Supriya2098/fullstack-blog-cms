import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <>
      <Navbar />
      <main className={isAuthPage ? 'main-auth' : 'main-content'}>{children}</main>
      {!isAuthPage && (
        <footer className="footer">
          <div className="container-wide footer-inner">
            <p>Full Stack Developer Blog</p>
          </div>
        </footer>
      )}
    </>
  );
}
