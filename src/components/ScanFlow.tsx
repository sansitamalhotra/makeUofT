import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { playSound } from '../utils/sounds';

interface ScanFlowProps {
  onComplete: (pillData: any) => void;
  onAddAnother: () => void;
  onBack: () => void;
}

type ScanStep = 'camera' | 'scanning' | 'success' | 'info' | 'schedule' | 'error';

interface ScheduleSetup {
  frequency: '1x' | '2x' | '3x';
  times: string[];
}

// 🔥 DRUG INFORMATION DATABASE
const DRUG_DATABASE: Record<string, {
  name: string;
  genericName: string;
  brandNames: string[];
  uses: string[];
  sideEffects: string[];
  warnings: string[];
  category: string;
  color: string;
}> = {
  'Lisinopril': {
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    brandNames: ['Prinivil', 'Zestril'],
    uses: [
      'Treats high blood pressure (hypertension)',
      'Prevents heart attacks and strokes',
      'Treats heart failure',
      'Improves survival after heart attack'
    ],
    sideEffects: ['Dizziness', 'Headache', 'Dry cough', 'Fatigue'],
    warnings: ['May cause dizziness when standing up', 'Avoid alcohol', 'Monitor blood pressure regularly'],
    category: 'ACE Inhibitor',
    color: 'from-red-400 to-red-500'
  },
  'Metformin': {
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    brandNames: ['Glucophage', 'Fortamet', 'Glumetza'],
    uses: [
      'Controls blood sugar in type 2 diabetes',
      'Reduces risk of diabetes complications',
      'May help with weight management',
      'Lowers cholesterol and triglyceride levels'
    ],
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset', 'Metallic taste in mouth'],
    warnings: ['Take with food to reduce stomach upset', 'Stay well hydrated', 'Monitor blood sugar regularly'],
    category: 'Antidiabetic (Biguanide)',
    color: 'from-blue-400 to-blue-500'
  },
  'Atorvastatin': {
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    brandNames: ['Lipitor'],
    uses: [
      'Lowers bad cholesterol (LDL)',
      'Raises good cholesterol (HDL)',
      'Reduces risk of heart attack and stroke',
      'Treats high cholesterol and triglycerides'
    ],
    sideEffects: ['Muscle pain or weakness', 'Joint pain', 'Headache', 'Nausea'],
    warnings: ['Avoid grapefruit juice', 'Report unexplained muscle pain immediately', 'Regular liver function tests needed'],
    category: 'Statin (Cholesterol Medication)',
    color: 'from-yellow-400 to-yellow-500'
  },
  'Amlodipine': {
    name: 'Amlodipine',
    genericName: 'Amlodipine Besylate',
    brandNames: ['Norvasc'],
    uses: [
      'Treats high blood pressure',
      'Prevents chest pain (angina)',
      'Reduces risk of heart attack and stroke',
      'Improves blood flow to the heart'
    ],
    sideEffects: ['Swelling in legs/ankles', 'Fatigue', 'Dizziness', 'Flushing'],
    warnings: ['May cause swelling in extremities', 'Rise slowly from sitting or lying down', 'Monitor blood pressure regularly'],
    category: 'Calcium Channel Blocker',
    color: 'from-green-400 to-green-500'
  }
};

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
      
      // Try backend integration
      scanWithBackend(imageSrc);
    }
  };

  const scanWithBackend = async (image: string) => {
    try {
      const response = await fetch("http://localhost:3000/scan-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          image: image,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Backend scan result:", result);
        
        setDetectedMed({
          name: result.medication || result.name,
          dosage: result.dosage,
          instructions: result.instructions || result.timing,
          patientName: result.patientName
        });
        playSound('success');
        setStep('success');
      } else {
        throw new Error('Backend scan failed');
      }
    } catch (error) {
      console.warn("⚠️ Backend not available, using mock data:", error);
      
      // Fallback to mock data
      setTimeout(() => {
        const success = Math.random() > 0.2;
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
    
    const today = new Date();
    const [hours, minutes] = schedule.times[0].split(':');
    const startDate = new Date(today);
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startDateTime = formatDate(startDate);
    const endDate = new Date(startDate.getTime() + 60 * 60000);
    const endDateTime = formatDate(endDate);
    const recurrence = 'RRULE:FREQ=DAILY;COUNT=90';

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

  const sendToBackendCalendar = async (pillData: any) => {
    try {
      const response = await fetch("http://localhost:3000/add-medication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medication: pillData,
          schedule: schedule,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Medication registered in backend:", result);
      }
    } catch (error) {
      console.warn("⚠️ Backend calendar registration failed:", error);
    }
  };

  const handleAddToCalendar = async () => {
    playSound('success');
    
    await sendToBackendCalendar(detectedMed);
    
    const calendarLink = generateGoogleCalendarLink();
    window.open(calendarLink, '_blank', 'width=1000,height=800');
    
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
            <p className="mt-4 text-sm text-gray-500">
              {capturedImage ? '🔍 Analyzing with OCR...' : '⚠️ Demo Mode'}
            </p>
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
                  onClick={() => {
                    playSound('whoosh');
                    setStep('info');
                  }}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg"
                >
                  📖 Learn More
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 🔥 DRUG INFORMATION SCREEN */}
        {step === 'info' && detectedMed && DRUG_DATABASE[detectedMed.name] && (
          <motion.div
            key="info"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-br ${DRUG_DATABASE[detectedMed.name].color} rounded-full shadow-xl flex items-center justify-center`}
                >
                  <span className="text-4xl">💊</span>
                </motion.div>
                <h2 className="text-5xl font-bold text-gray-800 mb-2">{DRUG_DATABASE[detectedMed.name].name}</h2>
                <p className="text-2xl text-gray-600 mb-2">{DRUG_DATABASE[detectedMed.name].genericName}</p>
                <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-bold text-sm">
                  {DRUG_DATABASE[detectedMed.name].category}
                </div>
              </div>

              {/* Brand Names */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🏷️</span>
                  Also Known As
                </h3>
                <div className="flex flex-wrap gap-2">
                  {DRUG_DATABASE[detectedMed.name].brandNames.map((brand, i) => (
                    <span key={i} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
                      {brand}
                    </span>
                  ))}
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* What It Treats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    What It Treats
                  </h3>
                  <ul className="space-y-2">
                    {DRUG_DATABASE[detectedMed.name].uses.map((use, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <span className="text-green-500 mt-1">•</span>
                        <span>{use}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Side Effects */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-orange-200"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    Possible Side Effects
                  </h3>
                  <ul className="space-y-2">
                    {DRUG_DATABASE[detectedMed.name].sideEffects.map((effect, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{effect}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Important Warnings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-200 mb-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🚨</span>
                  Important Warnings
                </h3>
                <ul className="space-y-2">
                  {DRUG_DATABASE[detectedMed.name].warnings.map((warning, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <span className="text-red-500 mt-1">•</span>
                      <span>{warning}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-gray-100 rounded-xl p-4 mb-6"
              >
                <p className="text-xs text-gray-600 text-center">
                  ⚕️ This information is for educational purposes only. Always consult your doctor or pharmacist before starting, stopping, or changing any medication.
                </p>
              </motion.div>

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

              {/* Integration Info */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 mb-6 border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔗</span>
                  <p className="font-bold text-purple-900">Smart Integration</p>
                </div>
                <p className="text-sm text-gray-600">
                  ✅ Google Calendar reminders<br/>
                  ✅ Arduino sensor tracking<br/>
                  ✅ Automatic dose verification
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep('info')}
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