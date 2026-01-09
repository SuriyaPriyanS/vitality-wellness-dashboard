import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activityAPI } from '../services/api';
import { Activity } from '../types';
import { Activity as ActivityIcon, Plus, Clock, Flame, TrendingUp, Loader2, Filter } from 'lucide-react';

const ActivityComponent: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalActivities: 0,
    totalDuration: 0,
    totalCalories: 0,
    weeklyAverage: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activitiesData, statsData] = await Promise.all([
          activityAPI.getActivities({}),
          activityAPI.getStats({})
        ]);
        setActivities(activitiesData);
        setStats(statsData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'High': return 'text-red-500 bg-red-50';
      case 'Moderate': return 'text-orange-500 bg-orange-50';
      case 'Low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity Tracking</h1>
          <p className="text-slate-500">Monitor your physical activities and fitness progress.</p>
        </div>
        <button
          onClick={() => navigate('/activities/log')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Log Activity</span>
        </button>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<ActivityIcon className="text-blue-500" />}
          label="Total Activities"
          value={stats.totalActivities.toString()}
          unit="this week"
        />
        <StatCard
          icon={<Clock className="text-green-500" />}
          label="Total Duration"
          value={Math.round(stats.totalDuration / 60).toString()}
          unit="hours"
        />
        <StatCard
          icon={<Flame className="text-red-500" />}
          label="Calories Burned"
          value={stats.totalCalories.toString()}
          unit="kcal"
        />
        <StatCard
          icon={<TrendingUp className="text-purple-500" />}
          label="Weekly Average"
          value={stats.weeklyAverage.toString()}
          unit="activities"
        />
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Recent Activities</h2>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition">
            <Filter className="h-4 w-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-50">
          {activities.map((activity) => (
            <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <ActivityIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{activity.type}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-slate-500">
                      {new Date(activity.timestamp).toLocaleDateString()} • {activity.duration} min
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getIntensityColor(activity.intensity)}`}>
                      {activity.intensity}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">{activity.caloriesBurned} kcal</p>
                <p className="text-xs text-slate-400">burned</p>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="p-12 text-center">
              <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ActivityIcon className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-slate-500">No activities logged yet.</p>
              <p className="text-sm text-slate-400 mt-1">Start tracking your fitness journey!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; unit: string }> = ({ icon, label, value, unit }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        <p className="text-xs text-slate-400">{unit}</p>
      </div>
      <div className="p-3 bg-slate-50 rounded-xl">
        {icon}
      </div>
    </div>
  </div>
);

export default ActivityComponent;