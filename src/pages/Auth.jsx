import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Contact, 
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [formData, setFormData] = useState({ 
    fullName: '', 
    username: '', 
    password: '', 
    confirmPassword: '' 
  });
  
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  // Memuat data Remember Me dengan pencegahan loop render
  useEffect(() => {
    const savedUser = localStorage.getItem('rememberedUser');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setFormData(prev => {
        if (prev.username !== parsed.username) {
          return { ...prev, username: parsed.username };
        }
        return prev;
      });
      setRememberMe(true);
    }
  }, []);

  const handleAuth = (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    
    const users = JSON.parse(localStorage.getItem('app-users') || '[]');

    if (isLogin) {
      const user = users.find(u => u.username === formData.username && u.password === formData.password);
      
      if (user) {
        if (rememberMe) {
          localStorage.setItem('rememberedUser', JSON.stringify({ username: user.username }));
        } else {
          localStorage.removeItem('rememberedUser');
        }

        setMessage({ type: "success", text: "LOGIN BERHASIL! MENGALIHKAN..." });
        localStorage.setItem('currentUser', JSON.stringify(user));
        setTimeout(() => navigate('/'), 1500);
      } else {
        setMessage({ type: "error", text: "USERNAME ATAU PASSWORD SALAH!" });
      }
    } else {
      const userExists = users.some(u => u.username.toLowerCase() === formData.username.toLowerCase());
      if (userExists) {
        setMessage({ type: "error", text: "USERNAME INI SUDAH TERDAFTAR!" });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: "error", text: "KONFIRMASI PASSWORD TIDAK COCOK!" });
        return;
      }
      
      if (formData.password.length < 6) {
        setMessage({ type: "error", text: "PASSWORD MINIMAL 6 KARAKTER!" });
        return;
      }

      const newUser = { 
        fullName: formData.fullName,
        username: formData.username, 
        password: formData.password,
        id: Date.now() 
      };

      users.push(newUser);
      localStorage.setItem('app-users', JSON.stringify(users));
      setMessage({ type: "success", text: "REGISTRASI BERHASIL! SILAHKAN LOGIN." });

      setFormData({ fullName: '', username: '', password: '', confirmPassword: '' });
      setTimeout(() => {
        setIsLogin(true);
        setMessage({ type: "", text: "" });
      }, 2000);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-200">
      
      {/* Glow Decor */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-5%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/10 blur-[80px] md:blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-yellow-600/5 blur-[80px] md:blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* Container Utama - Responsif Width */}
      <div className="w-full max-w-[420px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-2xl transition-all duration-500">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-yellow-400/20 to-orange-500/10 text-yellow-500 mb-4 ring-1 ring-white/10 shadow-lg shadow-yellow-500/5">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase italic leading-none">
            {isLogin ? 'Access Portal' : 'Join Journey'}
          </h1>
          <p className="text-slate-500 text-[9px] md:text-[10px] uppercase tracking-[0.3em] mt-2 font-bold italic opacity-70">
            Secure Authentication
          </p>
        </div>

        {/* Notifikasi Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300 border ${
            message.type === 'success' 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
            <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">{message.text}</p>
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* Input: Full Name (Hanya saat Register) */}
          {!isLogin && (
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500 transition-colors border-r border-white/10 pr-3">
                <Contact size={18} />
              </div>
              <input 
                type="text" placeholder="Full Name" required
                value={formData.fullName}
                className="w-full bg-white/5 border border-white/10 p-4 pl-14 rounded-2xl text-white text-base sm:text-sm outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all placeholder:text-slate-600"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          )}

          {/* Input: Username */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500 transition-colors border-r border-white/10 pr-3">
              <User size={18} />
            </div>
            <input 
              type="text" placeholder="Username" required
              value={formData.username}
              className="w-full bg-white/5 border border-white/10 p-4 pl-14 rounded-2xl text-white text-base sm:text-sm outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all placeholder:text-slate-600"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          {/* Input: Password */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500 transition-colors border-r border-white/10 pr-3">
              <Lock size={18} />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" required
              value={formData.password}
              className="w-full bg-white/5 border border-white/10 p-4 pl-14 pr-12 rounded-2xl text-white text-base sm:text-sm outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all placeholder:text-slate-600"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Remember Me (Hanya saat Login) */}
          {isLogin && (
            <div className="flex items-center px-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer appearance-none w-5 h-5 rounded-lg border border-white/10 bg-white/5 checked:bg-yellow-500 transition-all cursor-pointer"
                  />
                  <CheckCircle2 size={12} className="absolute text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">
                  Remember Me
                </span>
              </label>
            </div>
          )}

          {/* Input: Confirm Password (Hanya saat Register) */}
          {!isLogin && (
            <div className="relative group animate-in slide-in-from-left-4">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500 transition-colors border-r border-white/10 pr-3">
                <KeyRound size={18} />
              </div>
              <input 
                type="password" placeholder="Confirm Password" required
                value={formData.confirmPassword}
                className="w-full bg-white/5 border border-white/10 p-4 pl-14 rounded-2xl text-white text-base sm:text-sm outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all placeholder:text-slate-600"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-yellow-400 transition-all active:scale-95 text-[11px] tracking-[0.2em] uppercase shadow-xl group mt-4">
            {isLogin ? 'AUTHENTICATE' : 'CREATE ACCOUNT'}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <button 
            onClick={() => { 
              setIsLogin(!isLogin); 
              setMessage({type: "", text: ""});
              setFormData({fullName: '', username: '', password: '', confirmPassword: ''});
            }}
            className="text-slate-500 text-[10px] font-bold hover:text-white transition-colors uppercase tracking-[0.2em] inline-flex items-center gap-2"
          >
            {isLogin ? (
              <>New to system? <span className="text-yellow-500">Create Account</span></>
            ) : (
              <>Have access? <span className="text-yellow-500">Sign In</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;