import { useState } from 'react';
import { motion } from 'framer-motion';
import { playSound } from '../utils/sounds';

interface ScheduleSetupProps {
  medication: {
    name: string;
    dosage: string;
    imageUrl?: string;
  };
  onComplete: (schedule: MedicationSchedule) => void;
  onBack: () => void;
}

export interface MedicationSchedule {
  medication: {
    name: string;
    dosage: string;
  };
  frequency: string;
  times: string[];
  startDate: string;
}

const ScheduleSetup = ({ medication, onComplete, onBack }: ScheduleSetupProps) => {
  const [frequency, setFrequency] = useState<'once' | 'twice' | 'three'>('once');
  const [times, setTimes] = useState<string[]>(['08:00']);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const frequencyOptions = [
    { value: 'once', label: 'Once Daily', times: ['08:00'] },
    { value: 'twice', label: 'Twice Daily', times: ['08:00', '20:00'] },
    { value: 'three', label: '3 Times Daily', times: ['08:00', '14:00', '20:00'] },
  ];

  const handleFrequencyChange = (freq: 'once' | 'twice' | 'three') => {
    playSound('pop');
    setFrequency(freq);
    const option = frequencyOptions.find(o => o.value === freq);
    if (option) {
      setTimes(option.times);
    }
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };

  const handleSubmit = () => {
    playSound('success');
    onComplete({
      medication,
      frequency: frequencyOptions.find(o => o.value === frequency)?.label || 'Once Daily',
      times,
      startDate,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex flex-col items-center justify-center min-h-screen p-6"
    >
      <div className="w-full max-w-md">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playSound('whoosh');
            onBack();
          }}
          className="mb-6 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center gap-2 font-semibold text-gray-700"
        >
          ← Back
        </motion.button>

        {/* Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl shadow-lg"
            >
              💊
            </motion.div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Set Your Schedule
            </h2>
            <p className="text-gray-600">
              {medication.name} • {medication.dosage}
            </p>
          </div>

          {/* Frequency Selection */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              How often do you take this?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {frequencyOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFrequencyChange(option.value as 'once' | 'twice' | 'three')}
                  className={`p-4 rounded-xl font-semibold transition-all ${
                    frequency === option.value
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label.replace(' Daily', '')}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              What time(s)?
            </label>
            <div className="space-y-3">
              {times.map((time, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none text-lg font-semibold"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Start Date */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none text-lg font-semibold"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            Add to Google Calendar 📅
          </motion.button>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200"
          >
            <p className="text-sm text-gray-600 mb-2">📌 Reminder Preview:</p>
            <p className="font-semibold text-gray-800">
              "{medication.name}" at {times.join(', ')}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Starting {new Date(startDate).toLocaleDateString()} • Repeats daily
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ScheduleSetup;