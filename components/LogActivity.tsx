import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activityAPI } from '../services/api';
import { ArrowLeft, Loader2, Activity as ActivityIcon } from 'lucide-react';

interface ActivityFormData {
  type: string;
  duration: number;
  intensity: 'Low' | 'Moderate' | 'High';
  caloriesBurned: number;
  timestamp: string;
}

const LogActivity: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ActivityFormData>({
    type: '',
    duration: 30,
    intensity: 'Moderate',
    caloriesBurned: 0,
    timestamp: new Date().toISOString().slice(0, 16),
  });

  const activityTypes = [
    'Running',
    'Walking',
    'Cycling',
    'Swimming',
    'Yoga',
    'Weight Training',
    'HIIT',
    'Pilates',
    'Dancing',
    'Hiking',
    'Other',
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' || name === 'caloriesBurned' ? Number(value) : value,
    }));
  };

  const calculateCalories = () => {
    const baseCaloriesPerMinute: Record<string, number> = {
      Running: 10,
      Walking: 4,
      Cycling: 8,
      Swimming: 9,
      Yoga: 3,
      'Weight Training': 6,
      HIIT: 12,
      Pilates: 4,
      Dancing: 7,
      Hiking: 6,
      Other: 5,
    };

    const intensityMultiplier: Record<string, number> = {
      Low: 0.8,
      Moderate: 1,
      High: 1.3,
    };

    const base = baseCaloriesPerMinute[formData.type] || 5;
    const multiplier = intensityMultiplier[formData.intensity] || 1;
    const estimated = Math.round(base * formData.duration * multiplier);

    setFormData((prev) => ({ ...prev, caloriesBurned: estimated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await activityAPI.logActivity({
        ...formData,
        timestamp: new Date(formData.timestamp).toISOString(),
      });
      navigate('/activities');
    } catch (err: any) {
      setError(err.message || 'Failed to log activity. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <button
          onClick={() => navigate('/activities')}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Log Activity</h1>
          <p className="text-slate-500">Record your physical activity</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Activity Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Activity Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select an activity</option>
              {activityTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              min="1"
              max="480"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Intensity */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Intensity
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Low', 'Moderate', 'High'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, intensity: level }))}
                  className={`px-4 py-3 rounded-xl border-2 font-medium transition ${
                    formData.intensity === level
                      ? level === 'Low'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : level === 'Moderate'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Calories Burned */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Calories Burned
              </label>
              <button
                type="button"
                onClick={calculateCalories}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Estimate calories
              </button>
            </div>
            <input
              type="number"
              name="caloriesBurned"
              value={formData.caloriesBurned}
              onChange={handleInputChange}
              min="0"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date & Time
            </label>
            <input
              type="datetime-local"
              name="timestamp"
              value={formData.timestamp}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/activities')}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.type}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <ActivityIcon className="h-4 w-4" />
                  <span>Log Activity</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogActivity;
