import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';

interface ScanFlowProps {
  onScanComplete: (pillData: any) => void;
  onAddAnother: () => void;
  onBack: () => void;
}

const ScanFlow = ({ onScanComplete, onAddAnother, onBack }: ScanFlowProps) => {
  const [step, setStep] = useState<'camera' | 'scanning' | 'results' | 'error'>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [pillData, setPillData] = useState<any>(null);
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      startScanning(imageSrc);
    }
  }, [webcamRef]);

  const startScanning = async (image: string) => {
    setStep('scanning');
    
    // Simulate scanning progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setScanProgress(i);
    }

    // Simulate random success/failure for demo (70% success rate)
    const isSuccess = Math.random() > 0.3;

    if (!isSuccess) {
      setStep('error');
      return;
    }

    // TODO: Replace with actual Gemini API call
    // This is MOCK DATA - replace with real Gemini response
    const medications = [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', timing: 'Morning', color: 'from-blue-400 to-blue-600' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', timing: 'Morning & Evening', color: 'from-purple-400 to-purple-600' },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', timing: 'Bedtime', color: 'from-pink-400 to-pink-600' },
    ];

    const randomMed = medications[Math.floor(Math.random() * medications.length)];
    const mockPillData = {
      ...randomMed,
      quantity: 30,
    };

    setPillData(mockPillData);
    setStep('results');
  };

  const retake = () => {
    setCapturedImage(null);
    setPillData(null);
    setScanProgress(0);
    setStep('camera');
  };

  const handleAddAnother = () => {
    // Reset everything and go back to camera
    setCapturedImage(null);
    setPillData(null);
    setScanProgress(0);
    setStep('camera');
    // Don't call onAddAnother - just stay in scan mode
  };

  return (
      <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 pt-20"
    >
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="absolute top-24 left-8 p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center gap-2 font-semibold text-gray-700 z-50"
      >
        ← Back
      </motion.button>

      <AnimatePresence mode="wait">
        {step === 'camera' && (
          <motion.div
            key="camera"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-center"
          >
            <h2 className="text-5xl font-bold mb-4" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Scan Your Pill Bottle
            </h2>
            <p className="text-gray-600 text-lg mb-8">Position the prescription label clearly in the frame</p>
            
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-2xl mb-8 bg-black"
              whileHover={{ scale: 1.02 }}
            >
              {/* Scanning Frame Animation */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Corner Brackets */}
                {[[0,0], [0,1], [1,0], [1,1]].map(([x, y], i) => (
                  <motion.div
                    key={i}
                    className="absolute w-16 h-16 border-4 border-cyan-400"
                    style={{
                      top: y ? 'auto' : 16,
                      bottom: y ? 16 : 'auto',
                      left: x ? 'auto' : 16,
                      right: x ? 16 : 'auto',
                      borderTop: y ? 'none' : undefined,
                      borderBottom: y ? undefined : 'none',
                      borderLeft: x ? 'none' : undefined,
                      borderRight: x ? undefined : 'none',
                    }}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
                
                {/* Scanning Line */}
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/50"
                  animate={{
                    top: ['5%', '95%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              </div>

              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-[640px] h-[480px]"
                videoConstraints={{
                  facingMode: 'environment' // Back camera on phones
                }}
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={capture}
              className="px-16 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-bold rounded-full shadow-xl"
            >
              📸 Capture Photo
            </motion.button>

            <p className="mt-6 text-gray-500">
              ⚠️ Demo Mode: Using mock data. Gemini API integration coming soon!
            </p>
          </motion.div>
        )}

        {step === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-center"
          >
            <h2 className="text-5xl font-bold mb-8 text-gray-800">
              Analyzing Prescription...
            </h2>

            <div className="relative w-96 h-96 mb-8">
              <motion.img
                src={capturedImage || ''}
                alt="Captured"
                className="w-full h-full object-cover rounded-3xl"
                animate={{
                  filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-3xl" />
              
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-cyan-400 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: Math.cos((i / 12) * Math.PI * 2) * 180,
                    y: Math.sin((i / 12) * Math.PI * 2) * 180,
                    scale: [1, 1.5, 1],
                    opacity: [0.8, 0.3, 0.8]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>

            <div className="w-96 mx-auto">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${scanProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <p className="text-gray-600 font-medium text-lg">{scanProgress}% Complete</p>
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 bg-cyan-500 rounded-full"
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === 'error' && (
          <motion.div
            key="error"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: 3,
              }}
            >
              <div className="text-8xl mb-6">❌</div>
            </motion.div>

            <h2 className="text-5xl font-bold text-red-600 mb-4">
              No Medicine Found
            </h2>
            <p className="text-gray-600 text-xl mb-8 max-w-md mx-auto">
              We couldn't identify the medication from this image. Please try again with better lighting or a clearer view of the label.
            </p>

            {capturedImage && (
              <motion.img
                src={capturedImage}
                alt="Failed scan"
                className="w-80 h-60 object-cover rounded-2xl mx-auto mb-8 opacity-50"
              />
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={retake}
              className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-bold rounded-full shadow-xl"
            >
              📸 Retake Photo
            </motion.button>
          </motion.div>
        )}

        {step === 'results' && pillData && (
          <motion.div
            key="results"
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="text-center max-w-2xl"
          >
            <motion.div
              animate={{
                y: [0, -8, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-6xl mb-3">💊</div>
            </motion.div>
            
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Medication Identified!
            </h2>

            <motion.div
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 w-[450px] mx-auto border border-white/40"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-br ${pillData.color} rounded-full shadow-xl flex items-center justify-center`}>
                <span className="text-3xl text-white font-bold">
                  {pillData.dosage}
                </span>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                {pillData.name}
              </h3>

              <div className="space-y-3 text-left">
                <InfoRow label="Dosage" value={pillData.dosage} />
                <InfoRow label="Frequency" value={pillData.frequency} />
                <InfoRow label="Timing" value={pillData.timing} />
                <InfoRow label="Quantity" value={`${pillData.quantity} pills`} />
              </div>
            </motion.div>

            <div className="flex gap-3 mt-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={retake}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-full"
              >
                Retake Photo
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onScanComplete(pillData)}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-full shadow-lg"
              >
                Continue to Tracker →
              </motion.button>
            </div>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddAnother}
              className="mt-4 text-blue-600 font-semibold underline"
            >
              + Add Another Medicine
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-200">
    <span className="text-gray-500 font-medium">{label}:</span>
    <span className="text-gray-800 font-semibold">{value}</span>
  </div>
);

export default ScanFlow;