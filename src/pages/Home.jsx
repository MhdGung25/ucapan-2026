import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Sparkles, History, Heart, Image as ImageIcon, 
  PartyPopper, Rocket, Diamond, LogOut, 
  AlertTriangle, Mountain, Calendar 
} from 'lucide-react';

import Snowfall from '../components/Snowfall';
import Countdown from '../components/Countdown';

const Home = () => {
  const navigate = useNavigate();
  
  // --- LOGIKA TAHUN OTOMATIS ---
  const currentYear = new Date().getFullYear(); // 2026
  const nextYear = currentYear + 1;             // 2027
  const prevYear = currentYear - 1;             // 2025

  // --- STATE DENGAN LAZY INITIALIZATION ---
  // Membaca data langsung dari storage saat pertama kali render
  const [currentUser, setCurrentUser] = useState(() => {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  });

  const [wishes, setWishes] = useState(() => {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      const user = JSON.parse(userString);
      const savedData = localStorage.getItem(`user-wishes-${user.username}`);
      return savedData ? JSON.parse(savedData) : { kesan: "", pesan: "" };
    }
    return { kesan: "", pesan: "" };
  });

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // --- PROTEKSI RUTE ---
  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleFirework = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3');
    audio.play().catch(() => {});
    
    // Animasi Confetti yang lebih padat
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#EAB308', '#FFFFFF', '#3B82F6'],
      zIndex: 999
    });
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-[100dvh] bg-[#020617] flex flex-col items-center text-white p-4 md:p-6 relative overflow-hidden font-sans">
      
      {/* LAYER BACKGROUND DINAMIS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-slate-950 to-[#020617]" />
        {/* Siluet Gunung Parallax */}
        <div className="absolute bottom-0 left-0 w-full h-[30%] bg-blue-900/5 opacity-20" 
             style={{ clipPath: 'polygon(0% 100%, 20% 40%, 45% 85%, 65% 30%, 100% 100%)' }} />
        {/* Glow Ambient */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full h-[300px] bg-blue-500/5 blur-[120px]" />
      </div>

      <Snowfall />

      {/* --- HEADER NAVIGATION --- */}
      <nav className="w-full max-w-6xl flex justify-between items-center z-50 mb-6 animate-in fade-in slide-in-from-top duration-700">
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-lg px-3 py-1.5 rounded-full border border-white/10 shadow-xl">
          <Calendar size={12} className="text-yellow-500" />
          <span className="text-[9px] font-black tracking-widest uppercase">{currentYear} ARCHIVE</span>
        </div>
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="p-2.5 rounded-full bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-500 transition-all border border-white/10 backdrop-blur-md active:scale-90"
        >
          <LogOut size={16} />
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl z-10 -mt-10 md:mt-0">
        <div className="text-center space-y-2 mb-4 animate-in zoom-in duration-1000">
          <div className="flex justify-center items-center gap-2 text-yellow-500/60">
            <Sparkles size={12} className="animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] uppercase font-black italic">
              Mission {nextYear} • {currentUser.username}
            </span>
            <Sparkles size={12} className="animate-pulse" />
          </div>
          
          <h1 className="text-[22vw] md:text-[10rem] lg:text-[12rem] font-black leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-500 italic drop-shadow-2xl select-none">
            {nextYear}
          </h1>
        </div>

        {/* COUNTDOWN */}
        <div className="mb-12 transform scale-90 md:scale-100 drop-shadow-lg animate-in fade-in duration-1000 delay-300">
          <Countdown />
        </div>

        {/* --- GRID KARTU INFORMASI --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10 px-2 animate-in slide-in-from-bottom duration-700 delay-500">
          {/* Card Memory (Arsip Tahun Lalu) */}
          <div className="group p-5 md:p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl hover:border-blue-500/30 transition-all duration-500 shadow-2xl relative overflow-hidden">
            <History size={100} className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500" />
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <History size={14} className="text-blue-400" />
              </div>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Chapter {prevYear}: Memories</span>
            </div>
            <p className="text-sm md:text-base text-slate-300 italic line-clamp-3 leading-relaxed relative z-10 min-h-[3rem]">
              {wishes.kesan ? `"${wishes.kesan}"` : "Tap 'Wishes' untuk mencatat perjalanan tahun lalumu..."}
            </p>
          </div>

          {/* Card Vision (Tujuan Tahun Depan) */}
          <div className="group p-5 md:p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl hover:border-yellow-500/30 transition-all duration-500 shadow-2xl relative overflow-hidden">
            <Sparkles size={100} className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500" />
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Sparkles size={14} className="text-yellow-500" />
              </div>
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Vision {nextYear}: The Goals</span>
            </div>
            <p className="text-sm md:text-base text-yellow-100/70 line-clamp-3 leading-relaxed relative z-10 min-h-[3rem]">
              {wishes.pesan ? `"${wishes.pesan}"` : "Apa resolusi terbesarmu di tahun baru nanti?"}
            </p>
          </div>
        </div>

        {/* --- TOMBOL AKSI --- */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pb-10 px-4 animate-in fade-in duration-700 delay-700">
          <button 
            onClick={handleFirework}
            className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-white text-black px-12 py-4 rounded-2xl font-black text-sm hover:bg-yellow-400 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <PartyPopper size={18} /> CELEBRATE!
          </button>
          
          <div className="flex gap-2">
            <Link to="/wishes" className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl border border-white/10 transition-all text-[10px] font-black tracking-widest backdrop-blur-md">
              <Heart size={14} className="text-red-500" /> WISHES
            </Link>
            <Link to="/gallery" className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl border border-white/10 transition-all text-[10px] font-black tracking-widest backdrop-blur-md">
              <ImageIcon size={14} className="text-blue-400" /> GALLERY
            </Link>
          </div>
        </div>
      </div>

      {/* --- MODAL KONFIRMASI LOGOUT --- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0f172a] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-xs text-center shadow-2xl">
            <div className="bg-red-500/10 text-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-lg font-black italic uppercase mb-2 text-white">Sign Out?</h3>
            <p className="text-xs text-slate-400 mb-8 leading-relaxed">Sesi akan berakhir, namun data jurnalmu tetap aman di perangkat ini.</p>
            <div className="flex flex-col gap-2">
              <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-2xl font-black text-xs transition-colors shadow-lg">LOGOUT SYSTEM</button>
              <button onClick={() => setShowLogoutConfirm(false)} className="w-full bg-white/5 py-4 rounded-2xl font-bold text-xs text-slate-400 hover:bg-white/10">CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* --- DEKORASI FOOTER --- */}
      <footer className="z-10 opacity-30 flex items-center gap-3 mb-4 select-none">
        <Mountain size={14} />
        <span className="text-[8px] font-bold tracking-[0.6em] uppercase">High Altitude Digital Journal</span>
      </footer>

      {/* Ikon Dekoratif Melayang (Hanya Laptop) */}
      <div className="absolute top-[20%] -left-10 opacity-[0.03] hidden lg:block rotate-12">
        <Rocket size={200} />
      </div>
      <div className="absolute bottom-[10%] -right-10 opacity-[0.03] hidden lg:block -rotate-12">
        <Diamond size={200} />
      </div>
    </div>
  );
};

export default Home;