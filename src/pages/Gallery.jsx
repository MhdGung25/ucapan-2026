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
  Save
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
    return name.split('@')[0].split(' ')[0].toUpperCase();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1000000) {
        setError("File terlalu besar! Maksimal 1MB.");
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
      setError("Wajib isi semua kolom!");
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
    if (window.confirm("Hapus kenangan ini?")) {
      setPhotos(photos.filter(p => p.id !== id));
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-12 relative overflow-x-hidden transition-all duration-500 font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] -z-10" />
      
      <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in duration-700">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col gap-4 mb-8 md:mb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all group font-bold text-sm">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Beranda
          </Link>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tighter uppercase leading-none truncate max-w-[90vw] select-none">
                ALBUM {getDisplayName(currentUser.username)}
              </h1>
              <p className="text-slate-500 flex items-center gap-2 text-xs md:text-base font-medium">
                <Camera size={16} className="text-yellow-500" /> 
                <span className="truncate tracking-widest uppercase text-[10px] md:text-xs">Abadikan momen 2025-2026</span>
              </p>
            </div>
            
            <button 
              onClick={() => { setIsModalOpen(true); setEditId(null); setFormData({title:'', file:'', date:''}) }}
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-white text-black font-black px-8 py-4 md:px-12 md:py-5 rounded-2xl md:rounded-[2rem] shadow-2xl hover:bg-yellow-400 transition-all active:scale-95 text-sm md:text-base tracking-tighter"
            >
              <Plus size={20} /> TAMBAH FOTO
            </button>
          </div>
        </header>

        {/* --- GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative bg-slate-900/40 rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/5 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-white/10 shadow-xl animate-in zoom-in-95 duration-500"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={photo.file} 
                  alt={photo.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-black/20 to-transparent p-6 md:p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">
                  <Calendar size={12} />
                  {photo.date}
                </div>
                <h3 className="text-xl md:text-2xl font-black truncate mb-5 tracking-tight">{photo.title}</h3>
                
                <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform md:translate-y-4 md:group-hover:translate-y-0">
                  <button 
                    onClick={() => { setEditId(photo.id); setFormData(photo); setIsModalOpen(true); }} 
                    className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white text-white hover:text-black py-3 rounded-2xl text-xs font-black transition-all backdrop-blur-md uppercase tracking-tighter"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => deletePhoto(photo.id)} 
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-3 rounded-2xl text-xs font-black transition-all backdrop-blur-md uppercase tracking-tighter"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {photos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 md:py-40 border-2 border-dashed border-slate-800 rounded-[3rem] text-slate-700 px-6 text-center animate-pulse">
            <div className="p-6 bg-slate-900/50 rounded-full mb-6">
               <ImageIcon size={48} className="opacity-20" />
            </div>
            <p className="font-black italic text-sm md:text-lg tracking-tight">Album kamu masih kosong. Tambahkan momen berhargamu!</p>
          </div>
        )}
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 transition-all duration-300">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-[#0f172a] border-t md:border border-white/10 p-6 md:p-10 rounded-t-[2.5rem] md:rounded-[3.5rem] w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh] md:max-h-none animate-in slide-in-from-bottom-10 duration-500 transform-gpu">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-4 tracking-tighter uppercase">
                {editId ? <Edit3 className="text-yellow-500" size={24} /> : <UploadCloud className="text-yellow-500" size={24} />}
                {editId ? 'Ubah Foto' : 'Foto Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/5 p-3 rounded-full text-slate-500 hover:text-white transition-all active:scale-90">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Judul Memori</p>
                <input 
                  type="text" placeholder="Misal: Malam Tahun Baru" 
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-4 md:p-5 rounded-2xl md:rounded-3xl outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all text-white text-sm md:text-base font-medium"
                />
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Unggah Gambar (Maks 1MB)</p>
                <div className="relative border-2 border-dashed border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-2 text-center hover:border-yellow-500/50 transition-all bg-white/5 overflow-hidden min-h-[160px] flex items-center justify-center">
                  <input 
                    type="file" accept="image/*" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  {formData.file ? (
                    <img src={formData.file} className="w-full h-40 md:h-52 object-cover rounded-[1.2rem] md:rounded-[1.6rem]" />
                  ) : (
                    <div className="py-8 flex flex-col items-center gap-3">
                      <div className="p-4 bg-white/5 rounded-2xl">
                        <UploadCloud size={28} className="text-slate-500" />
                      </div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Pilih File Foto</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Tanggal Momen</p>
                <input 
                  type="date" 
                  value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-4 md:p-5 rounded-2xl md:rounded-3xl outline-none transition-all text-slate-300 text-sm md:text-base font-medium"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 text-red-500 p-3 rounded-xl text-[11px] font-bold text-center animate-pulse border border-red-500/20">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-white text-black font-black py-5 md:py-6 rounded-2xl md:rounded-[2rem] shadow-2xl hover:bg-yellow-400 transition-all active:scale-95 flex items-center justify-center gap-3 text-sm md:text-base tracking-widest uppercase mt-4"
              >
                <Save size={20} /> Simpan Kenangan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;