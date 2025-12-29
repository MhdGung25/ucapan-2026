import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Lock, Save, Loader2, CheckCircle, Heart, MessageCircle, BellRing, BellOff 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('userAuth');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [phase, setPhase] = useState('auth');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hari: 0, jam: 0, menit: 0, detik: 0 });
  const [isReady, setIsReady] = useState(false);
  const [notifPermission, setNotifPermission] = useState(Notification.permission);

  const FORM_ENDPOINT = "https://formsubmit.co/muhammadgung2003@gmail.com";
  const GOOGLE_CLIENT_ID = "558230089000-ei09o0314gugru2pqig5iskdb2rdbs38.apps.googleusercontent.com"; 

  // Register Service Worker untuk Notifikasi Background
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        console.log('SW Registered!', reg);
      }).catch(err => console.log('SW Registration failed', err));
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setPhase('auth');
    } else {
      const hasSubmittedEmail = localStorage.getItem(`submitted_${user.email}`) === 'true';
      setPhase(hasSubmittedEmail ? 'idle' : 'feedback');
    }
  }, [user]);

  // Logic Countdown & Auto-Notification
  useEffect(() => {
    const timer = setInterval(() => {
      const targetDate = new Date("January 1, 2026 00:00:00").getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        if (!isReady) triggerNewYearNotif(); // Panggil notif saat pas nol
        setIsReady(true);
        setTimeLeft({ hari: 0, jam: 0, menit: 0, detik: 0 });
        clearInterval(timer);
      } else {
        setIsReady(false);
        setTimeLeft({
          hari: Math.floor(difference / (1000 * 60 * 60 * 24)),
          jam: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          menit: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          detik: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isReady]);

  const requestNotif = async () => {
    const permission = await Notification.requestPermission();
    setNotifPermission(permission);
    if (permission === 'granted') {
      new Notification("Notifikasi Aktif!", { 
        body: "Kami akan memberitahumu saat 2026 tiba.",
        icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png"
      });
    }
  };

  const triggerNewYearNotif = () => {
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification("SELAMAT TAHUN BARU 2026! 🎉", {
          body: `Halo ${user?.given_name || 'Pejuang'}, gerbang harapanmu sudah terbuka!`,
          vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500],
          requireInteraction: true // Notif tidak akan hilang sampai di-klik
        });
      });
    }
  };

  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setUser(decoded);
      localStorage.setItem('userAuth', JSON.stringify(decoded));
    } catch (err) {
      alert("Gagal login.");
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          Nama: user.name,
          Email: user.email,
          Pesan: feedback,
          _subject: `Pesan 2025: ${user.name}`
        })
      });

      if (response.ok) {
        localStorage.setItem(`submitted_${user.email}`, 'true');
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        setPhase('idle');
        requestNotif(); // Tawarkan notif setelah isi pesan
      }
    } catch (error) {
      alert("Gagal mengirim.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const starPositions = useMemo(() => [...Array(40)].map((_, i) => ({
    id: i, top: Math.random() * 100, left: Math.random() * 100, size: Math.random() * 2 + 1, delay: Math.random() * 5
  })), []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden relative font-sans text-center p-6">
        
        {/* Star Background */}
        <div className="fixed inset-0 pointer-events-none opacity-20">
          {starPositions.map((star) => (
            <div key={star.id} className="absolute bg-white rounded-full animate-pulse"
              style={{ top: `${star.top}%`, left: `${star.left}%`, width: `${star.size}px`, height: `${star.size}px`, animationDelay: `${star.delay}s` }}
            />
          ))}
        </div>

        <div className="max-w-2xl w-full z-10">
          
          {phase === 'auth' && (
            <div className="animate-in fade-in zoom-in duration-700 space-y-8">
              <div className="flex justify-center"><Sparkles className="text-orange-500 w-12 h-12 animate-bounce" /></div>
              <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-tight">Masuk Untuk <br/> Menulis Pesan</h1>
              <div className="flex justify-center scale-110 md:scale-125 py-10">
                <GoogleLogin onSuccess={handleLoginSuccess} onError={() => alert('Login Gagal!')} theme="filled_blue" shape="pill" />
              </div>
            </div>
          )}

          {phase === 'feedback' && user && (
            <div className="animate-in slide-in-from-bottom duration-500 space-y-6 flex flex-col items-center">
              <div className="text-center space-y-1">
                <p className="text-[10px] opacity-40 font-bold uppercase tracking-[0.4em]">Konfirmasi Identitas</p>
                <h2 className="font-black text-white text-3xl md:text-4xl italic uppercase tracking-tighter">
                  Halo, <span className="text-orange-500">{user.given_name}</span>
                </h2>
              </div>
              
              <div className="bg-white/5 border border-white/10 p-6 md:p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl w-full">
                <textarea 
                  className="w-full bg-transparent outline-none text-xl md:text-2xl italic text-white placeholder:text-white/10 resize-none h-40 text-center leading-relaxed"
                  placeholder="Tuliskan harapan atau pesanmu untuk 2025 di sini..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button 
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting || !feedback.trim()}
                  className="w-full mt-8 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-800 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <><Save size={20}/> SIMPAN PESAN KE 2026</>}
                </button>
              </div>
            </div>
          )}

          {phase === 'idle' && (
            <div className="space-y-8 animate-in fade-in duration-700">
               <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-green-400 text-[10px] font-black uppercase tracking-[0.3em] bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20">
                    <CheckCircle size={12} /> Pesan Berhasil Disimpan
                  </div>
                  
                  {/* Notification Toggle Button */}
                  {notifPermission !== 'granted' ? (
                    <button onClick={requestNotif} className="flex items-center gap-2 text-orange-400 text-[10px] font-bold uppercase border border-orange-500/30 px-4 py-2 rounded-full hover:bg-orange-500/10 transition-all">
                      <BellRing size={12} className="animate-shake" /> Aktifkan Alarm Tahun Baru
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase border border-blue-500/30 px-4 py-2 rounded-full bg-blue-500/5">
                      <BellOff size={12} /> Alarm 2026 Sudah Aktif
                    </div>
                  )}

                  <h2 className="text-5xl md:text-6xl font-black italic mt-4 tracking-tighter uppercase leading-tight">Sampai Jumpa <br/> di 2026</h2>
                  <p className="opacity-50 text-sm italic text-orange-400">Harapanmu telah kami kunci di dalam kapsul waktu.</p>
               </div>

               <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
                {Object.entries(timeLeft).map(([label, value]) => (
                  <div key={label} className="bg-white/5 p-4 md:p-6 rounded-3xl border border-white/5 min-w-[80px]">
                    <div className="text-3xl md:text-5xl font-black tabular-nums">{String(value).padStart(2, '0')}</div>
                    <div className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-30 mt-2">{label}</div>
                  </div>
                ))}
               </div>

               <button disabled className={`w-full py-6 rounded-2xl font-black flex items-center justify-center gap-3 transition-all ${isReady ? 'bg-green-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'bg-slate-900 border border-white/5 text-slate-500 opacity-50'}`}>
                 <Lock size={18} /> {isReady ? "GERBANG TERBUKA!" : "GERBANG 2026 MASIH TERKUNCI"}
               </button>
            </div>
          )}

        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;