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
  X,
  PenTool,
  Quote
} from 'lucide-react';

const Wishes = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const storageKey = `user-wishes-${currentUser?.username || 'guest'}`;

  const [wishes, setWishes] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : { kesan: "", pesan: "" };
  });

  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  const getFirstName = (name) => {
    if (!name) return "USER";
    return name.split(' ')[0].split('@')[0].toUpperCase();
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(storageKey, JSON.stringify(wishes));
    }
  }, [wishes, storageKey, currentUser]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!wishes.kesan.trim() || !wishes.pesan.trim()) {
      setError("Mohon isi kedua kolom memori & harapan!");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setError("");
    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false);
      navigate('/');
    }, 1800); 
  };

  const resetToEmpty = () => {
    if (window.confirm("Hapus semua tulisan di halaman ini?")) {
      setWishes({ kesan: "", pesan: "" });
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-[100dvh] bg-[#020617] text-white p-4 md:p-8 relative overflow-x-hidden font-sans flex flex-col items-center">
      
      {/* --- BACKGROUND DYNAMICS --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-blue-600/10 blur-[80px] md:blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-purple-600/10 blur-[80px] md:blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        
        {/* --- NAVIGATION & HEADER --- */}
        <header className="mb-8 md:mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all group font-bold text-[10px] uppercase tracking-widest mb-6">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Kembali
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="h-[1px] w-8 bg-yellow-500/50" />
            <span className="text-yellow-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Journal Entry</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500 uppercase italic leading-none mb-3">
            {getFirstName(currentUser?.username)}'S <br className="md:hidden" /> REFLECTIONS
          </h1>
          <p className="text-slate-500 font-medium text-[11px] md:text-xs tracking-wide max-w-md leading-relaxed">
            Simpan potongan memori 2025 dan tuliskan manifestasi terbaikmu untuk menyambut 2026.
          </p>
        </header>

        {/* --- FORM SYSTEM --- */}
        <form onSubmit={handleSave} className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 font-bold text-[10px] uppercase tracking-wider animate-in zoom-in-95">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Section: Kesan 2025 */}
          <div className="relative group">
            <div className="flex items-center gap-2 text-blue-400 mb-3 ml-1">
              <History size={16} />
              <label className="font-black uppercase tracking-widest text-[9px] md:text-[10px]">Memori 2025</label>
            </div>
            
            <div className="relative">
              <Quote className="absolute top-4 left-4 text-white/5" size={32} />
              <textarea 
                value={wishes.kesan}
                onChange={(e) => setWishes({...wishes, kesan: e.target.value})}
                placeholder="Momen apa yang paling mengubah hidupmu tahun ini?"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[2rem] p-6 md:p-8 h-40 md:h-48 focus:ring-1 focus:ring-blue-500/40 focus:bg-blue-500/[0.02] outline-none transition-all resize-none text-slate-200 text-sm md:text-base leading-relaxed backdrop-blur-sm placeholder:text-slate-700 shadow-inner"
              />
            </div>
          </div>

          {/* Section: Pesan 2026 */}
          <div className="relative group">
            <div className="flex items-center gap-2 text-yellow-500 mb-3 ml-1">
              <Sparkles size={16} />
              <label className="font-black uppercase tracking-widest text-[9px] md:text-[10px]">Harapan 2026</label>
            </div>
            
            <div className="relative">
              <PenTool className="absolute top-4 left-4 text-white/5" size={32} />
              <textarea 
                value={wishes.pesan}
                onChange={(e) => setWishes({...wishes, pesan: e.target.value})}
                placeholder="Apa satu hal besar yang ingin kamu capai tahun depan?"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-[2rem] p-6 md:p-8 h-40 md:h-48 focus:ring-1 focus:ring-yellow-500/40 focus:bg-yellow-500/[0.02] outline-none transition-all resize-none text-slate-200 text-sm md:text-base leading-relaxed backdrop-blur-sm placeholder:text-slate-700 shadow-inner"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <button 
              type="button"
              onClick={resetToEmpty}
              className="order-2 md:order-1 flex-1 bg-white/[0.03] text-slate-500 border border-white/5 py-4 rounded-xl md:rounded-2xl font-black hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest active:scale-95"
            >
              <Trash2 size={14} /> Reset
            </button>
            
            <button 
              type="submit"
              disabled={isSaved}
              className={`order-1 md:order-2 flex-[2.5] transition-all duration-500 ${
                isSaved 
                ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                : 'bg-white hover:bg-yellow-400 text-black active:scale-[0.98] shadow-lg'
              } font-black py-4 md:py-5 rounded-xl md:rounded-2xl flex items-center justify-center gap-3 text-xs tracking-widest uppercase`}
            >
              {isSaved ? (
                <>
                  <CheckCircle size={18} className="animate-bounce" />
                  Berhasil Disimpan
                </>
              ) : (
                <>
                  <Save size={18} /> Simpan Catatan
                </>
              )}
            </button>
          </div>
        </form>

        {/* --- FOOTER --- */}
        <footer className="mt-16 mb-8 text-center">
          <p className="text-[8px] md:text-[9px] text-slate-700 font-bold tracking-[0.4em] uppercase italic opacity-50">
            System Locked • Private Archive 2025-2026
          </p>
        </footer>

      </div>
    </div>
  );
};

export default Wishes;