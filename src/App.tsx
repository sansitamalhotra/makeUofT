import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import ScanFlow from './components/ScanFlow';
import WeeklyView from './components/WeeklyView';
import PharmacyDashboard from './components/PharmacyDashboard';
import SplashScreen from './components/SplashScreen';

type Screen = 'splash' | 'landing' | 'scan' | 'weekly' | 'pharmacy';
type UserMode = 'patient' | 'pharmacy';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [userMode, setUserMode] = useState<UserMode>('patient');
  const [medications, setMedications] = useState<any[]>([]);

  const handleScanComplete = (pillData: any) => {
    setMedications([...medications, pillData]);
    setCurrentScreen('weekly');
  };

  const handleAddAnother = () => {
    setCurrentScreen('scan');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100">
      {/* Mode Toggle - Top Right */}
      {currentScreen !== 'splash' && (
        <motion.div 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-6 right-6 z-50 flex gap-2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg"
        >
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
                : 'text-gray-600 hover:bg-gray-100'
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
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            💊 Pharmacy
          </motion.button>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {currentScreen === 'splash' && (
          <SplashScreen
            key="splash"
            onComplete={() => setCurrentScreen('landing')}
          />
        )}

        {currentScreen === 'landing' && userMode === 'patient' && (
          <LandingPage 
            key="landing"
            onStart={() => setCurrentScreen('scan')} 
          />
        )}
        
        {currentScreen === 'scan' && userMode === 'patient' && (
          <ScanFlow
            key="scan"
            onScanComplete={handleScanComplete}
            onAddAnother={handleAddAnother}
            onBack={() => setCurrentScreen('landing')}
          />
        )}
        
        {currentScreen === 'weekly' && userMode === 'patient' && (
          <WeeklyView
            key="weekly"
            medications={medications}
            onBack={() => setCurrentScreen('landing')}
          />
        )}

        {userMode === 'pharmacy' && (
          <PharmacyDashboard
            key="pharmacy"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;