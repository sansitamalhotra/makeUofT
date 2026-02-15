import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RefillTrackerProps {
  onBack: () => void;
  isDark: boolean;
}

type RefillStatus = 'pending' | 'processing' | 'ready' | 'out-for-delivery' | 'delivered';

interface RefillOrder {
  id: string;
  medication: string;
  dosage: string;
  quantity: number;
  pharmacy: {
    name: string;
    address: string;
    phone: string;
  };
  status: RefillStatus;
  orderedAt: string;
  estimatedDelivery: string;
}

const RefillTracker = ({ onBack, isDark }: RefillTrackerProps) => {
  const [orders, setOrders] = useState<RefillOrder[]>([
    {
      id: 'ORD-12345',
      medication: 'Lisinopril',
      dosage: '10mg',
      quantity: 90,
      pharmacy: {
        name: 'Shoppers Drug Mart',
        address: '123 Queen St W, Toronto, ON',
        phone: '(416) 555-0123'
      },
      status: 'out-for-delivery',
      orderedAt: '2024-02-10',
      estimatedDelivery: 'Today by 6:00 PM'
    },
    {
      id: 'ORD-12344',
      medication: 'Metformin',
      dosage: '500mg',
      quantity: 60,
      pharmacy: {
        name: 'Shoppers Drug Mart',
        address: '123 Queen St W, Toronto, ON',
        phone: '(416) 555-0123'
      },
      status: 'ready',
      orderedAt: '2024-02-09',
      estimatedDelivery: 'Ready for pickup'
    }
  ]);

  const statusConfig = {
    pending: { color: 'bg-gray-400', text: 'Order Received', icon: '📋' },
    processing: { color: 'bg-blue-500', text: 'Being Prepared', icon: '⚗️' },
    ready: { color: 'bg-green-500', text: 'Ready for Pickup', icon: '✅' },
    'out-for-delivery': { color: 'bg-purple-500', text: 'Out for Delivery', icon: '🚚' },
    delivered: { color: 'bg-emerald-600', text: 'Delivered', icon: '📦' }
  };

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
      <div className="max-w-4xl mx-auto">
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
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Track Your Refills
          </h1>
          <p className={`text-xl ${subTextClass}`}>
            Real-time updates on your medication deliveries
          </p>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${cardClass} backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2`}
            >
              {/* Order Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className={`text-3xl font-bold ${textClass}`}>{order.medication}</h2>
                  <p className={`text-lg ${subTextClass}`}>{order.dosage} • {order.quantity} pills</p>
                  <p className={`text-sm ${subTextClass} mt-1`}>Order ID: {order.id}</p>
                </div>
                
                <motion.div
                  animate={{
                    scale: order.status === 'out-for-delivery' ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: order.status === 'out-for-delivery' ? Infinity : 0,
                  }}
                  className={`${statusConfig[order.status].color} text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg`}
                >
                  <span className="text-2xl">{statusConfig[order.status].icon}</span>
                  {statusConfig[order.status].text}
                </motion.div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between mb-4">
                  {['pending', 'processing', 'ready', 'out-for-delivery', 'delivered'].map((status, idx) => {
                    const isActive = Object.keys(statusConfig).indexOf(order.status) >= idx;
                    const isCurrent = Object.keys(statusConfig).indexOf(order.status) === idx;
                    
                    return (
                      <div key={status} className="flex-1 flex flex-col items-center">
                        <motion.div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isActive 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                              : isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'
                          } font-bold mb-2 shadow-lg`}
                          animate={isCurrent ? {
                            scale: [1, 1.2, 1],
                          } : {}}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                          }}
                        >
                          {idx + 1}
                        </motion.div>
                        <p className={`text-xs text-center ${isActive ? textClass : subTextClass}`}>
                          {statusConfig[status as RefillStatus].text}
                        </p>
                      </div>
                    );
                  })}
                </div>
                
                {/* Progress Line */}
                <div className={`h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: `${((Object.keys(statusConfig).indexOf(order.status) + 1) / 5) * 100}%` 
                    }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Delivery Animation (for out-for-delivery status) */}
              {order.status === 'out-for-delivery' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${isDark ? 'bg-purple-900/50' : 'bg-purple-50'} rounded-2xl p-6 mb-6 border-2 ${isDark ? 'border-purple-700' : 'border-purple-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{
                        x: [0, 20, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="text-5xl"
                    >
                      🚚
                    </motion.div>
                    <div>
                      <p className={`font-bold text-lg ${textClass}`}>On its way to you!</p>
                      <p className={`${subTextClass}`}>Estimated arrival: {order.estimatedDelivery}</p>
                    </div>
                  </div>
                  
                  {/* Animated Route */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-2xl">🏥</span>
                    <div className="flex-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-white/50"
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    </div>
                    <span className="text-2xl">🏠</span>
                  </div>
                </motion.div>
              )}

              {/* Ready for Pickup */}
              {order.status === 'ready' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${isDark ? 'bg-green-900/50' : 'bg-green-50'} rounded-2xl p-6 mb-6 border-2 ${isDark ? 'border-green-700' : 'border-green-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="text-5xl"
                    >
                      ✅
                    </motion.div>
                    <div>
                      <p className={`font-bold text-lg ${textClass}`}>Ready for pickup!</p>
                      <p className={`${subTextClass}`}>Visit {order.pharmacy.name} anytime during store hours</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Pharmacy Info */}
              <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-2xl p-6 border-2 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                <h3 className={`font-bold text-lg mb-3 ${textClass}`}>📍 Pharmacy Information</h3>
                <div className="space-y-2">
                  <p className={`${textClass}`}><strong>{order.pharmacy.name}</strong></p>
                  <p className={`${subTextClass}`}>{order.pharmacy.address}</p>
                  <p className={`${subTextClass}`}>📞 {order.pharmacy.phone}</p>
                </div>
                
                <div className="flex gap-3 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg"
                  >
                    📞 Call Pharmacy
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg"
                  >
                    🗺️ Get Directions
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${cardClass} backdrop-blur-xl rounded-3xl shadow-2xl p-16 text-center border-2`}
          >
            <div className="text-8xl mb-4">📦</div>
            <h2 className={`text-3xl font-bold mb-4 ${textClass}`}>No Active Refills</h2>
            <p className={`text-xl ${subTextClass}`}>Your refill orders will appear here</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default RefillTracker;