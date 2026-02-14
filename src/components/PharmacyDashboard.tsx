import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RefillRequest {
  id: string;
  patientName: string;
  medication: string;
  dosage: string;
  quantity: number;
  requestedAt: string;
  status: 'pending' | 'processing' | 'ready' | 'completed';
  daysRemaining: number;
}

const PharmacyDashboard = () => {
  const [requests, setRequests] = useState<RefillRequest[]>([
    {
      id: '1',
      patientName: 'Sarah Johnson',
      medication: 'Lisinopril',
      dosage: '10mg',
      quantity: 30,
      requestedAt: new Date().toISOString(),
      status: 'pending',
      daysRemaining: 2
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      medication: 'Metformin',
      dosage: '500mg',
      quantity: 60,
      requestedAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'processing',
      daysRemaining: 1
    },
    {
      id: '3',
      patientName: 'Emma Williams',
      medication: 'Atorvastatin',
      dosage: '20mg',
      quantity: 30,
      requestedAt: new Date(Date.now() - 7200000).toISOString(),
      status: 'ready',
      daysRemaining: 3
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const updateStatus = (id: string, newStatus: RefillRequest['status']) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'from-orange-400 to-orange-500';
      case 'processing': return 'from-blue-400 to-blue-500';
      case 'ready': return 'from-green-400 to-green-500';
      case 'completed': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 1) return 'text-red-600 bg-red-50';
    if (days <= 3) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const statusCounts = {
    pending: requests.filter(r => r.status === 'pending').length,
    processing: requests.filter(r => r.status === 'processing').length,
    ready: requests.filter(r => r.status === 'ready').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-8 pt-24"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto mb-10"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-6xl font-bold mb-2" style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Pharmacy Dashboard
            </h1>
            <p className="text-xl text-gray-600">Manage refill requests in real-time</p>
          </div>

          {/* Live indicator */}
          <motion.div
            className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
          >
            <motion.div
              className="w-3 h-3 bg-green-500 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.6, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
            <span className="font-semibold text-gray-700">Live</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-7xl mx-auto grid grid-cols-4 gap-6 mb-10"
      >
        {[
          { label: 'Pending', count: statusCounts.pending, color: 'from-orange-400 to-orange-500', icon: '⏱️' },
          { label: 'Processing', count: statusCounts.processing, color: 'from-blue-400 to-blue-500', icon: '⚙️' },
          { label: 'Ready', count: statusCounts.ready, color: 'from-green-400 to-green-500', icon: '✅' },
          { label: 'Completed', count: statusCounts.completed, color: 'from-gray-400 to-gray-500', icon: '📦' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 font-medium">{stat.label}</p>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <motion.p
              className={`text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              key={stat.count}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {stat.count}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>

      {/* Requests List */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Refill Requests</h2>
        
        <div className="space-y-4">
          <AnimatePresence>
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40 cursor-pointer"
                onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
              >
                <div className="flex items-center justify-between">
                  {/* Patient Info */}
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {request.patientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{request.patientName}</h3>
                      <p className="text-gray-600">{request.medication} • {request.dosage}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Requested {new Date(request.requestedAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Urgency Badge */}
                  <motion.div
                    className={`px-4 py-2 rounded-full font-bold ${getUrgencyColor(request.daysRemaining)}`}
                    animate={request.daysRemaining <= 1 ? {
                      scale: [1, 1.05, 1],
                    } : {}}
                    transition={{
                      duration: 1,
                      repeat: Infinity
                    }}
                  >
                    {request.daysRemaining} day{request.daysRemaining !== 1 ? 's' : ''} left
                  </motion.div>

                  {/* Quantity */}
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-800">{request.quantity}</p>
                    <p className="text-sm text-gray-500">pills</p>
                  </div>

                  {/* Status Badge */}
                  <div className={`px-6 py-3 rounded-full bg-gradient-to-r ${getStatusColor(request.status)} text-white font-bold shadow-lg`}>
                    {request.status.toUpperCase()}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {request.status === 'pending' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(request.id, 'processing');
                        }}
                        className="px-6 py-3 bg-blue-500 text-white rounded-full font-semibold shadow-lg hover:bg-blue-600"
                      >
                        Start Processing
                      </motion.button>
                    )}
                    
                    {request.status === 'processing' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(request.id, 'ready');
                        }}
                        className="px-6 py-3 bg-green-500 text-white rounded-full font-semibold shadow-lg hover:bg-green-600"
                      >
                        Mark Ready
                      </motion.button>
                    )}
                    
                    {request.status === 'ready' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(request.id, 'completed');
                        }}
                        className="px-6 py-3 bg-purple-500 text-white rounded-full font-semibold shadow-lg hover:bg-purple-600"
                      >
                        Complete ✓
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {selectedRequest === request.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-6 pt-6 border-t border-gray-200"
                    >
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Patient ID</p>
                          <p className="font-semibold">PT-{request.id.padStart(6, '0')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Insurance</p>
                          <p className="font-semibold">Blue Cross Blue Shield</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Refills Remaining</p>
                          <p className="font-semibold">3 of 12</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Floating notification */}
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-8 right-8 bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/40 max-w-sm"
      >
        <div className="flex items-start gap-4">
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xl"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            🔔
          </motion.div>
          <div>
            <p className="font-bold text-gray-800">New Refill Request!</p>
            <p className="text-sm text-gray-600 mt-1">Sarah Johnson needs Lisinopril refill in 2 days</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PharmacyDashboard;   