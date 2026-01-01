import { useState, useEffect } from 'react';

const Countdown = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl inline-block font-mono text-2xl text-yellow-400">
      {time}
    </div>
  );
};

export default Countdown;