import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import WeeklyView from './components/WeeklyView';
import PharmacyDashboard from './components/PharmacyDashboard';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';

type Screen = 'landing' | 'weekly' | 'pharmacy' | 'profile';
type UserMode = 'patient' | 'pharmacy';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [userMode, setUserMode] = useState<UserMode>('patient');
  const [user, setUser] = useState<any>(null); // null = not logged in
  const [medications, setMedications] = useState<any[]>([]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100">
      {/* Top Navigation Bar */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">💊</span>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              PillTrack
            </span>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 bg-gray-100 rounded-full p-2">
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
                  : 'text-gray-600 hover:bg-gray-200'
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
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              🏥 Pharmacy
            </motion.button>
          </div>

          {/* User Profile Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentScreen('profile')}
            className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-2 pr-4 transition-all"
          >
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-blue-500" />
            <span className="font-semibold text-gray-700">{user.name}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content (with top padding for navbar) */}
      <div className="pt-20">
        <AnimatePresence mode="wait">
          {currentScreen === 'landing' && userMode === 'patient' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LandingPage onStart={() => setCurrentScreen('weekly')} />
            </motion.div>
          )}

          {currentScreen === 'weekly' && (
            <motion.div
              key="weekly"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <WeeklyView onBack={() => setCurrentScreen('landing')} medications={medications} />
            </motion.div>
          )}

          {currentScreen === 'pharmacy' && (
            <motion.div
              key="pharmacy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PharmacyDashboard />
            </motion.div>
          )}

          {currentScreen === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProfilePage 
                user={user} 
                onLogout={handleLogout}
                onBack={() => setCurrentScreen(userMode === 'patient' ? 'landing' : 'pharmacy')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;