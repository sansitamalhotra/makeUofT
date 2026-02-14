import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { playSound } from '../utils/sounds';

interface WeeklyViewProps {
  onBack: () => void;
  medications: any[];
}

interface DayStatus {
  taken: boolean;
  time?: string;
  pillCount: number;
}

const WeeklyView = ({ onBack, medications }: WeeklyViewProps) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [dayStatuses, setDayStatuses] = useState<Record<number, DayStatus>>(
    Object.fromEntries(days.map((_, i) => [i, { 
      taken: false, 
      pillCount: i % 2 === 0 ? 3 : 2 
    }]))
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRefillAlert, setShowRefillAlert] = useState(false);
  const [refillSent, setRefillSent] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementText, setAchievementText] = useState('');
  const [streak, setStreak] = useState(0);
  const [displayedPercentage, setDisplayedPercentage] = useState(0);
  const [displayedTaken, setDisplayedTaken] = useState(0);
  const [displayedRemaining, setDisplayedRemaining] = useState(7);

  const pillboxColors = [
    'from-pink-400 to-pink-500',
    'from-orange-400 to-orange-500',
    'from-yellow-400 to-yellow-500',
    'from-green-400 to-green-500',
    'from-blue-400 to-blue-500',
    'from-cyan-400 to-cyan-500',
    'from-purple-400 to-purple-500',
  ];

  const takenCount = Object.values(dayStatuses).filter(d => d.taken).length;
  const adherencePercentage = (takenCount / 7) * 100;
  const remainingDays = 7 - takenCount;

  // Animated counting effect
  useEffect(() => {
    const percentageInterval = setInterval(() => {
      setDisplayedPercentage(prev => {
        if (prev < adherencePercentage) return Math.min(prev + 2, adherencePercentage);
        return prev;
      });
    }, 20);

    const takenInterval = setInterval(() => {
      setDisplayedTaken(prev => {
        if (prev < takenCount) return prev + 1;
        return prev;
      });
    }, 100);

    const remainingInterval = setInterval(() => {
      setDisplayedRemaining(prev => {
        if (prev > remainingDays) return prev - 1;
        return prev;
      });
    }, 100);

    return () => {
      clearInterval(percentageInterval);
      clearInterval(takenInterval);
      clearInterval(remainingInterval);
    };
  }, [adherencePercentage, takenCount, remainingDays]);

  // Calculate streak
  useEffect(() => {
    let currentStreak = 0;
    const today = new Date().getDay();
    
    for (let i = today; i >= 0; i--) {
      if (dayStatuses[i].taken) {
        currentStreak++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  }, [dayStatuses]);

  // Check for achievements
  useEffect(() => {
    if (takenCount === 7) {
      setAchievementText('Perfect Week! 🎉');
      setShowAchievement(true);
      playSound('success');
      setTimeout(() => setShowAchievement(false), 4000);
    } else if (streak === 3) {
      setAchievementText('3-Day Streak! 🔥');
      setShowAchievement(true);
      playSound('ding');
      setTimeout(() => setShowAchievement(false), 3000);
    } else if (streak === 5) {
      setAchievementText('5-Day Streak! 🔥🔥');
      setShowAchievement(true);
      playSound('success');
      setTimeout(() => setShowAchievement(false), 3000);
    }
  }, [takenCount, streak]);

  // Check if pills are running low
  useEffect(() => {
    if (remainingDays <= 2 && !refillSent) {
      setShowRefillAlert(true);
    }
  }, [remainingDays, refillSent]);

  const handleTakePill = (dayIndex: number) => {
    if (!dayStatuses[dayIndex].taken) {
      playSound('pop');
      
      setDayStatuses({
        ...dayStatuses,
        [dayIndex]: { 
          taken: true, 
          pillCount: 0,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      });
      
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleRefillRequest = () => {
    playSound('whoosh');
    setRefillSent(true);
    setShowRefillAlert(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex flex-col items-center min-h-screen p-8 pt-24"
    >
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(80)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{
                  y: window.innerHeight + 100,
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 720,
                  x: (Math.random() - 0.5) * 300
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  ease: 'easeIn'
                }}
                exit={{ opacity: 0 }}
              >
                {/* Mix of confetti and sparkles */}
                {i % 3 === 0 ? (
                  <div className="text-2xl">✨</div>
                ) : (
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][i % 5]
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Achievement Badge */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ scale: 0, y: -100, rotate: -180 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0, y: -100, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="fixed top-32 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-10 py-6 rounded-3xl shadow-2xl border-4 border-white"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
              }}
              className="text-4xl font-black text-center"
            >
              {achievementText}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refill Alert */}
      <AnimatePresence>
        {showRefillAlert && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-3xl"
              >
                ⚠️
              </motion.div>
              <div>
                <p className="font-bold text-lg">Running Low on Pills!</p>
                <p className="text-sm opacity-90">Only {remainingDays} days remaining</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefillRequest}
                className="ml-4 px-6 py-2 bg-white text-orange-600 font-bold rounded-full"
              >
                Request Refill →
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refill Confirmation */}
      <AnimatePresence>
        {refillSent && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <p className="font-bold">Refill request sent to pharmacy!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="w-full max-w-6xl mb-8">
        <motion.button
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playSound('whoosh');
            onBack();
          }}
          className="p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6 flex items-center gap-2 font-semibold text-gray-700"
        >
          ← Back
        </motion.button>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl font-bold mb-3" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Your Weekly Tracker
          </h1>
          <p className="text-xl text-gray-600">
            {medications.length > 0 ? medications[0].name : 'Your Medications'} • Track your progress
          </p>

          {/* Streak Counter */}
          {streak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg"
            >
              <motion.span
                animate={{
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                🔥
              </motion.span>
              {streak} Day Streak!
            </motion.div>
          )}
        </motion.div>

        {/* Stats Card with 3D Tilt */}
        <TiltCard>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 mb-10 border border-white/40"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">Adherence This Week</p>
                <motion.p 
                  className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                  key={displayedPercentage}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {displayedPercentage.toFixed(0)}%
                </motion.p>
              </div>
              
              <div className="flex gap-12">
                <div className="text-center">
                  <motion.p 
                    className="text-5xl font-bold text-green-500"
                    key={displayedTaken}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                  >
                    {displayedTaken}
                  </motion.p>
                  <p className="text-sm text-gray-500 mt-1">Taken</p>
                </div>
                <div className="text-center">
                  <motion.p 
                    className="text-5xl font-bold text-orange-500"
                    key={displayedRemaining}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                  >
                    {displayedRemaining}
                  </motion.p>
                  <p className="text-sm text-gray-500 mt-1">Remaining</p>
                </div>
              </div>

              {/* Animated Progress Ring */}
              <svg className="w-40 h-40 -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#e0e7ff"
                  strokeWidth="12"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ 
                    strokeDashoffset: 440 - (440 * displayedPercentage / 100)
                  }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  style={{ strokeDasharray: 440 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>
        </TiltCard>
      </div>

      {/* Weekly Pillbox Grid */}
      <div className="grid grid-cols-7 gap-6 w-full max-w-6xl">
        {days.map((day, index) => {
          const status = dayStatuses[index];
          const isToday = new Date().getDay() === index;
          const isMissed = !status.taken && index < new Date().getDay();

          return (
            <motion.div
              key={day}
              initial={{ y: 30, opacity: 0, rotateX: -20 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ delay: 0.1 + index * 0.08, type: 'spring' }}
            >
              {/* Day Label */}
              <div className="text-center mb-3">
                <p className={`font-bold text-lg ${
                  isToday ? 'text-blue-600' : 
                  isMissed ? 'text-red-600' : 
                  'text-gray-700'
                }`}>
                  {day.slice(0, 3)}
                </p>
                {isToday && (
                  <motion.div
                    className="w-2 h-2 bg-blue-600 rounded-full mx-auto mt-1"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                {isMissed && (
                  <p className="text-xs text-red-500 font-semibold mt-1">Missed!</p>
                )}
              </div>

              {/* Compartment with 3D Tilt */}
              <TiltCard>
                <motion.button
                  onClick={() => handleTakePill(index)}
                  whileHover={{ scale: status.taken ? 1 : 1.08, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-full h-40 rounded-2xl border-4 transition-all overflow-hidden ${
                    status.taken 
                      ? 'bg-gradient-to-br from-gray-100 to-gray-50 border-gray-300' 
                      : isMissed
                      ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300 shadow-2xl'
                      : `bg-gradient-to-br ${pillboxColors[index]} border-white/40 shadow-2xl`
                  }`}
                  style={{
                    boxShadow: !status.taken && !isMissed ? `0 10px 40px ${pillboxColors[index].split(' ')[1].replace('to-', '')}40` : 
                               isMissed ? '0 10px 40px rgba(239, 68, 68, 0.3)' : undefined
                  }}
                >
                  {/* Glowing effect for today */}
                  {isToday && !status.taken && (
                    <>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-blue-400/40 to-transparent rounded-2xl"
                        animate={{
                          opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur-md"
                        animate={{
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                        style={{ zIndex: -1 }}
                      />
                    </>
                  )}

                  {/* Missed Day Indicator */}
                  {isMissed && (
                    <motion.div
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                      }}
                    >
                      !
                    </motion.div>
                  )}

                  <AnimatePresence mode="wait">
                    {!status.taken ? (
                      <motion.div
                        key="pills"
                        exit={{ 
                          scale: 0,
                          y: -150,
                          rotate: 720,
                          opacity: 0
                        }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4"
                      >
                        {[...Array(status.pillCount)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`w-16 h-16 rounded-full shadow-xl border-2 ${
                              isMissed 
                                ? 'bg-gradient-to-br from-red-200 to-red-300 border-red-400/50'
                                : 'bg-gradient-to-br from-white to-blue-50 border-white/50'
                            }`}
                            animate={{
                              y: [0, -6, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.15 + i * 0.3
                            }}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="absolute inset-0 flex flex-col items-center justify-center"
                      >
                        <svg className="w-24 h-24 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5 }}
                          />
                        </svg>
                        {status.time && (
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-gray-500 mt-2 font-semibold"
                          >
                            {status.time}
                          </motion.p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Shine effect */}
                  {!status.taken && !isMissed && (
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
                  )}
                </motion.button>
              </TiltCard>

              {/* Sensor Status */}
              <motion.div
                className="mt-3 flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.08 }}
              >
                <motion.div
                  className={`w-2.5 h-2.5 rounded-full ${
                    status.taken ? 'bg-gray-400' : 
                    isMissed ? 'bg-red-500' :
                    'bg-green-400'
                  }`}
                  animate={!status.taken && !isMissed ? {
                    scale: [1, 1.4, 1],
                    opacity: [1, 0.6, 1]
                  } : isMissed ? {
                    scale: [1, 1.4, 1],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                />
                <span className={`text-xs font-medium ${
                  isMissed ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {status.taken ? 'Empty' : isMissed ? 'Missed!' : `${status.pillCount} pills`}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Help Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-12 text-gray-500 text-center"
      >
        💡 Click any day to mark your dose as taken • Hardware sensors auto-detect pill removal
      </motion.p>
    </motion.div>
  );
};

// 3D Tilt Card Component
const TiltCard = ({ children }: { children: React.ReactNode }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouse = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

export default WeeklyView;