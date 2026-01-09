
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import {
  Activity, Droplets, Footprints, Moon, Utensils, Award,
  ChevronRight, BrainCircuit, Loader2, Plus
} from 'lucide-react';
import { healthAPI, nutritionAPI, activityAPI, sleepAPI } from '../services/api';
import { getHealthInsights } from '../services/geminiService';
import { HealthMetric } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [today, setToday] = useState<HealthMetric | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendsData, todayData] = await Promise.all([
          healthAPI.getTrends({}),
          healthAPI.getTodayMetrics()
        ]);
        setMetrics(trendsData);
        setToday(todayData);
        setLoading(false);

        // Fetch AI insights
        setAiLoading(true);
        const aiInsights = await getHealthInsights({ trends: trendsData, today: todayData });
        setInsights(aiInsights);
        setAiLoading(false);
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
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Health Dashboard</h1>
          <p className="text-slate-500">Welcome back! Here's your wellness overview for today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/activities/log')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Log Activity</span>
          </button>
        </div>
      </header>

      {/* Daily Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Footprints className="text-orange-500" />} 
          label="Steps" 
          value={today?.steps.toLocaleString() || '0'} 
          unit="steps"
          target={10000}
          color="orange"
        />
        <StatCard 
          icon={<Droplets className="text-blue-500" />} 
          label="Hydration" 
          value={(today?.waterIntake || 0).toString()} 
          unit="ml"
          target={2500}
          color="blue"
        />
        <StatCard 
          icon={<Activity className="text-red-500" />} 
          label="Calories" 
          value={today?.caloriesBurned.toString() || '0'} 
          unit="kcal"
          target={2500}
          color="red"
        />
        <StatCard 
          icon={<Moon className="text-indigo-500" />} 
          label="Wellness" 
          value={today?.wellnessScore.toString() || '0'} 
          unit="/ 100"
          target={100}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-slate-800">Activity Trends</h2>
            <select className="text-sm border-none bg-slate-50 rounded-md px-2 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="steps" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights & Achievements */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <BrainCircuit className="h-24 w-24" />
             </div>
             <div className="flex items-center gap-2 mb-4">
               <BrainCircuit className="h-5 w-5 text-blue-400" />
               <h2 className="font-semibold">AI Insights</h2>
             </div>
             {aiLoading ? (
               <div className="flex justify-center py-4">
                 <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
               </div>
             ) : (
               <ul className="space-y-3 relative z-10">
                 {insights.map((insight, idx) => (
                   <li key={idx} className="flex gap-2 text-sm text-slate-300">
                     <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                     {insight}
                   </li>
                 ))}
               </ul>
             )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center justify-between">
              Goal Progress
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </h2>
            <div className="space-y-4">
              <GoalItem label="Step Challenge" progress={64} color="orange" />
              <GoalItem label="Water Intake" progress={48} color="blue" />
              <GoalItem label="Weekly Exercise" progress={90} color="red" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  target: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, unit, target, color }) => {
  const numericValue = parseInt(value.replace(/,/g, ''));
  const progress = Math.min((numericValue / target) * 100, 100);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition cursor-default">
      <div className="flex justify-between items-start">
        <div className="p-2 rounded-xl bg-slate-50">{icon}</div>
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</div>
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-slate-800">{value}</span>
          <span className="text-xs text-slate-400">{unit}</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
          <div 
            className={`h-full rounded-full bg-${color}-500 transition-all duration-1000`} 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
};

const GoalItem: React.FC<{ label: string; progress: number; color: string }> = ({ label, progress, color }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium text-slate-900">{progress}%</span>
    </div>
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
      <div 
        className={`h-full bg-${color}-500 rounded-full`}
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

export default Dashboard;
