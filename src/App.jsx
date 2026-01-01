import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Halaman
import Home from './pages/Home';
import Wishes from './pages/Wishes';
import Gallery from './pages/Gallery';
import Auth from './pages/Auth'; 

/**
 * Guard Component: ProtectedRoute
 */
const ProtectedRoute = ({ children }) => {
  // Ambil data user dari localStorage
  const user = localStorage.getItem('currentUser');
  
  // Jika tidak ada user, tendang ke halaman login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

/**
 * Guard Component: PublicRoute
 * Mencegah user yang sudah login kembali ke halaman login (Auth)
 */
const PublicRoute = ({ children }) => {
  const user = localStorage.getItem('currentUser');
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      {/* Wrapper Utama */}
      <div className="font-sans antialiased bg-[#020617] min-h-screen text-slate-50 selection:bg-yellow-500 selection:text-black">
        
        <Routes>
          {/* 1. ROUTE LOGIN (Diproteksi agar user yang sudah login tidak bisa masuk sini lagi) */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            } 
          />

          {/* 2. PROTECTED ROUTES (Halaman Privat) */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/wishes" 
            element={
              <ProtectedRoute>
                <Wishes />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/gallery" 
            element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            } 
          />

          {/* 3. CATCH-ALL REDIRECT */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;