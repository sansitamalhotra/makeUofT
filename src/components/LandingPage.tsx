import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage = ({ onStart }: LandingPageProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const pillboxColors = [
    'from-pink-400 to-pink-500',
    'from-orange-400 to-orange-500',
    'from-yellow-400 to-yellow-500',
    'from-green-400 to-green-500',
    'from-blue-400 to-blue-500',
    'from-cyan-400 to-cyan-500',
    'from-purple-400 to-purple-500',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-8 relative overflow-hidden"
    >
      {/* Background Blobs - More Visible! */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Blue Blob - Top Left */}
        <motion.div
          className="absolute -top-64 -left-64 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(147, 197, 253, 0.3) 100%)',
          }}
          animate={{
            x: [0, 80, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Large Purple Blob - Bottom Right */}
        <motion.div
          className="absolute -bottom-64 -right-64 w-[700px] h-[700px] rounded-full blur-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.35) 0%, rgba(192, 132, 252, 0.25) 100%)',
          }}
          animate={{
            x: [0, -60, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Cyan Blob - Center */}
        <motion.div
          className="absolute top-1/3 left-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.3) 0%, rgba(103, 232, 249, 0.2) 100%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [-50, 50, -50],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Pink Blob - Top Right */}
        <motion.div
          className="absolute top-32 right-1/4 w-[450px] h-[450px] rounded-full blur-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(251, 113, 133, 0.2) 100%)',
          }}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Teal Blob - Bottom Left */}
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[550px] h-[550px] rounded-full blur-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.3) 0%, rgba(94, 234, 212, 0.2) 100%)',
          }}
          animate={{
            scale: [1, 1.25, 1],
            x: [0, -60, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Small Indigo Blob - Middle Right */}
        <motion.div
          className="absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(129, 140, 248, 0.15) 100%)',
          }}
          animate={{
            x: [0, -40, 40, 0],
            y: [0, 30, -30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Title */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="text-center mb-16 relative z-10"
      >
        <motion.h1 
          className="text-8xl font-black mb-4 tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          PillTrack
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl text-gray-600 font-medium"
        >
          Your smart medication companion 💙
        </motion.p>
      </motion.div>

      {/* 3D Pillbox - BIGGER! */}
      <motion.div
        className="relative mb-20"
        onHoverStart={() => setIsOpen(true)}
        onHoverEnd={() => setIsOpen(false)}
      >
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: `hsl(${i * 18}, 70%, 60%)`,
              left: `${50 + Math.cos((i / 20) * Math.PI * 2) * 250}px`,
              top: `${50 + Math.sin((i / 20) * Math.PI * 2) * 250}px`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}

        {/* Main Pillbox Container - BIGGER */}
        <motion.div
          className="relative"
          animate={{
            rotateY: isOpen ? 15 : 0,
            scale: isOpen ? 1.05 : 1,
          }}
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="grid grid-cols-7 gap-4 p-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.08, type: 'spring' }}
                className="relative"
              >
                {/* Day Label */}
                <motion.div 
                  className="text-center text-base font-bold text-gray-700 mb-3"
                  animate={isOpen ? { y: -5 } : {}}
                >
                  {day}
                </motion.div>
                
                {/* Compartment Lid - BIGGER & MORE SPACE */}
                <motion.div
                  className={`relative w-20 h-28 bg-gradient-to-br ${pillboxColors[index]} rounded-xl shadow-lg overflow-hidden cursor-pointer`}
                  whileHover={{ scale: 1.1, y: -8 }}
                  animate={{
                    rotateX: isOpen ? -60 : 0,
                    transformOrigin: 'bottom',
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />

                  {/* Pills inside - MORE SPACE */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3"
                      >
                        <motion.div
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-blue-100 shadow-lg"
                          animate={{
                            y: [0, -3, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: index * 0.1,
                          }}
                        />
                        <motion.div
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-white to-pink-100 shadow-lg"
                          animate={{
                            y: [0, -2, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: 0.3 + index * 0.1,
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Glow effect */}
        <motion.div
          className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-3xl -z-10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
      </motion.div>

      {/* CTA Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.08, y: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="relative px-16 py-5 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white text-xl font-bold rounded-full shadow-2xl overflow-hidden group z-10"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
        <span className="relative z-10 flex items-center gap-3">
          Start Tracking
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            →
          </motion.span>
        </span>
      </motion.button>

      {/* Feature Pills */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-20 grid grid-cols-2 gap-8 z-10"
      >
        {[
          { icon: '🔔', text: 'Smart Refill Alerts', color: 'from-purple-400 to-purple-600' },
          { icon: '📊', text: 'Track Adherence', color: 'from-pink-400 to-pink-600' }
        ].map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -8, scale: 1.05 }}
            className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40"
          >
            <motion.div 
              className="text-5xl mb-3"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              {feature.icon}
            </motion.div>
            <div className={`text-lg font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
              {feature.text}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default LandingPage;