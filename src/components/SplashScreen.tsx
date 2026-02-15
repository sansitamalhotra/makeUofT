import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-sky-300 via-blue-300 to-purple-300 flex flex-col items-center justify-center z-50"
    >
      {/* Bouncing Pills */}
      <div className="relative mb-16">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 bg-white/90 rounded-full shadow-2xl"
            style={{
              left: `${i * 40 - 80}px`,
            }}
            animate={{
              y: [0, -100, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-white to-blue-100 rounded-full opacity-90" />
          </motion.div>
        ))}
      </div>

      {/* Logo */}
      <motion.h1
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="text-8xl font-black text-white mb-8 tracking-tight drop-shadow-lg"
      >
        PillPal
      </motion.h1>

      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-2xl text-white/90 mb-8 drop-shadow"
      >
        Loading your medications...
      </motion.p>

      {/* Progress Bar */}
      <div className="w-80 h-3 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div
          className="h-full bg-white rounded-full shadow-lg"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Progress Percentage */}
      <motion.p
        className="text-white text-xl font-bold mt-4 drop-shadow"
        key={progress}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
      >
        {progress}%
      </motion.p>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </motion.div>
  );
};

export default SplashScreen;