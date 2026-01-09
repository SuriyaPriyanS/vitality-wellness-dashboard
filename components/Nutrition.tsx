
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { nutritionAPI } from '../services/api';
import { Meal } from '../types';
import { Camera, Plus, Utensils, Search, Filter, Loader2, X } from 'lucide-react';

type MealFormData = Omit<Meal, 'id'>;

const Nutrition: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MealFormData>({});

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const data = await nutritionAPI.getMeals({});
        console.log(data, "data");
        setMeals(data);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 401) {
          // Token is invalid or expired, clear it and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return;
        }
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const onSubmit = async (data: MealFormData) => {
    try {
      const newMeal = await nutritionAPI.logMeal(data);
      setMeals(prev => [newMeal, ...prev]);
      setShowAddMealForm(false);
      reset();
    } catch (err) {
      console.error('Failed to add meal:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nutrition Tracking</h1>
          <p className="text-slate-500">Log your meals and monitor your macros.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition">
            <Camera className="h-4 w-4" />
            <span>Scan Plate</span>
          </button>
          <button onClick={() => setShowAddMealForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus className="h-4 w-4" />
            <span>Add Meal</span>
          </button>
        </div>
      </header>

      {/* Macros Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MacroCard label="Protein" current={85} target={120} unit="g" color="blue" />
        <MacroCard label="Carbs" current={140} target={200} unit="g" color="orange" />
        <MacroCard label="Fats" current={45} target={65} unit="g" color="yellow" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Recent Meals</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition">
              <Filter className="h-4 w-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {meals.map((meal) => (
            <div key={meal.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Utensils className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{meal.name}</h3>
                  <p className="text-xs text-slate-500">{meal.type} • {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">{meal.calories} kcal</p>
                <p className="text-xs text-slate-400">P:{meal.protein}g C:{meal.carbs}g F:{meal.fats}g</p>
              </div>
            </div>
          ))}
          {meals.length === 0 && (
            <div className="p-12 text-center">
              <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-slate-500">No meals logged for today yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddMealForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Add Meal</h3>
              <button onClick={() => setShowAddMealForm(false)} className="p-2 hover:bg-slate-100 rounded-lg transition">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meal Name</label>
                <input
                  {...register('name', { required: 'Meal name is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Chicken Salad"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meal Type</label>
                <select
                  {...register('type', { required: 'Meal type is required' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Calories</label>
                  <input
                    {...register('calories', { required: 'Calories are required', valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="kcal"
                  />
                  {errors.calories && <p className="text-red-500 text-xs mt-1">{errors.calories.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Protein (g)</label>
                  <input
                    {...register('protein', { required: 'Protein is required', valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="g"
                  />
                  {errors.protein && <p className="text-red-500 text-xs mt-1">{errors.protein.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Carbs (g)</label>
                  <input
                    {...register('carbs', { required: 'Carbs are required', valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="g"
                  />
                  {errors.carbs && <p className="text-red-500 text-xs mt-1">{errors.carbs.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fats (g)</label>
                  <input
                    {...register('fats', { required: 'Fats are required', valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="g"
                  />
                  {errors.fats && <p className="text-red-500 text-xs mt-1">{errors.fats.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Timestamp</label>
                <input
                  {...register('timestamp', { required: 'Timestamp is required' })}
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.timestamp && <p className="text-red-500 text-xs mt-1">{errors.timestamp.message}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMealForm(false)}
                  className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Add Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const MacroCard: React.FC<{ label: string; current: number; target: number; unit: string; color: string }> = ({ label, current, target, unit, color }) => {
  const percentage = Math.min((current / target) * 100, 100);
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-50 text-slate-600 rounded-full">{current} / {target}{unit}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full bg-${color}-500 rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default Nutrition;
