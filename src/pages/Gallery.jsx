import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Image as ImageIcon, 
  Trash2, 
  Edit3, 
  Calendar, 
  X, 
  ChevronLeft, 
  UploadCloud,
  Camera,
  Save,
  Sparkles
} from 'lucide-react';

const Gallery = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  const storageKey = `user-gallery-${currentUser?.username || 'guest'}`;

  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: '', file: '', date: '' });
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(storageKey, JSON.stringify(photos));
    }
  }, [photos, storageKey, currentUser]);

  const getDisplayName = (name) => {
    if (!name) return "Guest";
    return name.split('@')[0].toUpperCase();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1500000) {
        setError("File terlalu besar! Maksimal 1.5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, file: reader.result });
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.file || !formData.date.trim()) {
      setError("Semua data wajib diisi!");
      return;
    }

    if (editId) {
      setPhotos(photos.map(p => p.id === editId ? { ...formData, id: editId } : p));
      setEditId(null);
    } else {
      setPhotos([{ ...formData, id: Date.now() }, ...photos]);
    }

    setFormData({ title: '', file: '', date: '' });
    setIsModalOpen(false);
    setError("");
  };

  const deletePhoto = (id) => {
    if (window.confirm("Hapus kenangan ini secara permanen?")) {
      setPhotos(photos.filter(p => p.id !== id));
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-[100dvh] bg-[#020617] text-white p-5 md:p-8 lg:p-12 relative overflow-x-hidden font-sans">
      
      {/* --- BACKGROUND DECOR --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-2%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/10 blur-[100px]" />
        <div className="absolute bottom-[-5%] left-[-2%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-yellow-600/5 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-1000">
        
        {/* --- HEADER --- */}
        <header className="mb-10 md:mb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all group font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] mb-6">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Base
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
            <div className="space-y-2 md:space-y-4">
              <div className="flex items-center gap-2 text-yellow-500">
                <Sparkles size={16} className="animate-pulse" />
                <span className="text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase italic opacity-70">Visual Archive</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-400 tracking-tighter uppercase italic leading-[0.9]">
                {getDisplayName(currentUser.username)}'S <br className="hidden md:block" /> GALLERY
              </h1>
            </div>
            
            <button 
              onClick={() => { setIsModalOpen(true); setEditId(null); setFormData({title:'', file:'', date:''}) }}
              className="group relative flex items-center justify-center gap-3 bg-white text-black font-black px-6 py-4 md:px-8 md:py-4 rounded-2xl md:rounded-3xl shadow-xl hover:bg-yellow-400 transition-all active:scale-95 text-[10px] md:text-xs tracking-widest uppercase overflow-hidden"
            >
              <Plus size={18} strokeWidth={3} /> Tambah Momen
            </button>
          </div>
        </header>

        {/* --- PHOTO GRID (Responsive: 1 di HP, 2 di Tablet, 3 di Laptop) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative bg-white/[0.02] rounded-[1.8rem] md:rounded-[2.2rem] overflow-hidden border border-white/5 backdrop-blur-3xl transition-all duration-500 hover:-translate-y-2 hover:border-yellow-500/30 shadow-2xl"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="aspect-[11/14] overflow-hidden relative">
                <img 
                  src={photo.file} 
                  alt={photo.title} 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent opacity-90" />
              </div>
              
              <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-end">
                <div className="transform transition-transform duration-500">
                  <div className="flex items-center gap-2 text-yellow-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-2 opacity-80">
                    <Calendar size={10} />
                    {new Date(photo.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <h3 className="text-lg md:text-xl font-black truncate mb-4 md:mb-5 tracking-tight italic uppercase">{photo.title}</h3>
                  
                  <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={() => { setEditId(photo.id); setFormData(photo); setIsModalOpen(true); }} 
                      className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white text-white hover:text-black py-3 rounded-xl text-[9px] font-black transition-all backdrop-blur-md uppercase tracking-widest border border-white/10"
                    >
                      <Edit3 size={12} /> Edit
                    </button>
                    <button 
                      onClick={() => deletePhoto(photo.id)} 
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-3 rounded-xl text-[9px] font-black transition-all backdrop-blur-md uppercase tracking-widest border border-red-500/10"
                    >
                      <Trash2 size={12} /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- EMPTY STATE --- */}
        {photos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 md:py-32 border border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01] text-center">
            <div className="p-6 bg-white/5 rounded-full mb-6 border border-white/5">
               <ImageIcon size={40} className="text-slate-700" />
            </div>
            <h2 className="text-base md:text-lg font-black italic text-slate-500 tracking-widest uppercase">No Archives Found</h2>
          </div>
        )}
      </div>

      {/* --- MODAL SYSTEM (Responsive: Fullscreen di HP, Box di Laptop) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-black/90 md:backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-[#0b1120] border-t md:border border-white/10 p-6 md:p-10 rounded-t-[2.5rem] md:rounded-[2.5rem] w-full max-w-lg md:max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
                  {editId ? <Edit3 className="text-yellow-500" size={20} /> : <UploadCloud className="text-yellow-500" size={20} />}
                  {editId ? 'Modify Clip' : 'New Archive'}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/5 p-3 rounded-full text-slate-500 hover:text-white transition-all">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Moment Title</label>
                <input 
                  type="text" placeholder="TITLE..." 
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:ring-1 focus:ring-yellow-500/50 transition-all text-white text-sm font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Source File</label>
                <div className="relative border border-dashed border-white/10 rounded-2xl p-2 text-center bg-white/[0.02] min-h-[180px] flex items-center justify-center group/upload">
                  <input 
                    type="file" accept="image/*" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  {formData.file ? (
                    <img src={formData.file} className="w-full h-40 object-cover rounded-xl shadow-lg" />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <Camera size={24} className="text-slate-600" />
                      <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">Select Image</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Date</label>
                <input 
                  type="date" 
                  value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none text-slate-300 text-sm font-bold uppercase"
                />
              </div>

              {error && (
                <p className="text-red-500 text-[9px] font-black text-center uppercase tracking-widest">{error}</p>
              )}

              <button 
                type="submit" 
                className="w-full bg-white text-black font-black py-5 rounded-2xl shadow-xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-3 text-[10px] tracking-widest uppercase mt-4"
              >
                <Save size={16} /> Deploy Archive
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;