import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Save, 
  Trash2, 
  History, 
  Sparkles, 
  ChevronLeft, 
  CheckCircle, 
  AlertCircle,
  X
} from 'lucide-react';

const Wishes = () => {
  const navigate = useNavigate();
  
  // 1. Ambil data User & Key unik
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const storageKey = `user-wishes-${currentUser?.username || 'guest'}`;

  // 2. State Data
  const [wishes, setWishes] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : { kesan: "", pesan: "" };
  });

  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  // Fungsi pembantu untuk memotong nama panjang/email
  const getFirstName = (name) => {
    if (!name) return "KAMU";
    return name.split(' ')[0].split('@')[0].toUpperCase();
  };

  // 3. Simpan otomatis ke localStorage saat mengetik
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(storageKey, JSON.stringify(wishes));
    }
  }, [wishes, storageKey, currentUser]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!wishes.kesan.trim() || !wishes.pesan.trim()) {
      setError("Wajib isi semua kolom!");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setError("");
    setIsSaved(true);

    // Animasi redirect sederhana
    setTimeout(() => {
      setIsSaved(false);
      navigate('/');
    }, 1500); 
  };

  const resetToEmpty = () => {
    if (window.confirm("Kosongkan semua tulisan?")) {
      setWishes({ kesan: "", pesan: "" });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-12 relative overflow-x-hidden transition-all duration-500">
      
      {/* Background Ornaments (CSS Blur) */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-5%] right-[-10%] w-64 h-64 md:w-96 md:h-96 bg-blue-600 rounded-full blur-[80px] md:blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-5%] left-[-10%] w-64 h-64 md:w-96 md:h-96 bg-purple-600 rounded-full blur-[80px] md:blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10 pt-4">
        
        {/* HEADER */}
        <header className="mb-8 md:mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all mb-6 group font-bold text-sm">
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Batal
          </Link>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent uppercase leading-tight select-none">
            CATATAN {getFirstName(currentUser?.username)}
          </h1>
          <p className="text-slate-500 mt-2 font-medium italic text-xs md:text-sm">
            Tuliskan memori 2025 dan impian 2026 milikmu.
          </p>
        </header>

        {/* FORM UTAMA */}
        <form 
          onSubmit={handleSave}
          className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          {/* Error Alert (Pure CSS Show/Hide) */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl flex items-center justify-between font-bold text-xs animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-3">
                <AlertCircle size={18} />
                {error}
              </div>
              <button type="button" onClick={() => setError("")}><X size={16}/></button>
            </div>
          )}

          {/* Input Kesan (2025) */}
          <div className="space-y-3 group">
            <div className="flex items-center gap-2 text-blue-400 ml-1 transition-colors group-focus-within:text-blue-300">
              <History size={18} />
              <label className="font-black uppercase tracking-widest text-[10px]">Memori 2025</label>
            </div>
            <textarea 
              value={wishes.kesan}
              onChange={(e) => setWishes({...wishes, kesan: e.target.value})}
              placeholder="Apa hal paling berkesan di 2025?"
              className="w-full bg-slate-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 h-40 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 outline-none transition-all resize-none text-slate-200 text-sm md:text-base backdrop-blur-sm shadow-inner"
            />
          </div>

          {/* Input Pesan (2026) */}
          <div className="space-y-3 group">
            <div className="flex items-center gap-2 text-yellow-500 ml-1 transition-colors group-focus-within:text-yellow-400">
              <Sparkles size={18} />
              <label className="font-black uppercase tracking-widest text-[10px]">Harapan 2026</label>
            </div>
            <textarea 
              value={wishes.pesan}
              onChange={(e) => setWishes({...wishes, pesan: e.target.value})}
              placeholder="Apa resolusi terbesarmu tahun ini?"
              className="w-full bg-slate-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 h-40 focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500/30 outline-none transition-all resize-none text-slate-200 text-sm md:text-base backdrop-blur-sm shadow-inner"
            />
          </div>

          {/* TOMBOL AKSI */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-2">
            <button 
              type="submit"
              disabled={isSaved}
              className={`order-1 md:order-2 flex-[2] transition-all duration-300 ${
                isSaved 
                ? 'bg-green-500 text-white' 
                : 'bg-white hover:bg-yellow-400 text-black active:scale-95'
              } font-black py-4 md:py-5 rounded-2xl md:rounded-3xl flex items-center justify-center gap-3 shadow-xl text-sm md:text-base`}
            >
              {isSaved ? (
                <>
                  <CheckCircle size={20} className="animate-bounce" />
                  TERSIPAN!
                </>
              ) : (
                <>
                  <Save size={20} />
                  SIMPAN CATATAN
                </>
              )}
            </button>
            
            <button 
              type="button"
              onClick={resetToEmpty}
              className="order-2 md:order-1 flex-1 bg-white/5 text-slate-400 border border-white/5 py-4 md:py-5 rounded-2xl md:rounded-3xl font-bold hover:bg-red-500/10 hover:text-red-500 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest"
            >
              <Trash2 size={16} /> Bersihkan
            </button>
          </div>
        </form>

        <footer className="mt-12 text-center opacity-50">
           <p className="text-[10px] text-slate-600 font-bold tracking-[0.2em] uppercase">Private Encryption Active</p>
        </footer>

      </div>
    </div>
  );
};

export default Wishes;