import { useState, useEffect } from 'react';

// 1. PINDAHKAN TimeUnit ke luar agar tidak dibuat ulang setiap render
const TimeUnit = ({ value, label, formatNumber }) => (
  <div className="flex flex-col items-center">
    <div className="relative overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md rounded-xl md:rounded-2xl w-14 h-16 md:w-20 md:h-24 flex items-center justify-center shadow-2xl">
      <span className="text-2xl md:text-5xl font-black tracking-tighter text-white tabular-nums">
        {formatNumber(value)}
      </span>
      {/* Dekorasi Glossy */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-2 md:mt-3 italic">
      {label}
    </span>
  </div>
);

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Helper untuk format angka
  const formatNumber = (num) => String(num).padStart(2, '0');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const currentYear = new Date().getFullYear();
      const targetDate = new Date(`January 1, ${currentYear + 1} 00:00:00`).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 select-none">
      <TimeUnit value={timeLeft.days} label="Days" formatNumber={formatNumber} />
      <div className="text-white/20 font-black text-xl md:text-3xl mb-6 md:mb-8">:</div>
      
      <TimeUnit value={timeLeft.hours} label="Hours" formatNumber={formatNumber} />
      <div className="text-white/20 font-black text-xl md:text-3xl mb-6 md:mb-8">:</div>
      
      <TimeUnit value={timeLeft.minutes} label="Mins" formatNumber={formatNumber} />
      <div className="text-white/20 font-black text-xl md:text-3xl mb-6 md:mb-8">:</div>
      
      <TimeUnit value={timeLeft.seconds} label="Secs" formatNumber={formatNumber} />
    </div>
  );
};

export default Countdown;