import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Sparkles, Lock, Save, Loader2, CheckCircle, BellRing, BellOff 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('userAuth');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  
  const [phase, setPhase] = useState('auth');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hari: 0, jam: 0, menit: 0, detik: 0 });
  const [isReady, setIsReady] = useState(false);
  const [notifPermission, setNotifPermission] = useState(Notification.permission);

  const FORM_ENDPOINT = "https://formsubmit.co/muhammadgung2003@gmail.com";
  const GOOGLE_CLIENT_ID = "558230089000-ei09o0314gugru2pqig5iskdb2rdbs38.apps.googleusercontent.com"; 

  // PWA Service Worker Registration - Dioptimasi untuk HP
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW Registered:', reg.scope))
        .catch(err => console.error('SW Error:', err));
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setPhase('auth');
    } else {
      const hasSubmitted = localStorage.getItem(`submitted_${user.email}`) === 'true';
      setPhase(hasSubmitted ? 'idle' : 'feedback');
    }
  }, [user]);

  const triggerNewYearNotif = useCallback(() => {
    if (Notification.permission === 'granted' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification("SELAMAT TAHUN BARU 2026! 🎉", {
          body: `Halo ${user?.given_name || 'Pejuang'}, gerbang harapanmu sudah terbuka!`,
          icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
          vibrate: [500, 110, 500],
          requireInteraction: true
        });
      });
    }
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      const targetDate = new Date("January 1, 2026 00:00:00").getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        if (!isReady) triggerNewYearNotif();
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
  }, [isReady, triggerNewYearNotif]);

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

  const handleLoginSuccess = (res) => {
    const decoded = jwtDecode(res.credential);
    setUser(decoded);
    localStorage.setItem('userAuth', JSON.stringify(decoded));
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        if (Notification.permission === 'default') requestNotif();
      }
    } catch {
      alert("Gagal mengirim pesan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stars = useMemo(() => [...Array(40)].map((_, i) => ({
    id: i, top: Math.random() * 100, left: Math.random() * 100, size: Math.random() * 2 + 1, delay: Math.random() * 5
  })), []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white relative p-6">
        
        {/* Background Stars */}
        <div className="fixed inset-0 pointer-events-none opacity-20">
          {stars.map((s) => (
            <div key={s.id} className="absolute bg-white rounded-full animate-pulse"
              style={{ top: `${s.top}%`, left: `${s.left}%`, width: `${s.size}px`, height: `${s.size}px`, animationDelay: `${s.delay}s` }}
            />
          ))}
        </div>

        <div className="max-w-2xl w-full z-10">
          {phase === 'auth' && (
            <div className="space-y-8">
              <div className="flex justify-center"><Sparkles className="text-orange-500 w-12 h-12 animate-bounce" /></div>
              <h1 className="text-5xl font-black italic uppercase tracking-tighter">Masuk Untuk <br/> Menulis Pesan</h1>
              <div className="flex justify-center py-10">
                <GoogleLogin onSuccess={handleLoginSuccess} onError={() => alert('Login Gagal')} theme="filled_blue" shape="pill" />
              </div>
            </div>
          )}

          {phase === 'feedback' && user && (
            <div className="space-y-6 flex flex-col items-center">
              <h2 className="font-black text-3xl italic uppercase">Halo, <span className="text-orange-500">{user.given_name}</span></h2>
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] w-full">
                <textarea 
                  className="w-full bg-transparent outline-none text-xl italic text-white h-40 text-center"
                  placeholder="Tuliskan harapanmu untuk 2025..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button onClick={handleSubmitFeedback} disabled={isSubmitting || !feedback.trim()} className="w-full mt-8 bg-orange-500 py-5 rounded-2xl font-black flex items-center justify-center gap-3">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <><Save size={20}/> SIMPAN KE 2026</>}
                </button>
              </div>
            </div>
          )}

          {phase === 'idle' && (
            <div className="space-y-8">
               <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-green-400 text-[10px] font-black uppercase bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20">
                    <CheckCircle size={12} /> Pesan Berhasil Disimpan
                  </div>
                  {notifPermission !== 'granted' && (
                    <button onClick={requestNotif} className="text-orange-400 text-[10px] font-bold uppercase border border-orange-500/30 px-4 py-2 rounded-full">
                      <BellRing size={12} className="inline mr-2" /> Aktifkan Alarm 2026
                    </button>
                  )}
                  <h2 className="text-5xl font-black italic uppercase">Sampai Jumpa <br/> di 2026</h2>
               </div>
               <div className="flex justify-center gap-3">
                {Object.entries(timeLeft).map(([label, value]) => (
                  <div key={label} className="bg-white/5 p-4 rounded-3xl border border-white/5 min-w-[70px]">
                    <div className="text-3xl font-black">{String(value).padStart(2, '0')}</div>
                    <div className="text-[8px] uppercase opacity-30">{label}</div>
                  </div>
                ))}
               </div>
               <button disabled className="w-full py-6 rounded-2xl font-black bg-slate-900 border border-white/5 text-slate-500 opacity-50">
                 <Lock size={18} className="inline mr-2" /> {isReady ? "GERBANG TERBUKA!" : "GERBANG MASIH TERKUNCI"}
               </button>
            </div>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;