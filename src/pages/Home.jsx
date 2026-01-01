import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  History, 
  Heart, 
  Image as ImageIcon, 
  PartyPopper, 
  Rocket,
  Diamond,
  LogOut,
  AlertTriangle
} from 'lucide-react';

import Snowfall from '../components/Snowfall';
import Countdown from '../components/Countdown';

const Home = () => {
  const navigate = useNavigate();
  
  // State dasar
  const [currentUser, setCurrentUser] = useState(null);
  const [wishes, setWishes] = useState({ kesan: "", pesan: "" });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem('currentUser');
    
    // Jika tidak ada user, langsung arahkan ke login
    if (!userString) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userString);

    // FIX GARIS MERAH: Hanya update state jika data berbeda atau state masih null
    // Ini mencegah loop render yang menyebabkan peringatan "cascading renders"
    setCurrentUser((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(user)) {
        return user;
      }
      return prev;
    });

    const savedData = localStorage.getItem(`user-wishes-${user.username}`);
    if (savedData) {
      const parsedWishes = JSON.parse(savedData);
      setWishes((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(parsedWishes)) {
          return parsedWishes;
        }
        return prev;
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleFirework = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3');
    audio.play().catch(() => {});

    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // Tampilan loading sederhana jika user belum ter-load
  if (!currentUser) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-start md:justify-center text-white p-6 md:p-12 relative overflow-hidden transition-all duration-500 font-sans">
      <Snowfall />

      {/* --- FLOATING LOGOUT --- */}
      <button 
        onClick={() => setShowLogoutConfirm(true)}
        className="fixed top-6 right-6 z-[60] p-4 rounded-full bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-500 transition-all border border-white/10 backdrop-blur-xl shadow-2xl active:scale-90"
      >
        <LogOut size={20} />
      </button>

      {/* --- LOGOUT MODAL --- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-[#0f172a] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl text-center animate-in zoom-in duration-300">
            <div className="inline-flex p-4 rounded-3xl bg-red-500/10 text-red-500 mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight mb-2 italic">Konfirmasi Keluar</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">Semua catatanmu tetap tersimpan. Sampai jumpa di lain waktu!</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95">YA, KELUAR</button>
              <button onClick={() => setShowLogoutConfirm(false)} className="w-full bg-white/5 hover:bg-white/10 text-slate-300 font-bold py-4 rounded-2xl transition-all">BATAL</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl w-full flex flex-col items-center relative z-10 pt-12 md:pt-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-8 w-full px-4">
          <div className="flex justify-center items-center gap-2 text-yellow-500 mb-4 opacity-80">
            <Sparkles size={16} className="animate-pulse" />
            <span className="font-bold tracking-[0.3em] text-[10px] md:text-xs uppercase">
              {currentUser.username} • 2026 JOURNEY
            </span>
            <Sparkles size={16} className="animate-pulse" />
          </div>
          <h1 className="text-[18vw] md:text-[10rem] lg:text-[12rem] font-black tracking-tighter leading-[0.8] bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-600 drop-shadow-2xl mb-10 select-none animate-in zoom-in duration-1000">
            2026
          </h1>
          <div className="flex justify-center scale-90 md:scale-110 mb-14">
            <Countdown />
          </div>
        </div>

        {/* --- CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-4xl px-4 mb-14">
          <div className="group p-6 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400"><History size={20} /></div>
              <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-blue-400/80">Memori 2025</h3>
            </div>
            <p className="text-slate-400 text-sm md:text-base italic leading-relaxed line-clamp-4 min-h-[4.5rem]">
              {wishes.kesan ? `"${wishes.kesan}"` : "Belum ada rekaman memori..."}
            </p>
          </div>

          <div className="group p-6 md:p-10 rounded-[2.5rem] bg-yellow-500/[0.02] border border-yellow-500/10 backdrop-blur-3xl hover:border-yellow-500/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-2xl bg-yellow-500/10 text-yellow-500"><Sparkles size={20} /></div>
              <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-yellow-500/80">Harapan 2026</h3>
            </div>
            <p className="text-yellow-100/60 text-sm md:text-base leading-relaxed line-clamp-4 min-h-[4.5rem]">
              {wishes.pesan ? `"${wishes.pesan}"` : "Tuliskan impian besarmu..."}
            </p>
          </div>
        </div>

        {/* --- NAVIGATION --- */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full px-4">
          <button 
            onClick={handleFirework}
            className="w-full md:w-auto flex items-center justify-center gap-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black px-12 py-5 rounded-[2.2rem] font-black text-lg shadow-[0_15px_40px_-10px_rgba(245,158,11,0.5)] uppercase tracking-tighter transition-all hover:scale-105 active:scale-95 group"
          >
            <PartyPopper size={24} className="group-hover:rotate-12 transition-transform" /> Rayakan!
          </button>

          <div className="flex gap-3 w-full md:w-auto justify-center">
            <Link to="/wishes" className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white/5 hover:bg-white text-white hover:text-black px-8 py-5 rounded-[2.2rem] border border-white/10 transition-all font-black text-[11px] uppercase tracking-widest min-w-[140px] active:scale-95">
              <Heart size={16} className="text-red-500" /> Catatan
            </Link>
            <Link to="/gallery" className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white/5 hover:bg-white text-white hover:text-black px-8 py-5 rounded-[2.2rem] border border-white/10 transition-all font-black text-[11px] uppercase tracking-widest min-w-[140px] active:scale-95">
              <ImageIcon size={16} className="text-blue-400" /> Galeri
            </Link>
          </div>
        </div>
      </div>

      {/* --- DECORATIONS --- */}
      <div className="absolute top-[15%] left-[5%] opacity-10 hidden xl:block pointer-events-none animate-bounce duration-[3000ms]">
        <Rocket size={100} strokeWidth={1} className="text-blue-400 rotate-12" />
      </div>
      <div className="absolute bottom-[15%] right-[5%] opacity-10 hidden xl:block pointer-events-none animate-pulse duration-[4000ms]">
        <Diamond size={100} strokeWidth={1} className="text-yellow-500 -rotate-12" />
      </div>
    </div>
  );
};

export default Home;