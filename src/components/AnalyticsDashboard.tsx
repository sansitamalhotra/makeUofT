import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsDashboardProps {
  onBack: () => void;
  isDark: boolean;
}

const AnalyticsDashboard = ({ onBack, isDark }: AnalyticsDashboardProps) => {
  // Mock data
  const weeklyData = [
    { day: 'Sun', taken: 2, missed: 1 },
    { day: 'Mon', taken: 3, missed: 0 },
    { day: 'Tue', taken: 3, missed: 0 },
    { day: 'Wed', taken: 2, missed: 1 },
    { day: 'Thu', taken: 3, missed: 0 },
    { day: 'Fri', taken: 3, missed: 0 },
    { day: 'Sat', taken: 2, missed: 1 },
  ];

  const monthlyAdherence = [
    { month: 'Jan', percentage: 85 },
    { month: 'Feb', percentage: 92 },
    { month: 'Mar', percentage: 88 },
    { month: 'Apr', percentage: 95 },
    { month: 'May', percentage: 91 },
    { month: 'Jun', percentage: 94 },
  ];

  const medicationBreakdown = [
    { name: 'Lisinopril', value: 35 },
    { name: 'Metformin', value: 30 },
    { name: 'Atorvastatin', value: 20 },
    { name: 'Amlodipine', value: 15 },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100';
  
  const cardClass = isDark 
    ? 'bg-gray-800/90 border-gray-700' 
    : 'bg-white/90 border-white/40';
  
  const textClass = isDark ? 'text-white' : 'text-gray-800';
  const subTextClass = isDark ? 'text-gray-300' : 'text-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${bgClass} p-8 pt-24`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className={`p-4 ${cardClass} backdrop-blur-sm rounded-full shadow-lg mb-8 flex items-center gap-2 font-semibold ${textClass} border-2`}
        >
          ← Back
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className={`text-xl ${subTextClass}`}>
            Track your medication adherence and progress
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Overall Adherence', value: '92%', icon: '📊', color: 'from-blue-500 to-cyan-500' },
            { label: 'Current Streak', value: '5 days', icon: '🔥', color: 'from-orange-500 to-red-500' },
            { label: 'Best Streak', value: '14 days', icon: '🏆', color: 'from-yellow-500 to-orange-500' },
            { label: 'Total Doses', value: '147', icon: '💊', color: 'from-purple-500 to-pink-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`${cardClass} backdrop-blur-xl rounded-3xl shadow-xl p-6 border-2`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">{stat.icon}</span>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} opacity-20`} />
              </div>
              <p className={`text-sm ${subTextClass} mb-1`}>{stat.label}</p>
              <p className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${cardClass} backdrop-blur-xl rounded-3xl shadow-xl p-8 border-2`}
          >
            <h2 className={`text-2xl font-bold mb-6 ${textClass}`}>📅 This Week's Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="day" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="taken" fill="#10b981" name="Taken" radius={[8, 8, 0, 0]} />
                <Bar dataKey="missed" fill="#ef4444" name="Missed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Monthly Adherence Trend */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${cardClass} backdrop-blur-xl rounded-3xl shadow-xl p-8 border-2`}
          >
            <h2 className={`text-2xl font-bold mb-6 ${textClass}`}>📈 6-Month Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyAdherence}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="month" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  name="Adherence %"
                  dot={{ fill: '#8b5cf6', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Medication Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${cardClass} backdrop-blur-xl rounded-3xl shadow-xl p-8 border-2`}
          >
            <h2 className={`text-2xl font-bold mb-6 ${textClass}`}>💊 Medication Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={medicationBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {medicationBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${cardClass} backdrop-blur-xl rounded-3xl shadow-xl p-8 border-2`}
          >
            <h2 className={`text-2xl font-bold mb-6 ${textClass}`}>💡 Insights & Tips</h2>
            <div className="space-y-4">
              {[
                { icon: '🎯', text: 'You\'re doing great! Your adherence improved 7% this month.', color: 'green' },
                { icon: '⏰', text: 'Best time: You take 95% of doses between 8-9 AM.', color: 'blue' },
                { icon: '📊', text: 'Weekends need attention - only 75% adherence rate.', color: 'orange' },
                { icon: '🏆', text: 'You\'re on track to beat your best streak!', color: 'purple' },
              ].map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-2xl p-4 border-2 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{insight.icon}</span>
                    <p className={`${textClass} flex-1`}>{insight.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold shadow-lg"
            >
              📄 Export Full Report
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;