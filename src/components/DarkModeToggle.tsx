import { motion } from 'framer-motion';

interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const DarkModeToggle = ({ isDark, onToggle }: DarkModeToggleProps) => {
  return (
    <motion.button
      onClick={onToggle}
      className={`relative w-16 h-8 rounded-full p-1 transition-colors ${
        isDark ? 'bg-indigo-600' : 'bg-gray-300'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          isDark ? 'bg-gray-900' : 'bg-white'
        }`}
        animate={{
          x: isDark ? 32 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <span className="text-xs">🌙</span>
        ) : (
          <span className="text-xs">☀️</span>
        )}
      </motion.div>
    </motion.button>
  );
};

export default DarkModeToggle;