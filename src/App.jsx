import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Halaman
import Home from './pages/Home';
import Wishes from './pages/Wishes';
import Gallery from './pages/Gallery';
import Auth from './pages/Auth'; 

/**
 * Guard Component: ProtectedRoute
 * Mengecek ketersediaan session user di localStorage.
 */
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('currentUser');
  
  // Jika data user TIDAK ADA, arahkan ke login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Jika ADA, tampilkan halaman yang diminta
  return children;
};

function App() {
  return (
    <Router>
      {/* Wrapper Utama dengan Background gelap konsisten */}
      <div className="font-sans antialiased bg-[#020617] min-h-screen text-slate-50 selection:bg-yellow-500 selection:text-black">
        
        <Routes>
          {/* 1. ROUTE LOGIN (Pintu Masuk Utama) */}
          <Route path="/login" element={<Auth />} />

          {/* 2. PROTECTED ROUTES (Halaman Privat) */}
          {/* Halaman Home */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          
          {/* Halaman Wishes */}
          <Route 
            path="/wishes" 
            element={
              <ProtectedRoute>
                <Wishes />
              </ProtectedRoute>
            } 
          />
          
          {/* Halaman Gallery */}
          <Route 
            path="/gallery" 
            element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            } 
          />

          {/* 3. CATCH-ALL REDIRECT */}
          {/* Jika user mengakses path ngasal, arahkan ke Home (yang akan dicek login-nya) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;