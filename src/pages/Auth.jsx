import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Contact, 
  KeyRound 
} from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    fullName: '', 
    username: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    setError("");
    const users = JSON.parse(localStorage.getItem('app-users') || '[]');

    if (isLogin) {
      const user = users.find(u => u.username === formData.username && u.password === formData.password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        navigate('/');
      } else {
        setError("Username atau Password salah!");
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        setError("Konfirmasi password tidak cocok!");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password minimal 6 karakter!");
        return;
      }
      if (users.find(u => u.username === formData.username)) {
        setError("Username sudah digunakan!");
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
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans">
      
      {/* Background Ornaments (Glow Effects) */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[440px] bg-white/[0.03] border border-white/10 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 animate-in fade-in zoom-in-95">
        
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex p-5 rounded-[2rem] bg-gradient-to-br from-yellow-400/20 to-orange-500/10 text-yellow-500 mb-6 shadow-inner ring-1 ring-white/10">
            <ShieldCheck size={42} strokeWidth={1.5} className="animate-in spin-in-12 duration-1000" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase leading-none select-none">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-4 font-medium tracking-wide">
            {isLogin ? 'Masuk untuk akses kenangan kamu.' : 'Daftar untuk mulai menyimpan momen.'}
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* Full Name (Only for Register) */}
          {!isLogin && (
            <div className="relative animate-in slide-in-from-left-4 duration-300">
              <Contact className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" placeholder="Nama Lengkap" required
                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all text-white text-sm"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          )}

          {/* Username */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" placeholder="Username / Email" required
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all text-white text-sm"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" required
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all text-white text-sm"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password (Only for Register) */}
          {!isLogin && (
            <div className="relative animate-in slide-in-from-left-4 duration-500">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" placeholder="Konfirmasi Password" required
                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all text-white text-sm"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-[11px] font-black text-center uppercase tracking-widest animate-in shake-horizontal duration-300">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-white text-black font-black py-4 md:py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-yellow-400 transition-all shadow-[0_10px_30px_-10px_rgba(255,255,255,0.2)] active:scale-95 text-[11px] md:text-xs tracking-[0.2em] mt-4 uppercase"
          >
            {isLogin ? 'AUTHENTICATE NOW' : 'REGISTER ACCOUNT'}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="mt-10 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-slate-500 text-[10px] md:text-xs font-bold hover:text-white transition-colors uppercase tracking-[0.2em] group"
          >
            {isLogin ? (
              <>Don't have an account? <span className="text-yellow-500 group-hover:underline">Sign Up</span></>
            ) : (
              <>Already registered? <span className="text-yellow-500 group-hover:underline">Log In</span></>
            )}
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 text-center w-full opacity-20">
        <p className="text-[10px] text-white font-black tracking-[0.5em] uppercase italic">Secure Access Terminal</p>
      </div>
    </div>
  );
};

export default Auth;