import { motion } from 'framer-motion';

const Snowfall = () => {
  // Mengurangi jumlah partikel agar lebih ringan di HP (dari 30 ke 20)
  // Tapi tetap terlihat cantik dengan ukuran yang bervariasi
  const snowflakes = Array.from({ length: 20 });

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((_, i) => {
        // Generate nilai random di luar return agar tidak berubah-ubah saat render
        const size = Math.random() * 4 + 2; // ukuran 2px sampai 6px
        const initialLeft = Math.random() * 100 + '%';
        const duration = Math.random() * 10 + 10; // Gerakan lebih lambat & elegan (10s - 20s)
        const delay = Math.random() * 10;

        return (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full shadow-[0_0_10px_white]"
            style={{
              width: size + 'px',
              height: size + 'px',
              left: initialLeft,
              top: '-10px',
              opacity: Math.random() * 0.5 + 0.2, // Transparansi acak agar natural
            }}
            animate={{
              y: ['0vh', '105vh'],
              x: [0, Math.random() * 50 - 25, 0], // Efek goyangan tertiup angin
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "linear",
              delay: delay,
            }}
          />
        );
      })}
    </div>
  );
};

export default Snowfall;