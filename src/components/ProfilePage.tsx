import { motion } from 'framer-motion';
import { playSound } from '../utils/sounds';

interface ProfilePageProps {
  user: any;
  onLogout: () => void;
  onBack: () => void;
}

const ProfilePage = ({ user, onLogout, onBack }: ProfilePageProps) => {
  const handleLogout = () => {
    playSound('whoosh');
    setTimeout(onLogout, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold"
          >
            <span className="text-2xl">←</span>
            Back
          </motion.button>
          <h1 className="text-3xl font-black text-gray-800">My Profile</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 mb-6"
        >
          {/* Avatar & Info */}
          <div className="flex items-center gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  Patient
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 text-center border-2 border-blue-100"
            >
              <div className="text-3xl font-black text-blue-600">12</div>
              <div className="text-sm text-gray-600 mt-1">Medications</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 text-center border-2 border-green-100"
            >
              <div className="text-3xl font-black text-green-600">94%</div>
              <div className="text-sm text-gray-600 mt-1">Adherence</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 text-center border-2 border-purple-100"
            >
              <div className="text-3xl font-black text-purple-600">28</div>
              <div className="text-sm text-gray-600 mt-1">Day Streak</div>
            </motion.div>
          </div>

          {/* Settings Options */}
          <div className="space-y-3">
            <SettingsButton icon="🔔" label="Notification Settings" />
            <SettingsButton icon="📅" label="Calendar Integration" />
            <SettingsButton icon="🏥" label="Healthcare Providers" />
            <SettingsButton icon="📊" label="Health Reports" />
            <SettingsButton icon="⚙️" label="App Settings" />
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          🚪 Logout
        </motion.button>
      </div>
    </div>
  );
};

const SettingsButton = ({ icon, label }: { icon: string; label: string }) => (
  <motion.button
    whileHover={{ scale: 1.02, x: 5 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => playSound('pop')}
    className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
  >
    <span className="text-2xl">{icon}</span>
    <span className="flex-1 text-left font-semibold text-gray-700">{label}</span>
    <span className="text-gray-400">→</span>
  </motion.button>
);

export default ProfilePage;