import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { About } from './components/About';
import { Location } from './components/Location';
import { Menu } from './components/Menu';
import { Reservation } from './components/Reservation';
import { Order } from './components/Order';
import { Coupons } from './components/Coupons';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminReservations } from './components/admin/AdminReservations';
import { AdminMenu } from './components/admin/AdminMenu';
import { AdminCoupons } from './components/admin/AdminCoupons';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIRecommendation } from './components/AIRecommendation';
import { initializeData } from './utils/dataInitializer';

export type Page = 'home' | 'about' | 'location' | 'menu' | 'reservation' | 'order' | 'coupons' | 'admin-login' | 'admin-dashboard' | 'admin-orders' | 'admin-reservations' | 'admin-menu' | 'admin-coupons';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAIWidget, setShowAIWidget] = useState(false);

  useEffect(() => {
    // Initialize data on first load
    initializeData();
    
    // Check if admin is logged in
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      const session = JSON.parse(adminSession);
      if (session.expiresAt > Date.now()) {
        setIsAdminLoggedIn(true);
      } else {
        localStorage.removeItem('adminSession');
      }
    }
  }, []);

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setCurrentPage('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('adminSession');
    setCurrentPage('home');
  };

  const navigateTo = (page: Page) => {
    // Prevent access to admin pages if not logged in
    if (page.startsWith('admin-') && page !== 'admin-login' && !isAdminLoggedIn) {
      setCurrentPage('admin-login');
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminPage = currentPage.startsWith('admin-');

  return (
    <div className="min-h-screen bg-white">
      {!isAdminPage && <Navbar currentPage={currentPage} onNavigate={navigateTo} />}
      
      <main>
        {currentPage === 'home' && <Home onNavigate={navigateTo} />}
        {currentPage === 'about' && <About />}
        {currentPage === 'location' && <Location />}
        {currentPage === 'menu' && <Menu onNavigate={navigateTo} />}
        {currentPage === 'reservation' && <Reservation />}
        {currentPage === 'order' && <Order />}
        {currentPage === 'coupons' && <Coupons />}
        
        {currentPage === 'admin-login' && !isAdminLoggedIn && (
          <AdminLogin onLogin={handleAdminLogin} />
        )}
        {currentPage === 'admin-dashboard' && isAdminLoggedIn && (
          <AdminDashboard onNavigate={navigateTo} onLogout={handleAdminLogout} />
        )}
        {currentPage === 'admin-orders' && isAdminLoggedIn && (
          <AdminOrders onNavigate={navigateTo} onLogout={handleAdminLogout} />
        )}
        {currentPage === 'admin-reservations' && isAdminLoggedIn && (
          <AdminReservations onNavigate={navigateTo} onLogout={handleAdminLogout} />
        )}
        {currentPage === 'admin-menu' && isAdminLoggedIn && (
          <AdminMenu onNavigate={navigateTo} onLogout={handleAdminLogout} />
        )}
        {currentPage === 'admin-coupons' && isAdminLoggedIn && (
          <AdminCoupons onNavigate={navigateTo} onLogout={handleAdminLogout} />
        )}
      </main>

      {!isAdminPage && <Footer onNavigate={navigateTo} />}
      
      {!isAdminPage && !showAIWidget && (
        <button
          onClick={() => setShowAIWidget(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          aria-label="AI Recommendation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </button>
      )}
      
      {!isAdminPage && showAIWidget && (
        <AIRecommendation onClose={() => setShowAIWidget(false)} />
      )}
    </div>
  );
}
