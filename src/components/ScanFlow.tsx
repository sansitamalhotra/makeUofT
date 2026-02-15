import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { playSound } from '../utils/sounds';

interface ScanFlowProps {
  onComplete: (pillData: any) => void;
  onAddAnother: () => void;  // ADD THIS LINE
  onBack: () => void;
}

type ScanStep = 'camera' | 'scanning' | 'success' | 'error' | 'schedule';

interface ScheduleSetup {
  frequency: '1x' | '2x' | '3x';
  times: string[];
}

const ScanFlow = ({ onComplete, onAddAnother, onBack }: ScanFlowProps) => {
  const [step, setStep] = useState<ScanStep>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedMed, setDetectedMed] = useState<any>(null);
  const [schedule, setSchedule] = useState<ScheduleSetup>({
    frequency: '1x',
    times: ['09:00']
  });

  const mockMedications = [
    { name: 'Lisinopril', dosage: '10mg', instructions: 'Take once daily with water' },
    { name: 'Metformin', dosage: '500mg', instructions: 'Take twice daily with meals' },
    { name: 'Atorvastatin', dosage: '20mg', instructions: 'Take once daily at bedtime' },
    { name: 'Amlodipine', dosage: '5mg', instructions: 'Take once daily in the morning' },
  ];

  const handleCapture = (webcamRef: any) => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      playSound('whoosh');
      setStep('scanning');
      
      setTimeout(() => {
        const success = Math.random() > 0.3;
        if (success) {
          const randomMed = mockMedications[Math.floor(Math.random() * mockMedications.length)];
          setDetectedMed(randomMed);
          playSound('success');
          setStep('success');
        } else {
          playSound('pop');
          setStep('error');
        }
      }, 2000);
    }
  };

  const handleRetake = () => {
    playSound('whoosh');
    setCapturedImage(null);
    setDetectedMed(null);
    setStep('camera');
  };

  const handleProceedToSchedule = () => {
    playSound('whoosh');
    setStep('schedule');
  };

  const updateFrequency = (freq: '1x' | '2x' | '3x') => {
    playSound('pop');
    const defaultTimes = {
      '1x': ['09:00'],
      '2x': ['09:00', '21:00'],
      '3x': ['08:00', '14:00', '20:00']
    };
    setSchedule({
      frequency: freq,
      times: defaultTimes[freq]
    });
  };

  const updateTime = (index: number, value: string) => {
    const newTimes = [...schedule.times];
    newTimes[index] = value;
    setSchedule({ ...schedule, times: newTimes });
  };

  const generateGoogleCalendarLink = () => {
  const title = `💊 ${detectedMed.name} - ${detectedMed.dosage}`;
  const description = `${detectedMed.instructions}\n\n` +
    `⏰ Frequency: ${schedule.frequency} daily\n` +
    `🕐 Time(s): ${schedule.times.join(', ')}\n\n` +
    `Reminder: Take this medication as prescribed!`;
  
  // Create date for the first dose time
  const today = new Date();
  const [hours, minutes] = schedule.times[0].split(':');
  const startDate = new Date(today);
  startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const startDateTime = formatDate(startDate);
  
  // ⭐ CHANGED: Make event 1 HOUR long instead of 15 minutes
  const endDate = new Date(startDate.getTime() + 60 * 60000); // 1 hour duration
  const endDateTime = formatDate(endDate);

  // Create recurring rule for daily repetition
  const recurrence = 'RRULE:FREQ=DAILY;COUNT=90'; // 90 days of medication

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details: description,
    dates: `${startDateTime}/${endDateTime}`,
    recur: recurrence,
    trp: 'true'
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

  const handleAddToCalendar = () => {
  playSound('success');
  const calendarLink = generateGoogleCalendarLink();
  
  // Open in larger window for better visibility
  window.open(calendarLink, '_blank', 'width=1000,height=800');
  
  // Complete the flow after opening calendar
  setTimeout(() => {
    onComplete({
      ...detectedMed,
      schedule
    });
  }, 500);
};
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {/* CAMERA VIEW */}
        {step === 'camera' && (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md"
          >
            <CameraView onCapture={handleCapture} onBack={onBack} />
          </motion.div>
        )}

        {/* SCANNING ANIMATION */}
        {step === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <ScanningAnimation />
          </motion.div>
        )}

        {/* SUCCESS - SHOW MEDICATION */}
        {step === 'success' && detectedMed && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-400">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center"
              >
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <h2 className="text-3xl font-bold text-gray-800 mb-2">Medicine Detected!</h2>
              
              <div className="bg-blue-50 rounded-2xl p-6 my-6">
                <p className="text-2xl font-bold text-blue-900 mb-1">{detectedMed.name}</p>
                <p className="text-lg text-blue-700 mb-3">{detectedMed.dosage}</p>
                <p className="text-sm text-gray-600">{detectedMed.instructions}</p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRetake}
                  className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl font-semibold"
                >
                  Retake Photo
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleProceedToSchedule}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-semibold shadow-lg"
                >
                  Set Schedule →
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* SCHEDULE SETUP */}
        {step === 'schedule' && detectedMed && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Set Your Schedule</h2>
              <p className="text-gray-600 mb-6">{detectedMed.name} ({detectedMed.dosage})</p>

              {/* Frequency Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">How often?</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['1x', '2x', '3x'] as const).map((freq) => (
                    <motion.button
                      key={freq}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateFrequency(freq)}
                      className={`py-4 rounded-2xl font-bold text-lg transition-all ${
                        schedule.frequency === freq
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {freq} Daily
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Time Pickers */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">What time(s)?</label>
                <div className="space-y-3">
                  {schedule.times.map((time, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-gray-600 font-medium">Dose {index + 1}:</span>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => updateTime(index, e.target.value)}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none font-semibold text-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar Info */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 mb-6 border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📅</span>
                  <p className="font-bold text-purple-900">Google Calendar Integration</p>
                </div>
                <p className="text-sm text-gray-600">
                  We'll open Google Calendar with a pre-filled reminder. Just click "Save" to add it!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep('success')}
                  className="px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl font-semibold"
                >
                  ← Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCalendar}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2"
                >
                  <span className="text-xl">✅</span>
                  Add to Calendar
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ERROR STATE */}
        {step === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-red-400">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="w-24 h-24 bg-red-500 rounded-full mx-auto mb-6 flex items-center justify-center"
              >
                <span className="text-5xl">❌</span>
              </motion.div>

              <h2 className="text-3xl font-bold text-gray-800 mb-2">No Medicine Found</h2>
              <p className="text-gray-600 mb-8">Please try again with a clearer photo of your medication bottle.</p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetake}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-semibold shadow-lg"
              >
                Try Again
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Camera Component
const CameraView = ({ onCapture, onBack }: { onCapture: (ref: any) => void; onBack: () => void }) => {
  const webcamRef = { current: null } as any;

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="relative">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'environment' }}
          className="w-full rounded-t-3xl"
        />
        
        {/* Scanning Frame Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-white/80 rounded-3xl">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-8 border-l-8 border-cyan-400 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-8 border-r-8 border-cyan-400 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-8 border-l-8 border-cyan-400 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-8 border-r-8 border-cyan-400 rounded-br-2xl" />
            
            <motion.div
              className="absolute inset-x-0 h-1 bg-cyan-400"
              animate={{ y: [0, 256, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-center text-gray-600 mb-6">Position the medication label within the frame</p>
        
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl font-semibold"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCapture(webcamRef)}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-semibold shadow-lg"
          >
            📸 Capture
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Scanning Animation
const ScanningAnimation = () => (
  <div className="bg-white rounded-3xl shadow-2xl p-12">
    <motion.div
      className="relative w-32 h-32 mx-auto mb-8"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    >
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-blue-500 rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transform: `rotate(${i * 45}deg) translateY(-50px)`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.125,
          }}
        />
      ))}
    </motion.div>

    <h2 className="text-2xl font-bold text-gray-800 mb-4">Analyzing Medication...</h2>
    
    <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 2 }}
      />
    </div>
  </div>
);

export default ScanFlow;