import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import WeeklyView from './components/WeeklyView';
import PharmacyDashboard from './components/PharmacyDashboard';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import RefillTracker from './components/RefillTracker';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import DarkModeToggle from './components/DarkModeToggle';

type Screen = 'landing' | 'weekly' | 'pharmacy' | 'profile' | 'refill-tracker' | 'analytics';
type UserMode = 'patient' | 'pharmacy';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [userMode, setUserMode] = useState<UserMode>('patient');
  const [user, setUser] = useState<any>(null);
  const [medications, setMedications] = useState<any[]>([]);
  const [isDark, setIsDark] = useState(false);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('landing');
  };

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      {/* Top Navigation Bar */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 ${isDark ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm shadow-lg transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">💊</span>
            <span className={`text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent`}>
              PillTrack
            </span>
          </div>

          {/* Mode Toggle */}
          <div className={`flex gap-2 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-full p-2`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setUserMode('patient');
                setCurrentScreen('landing');
              }}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                userMode === 'patient' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md' 
                  : isDark ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              👤 Patient
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setUserMode('pharmacy');
                setCurrentScreen('pharmacy');
              }}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                userMode === 'pharmacy' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md' 
                  : isDark ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              🏥 Pharmacy
            </motion.button>
          </div>

          {/* Right Side: Dark Mode + Profile */}
          <div className="flex items-center gap-4">
            <DarkModeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentScreen('profile')}
              className={`flex items-center gap-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full p-2 pr-4 transition-all`}
            >
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-blue-500" />
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>{user.name}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="pt-20">
        <AnimatePresence mode="wait">
          {currentScreen === 'landing' && userMode === 'patient' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LandingPage onStart={() => setCurrentScreen('weekly')} />
            </motion.div>
          )}

          {currentScreen === 'weekly' && (
            <motion.div key="weekly" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WeeklyView 
                onBack={() => setCurrentScreen('landing')} 
                medications={medications}
                onTrackRefill={() => setCurrentScreen('refill-tracker')}
                onViewAnalytics={() => setCurrentScreen('analytics')}
                isDark={isDark}
              />
            </motion.div>
          )}

          {currentScreen === 'pharmacy' && (
            <motion.div key="pharmacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PharmacyDashboard />
            </motion.div>
          )}

          {currentScreen === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProfilePage 
                user={user} 
                onLogout={handleLogout}
                onBack={() => setCurrentScreen(userMode === 'patient' ? 'landing' : 'pharmacy')}
              />
            </motion.div>
          )}

          {currentScreen === 'refill-tracker' && (
            <motion.div key="refill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RefillTracker 
                onBack={() => setCurrentScreen('weekly')}
                isDark={isDark}
              />
            </motion.div>
          )}

          {currentScreen === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AnalyticsDashboard 
                onBack={() => setCurrentScreen('weekly')}
                isDark={isDark}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;