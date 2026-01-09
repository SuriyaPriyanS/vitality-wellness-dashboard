import React, { useEffect, useState } from 'react';
import { sleepAPI } from '../services/api';
import { SleepRecord } from '../types';
import { Moon, Plus, Clock, TrendingUp, Star, Loader2, BarChart3 } from 'lucide-react';

const Sleep: React.FC = () => {
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState({
    averageQuality: 0,
    averageDuration: 0,
    totalRecords: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordsData, analysisData] = await Promise.all([
          sleepAPI.getSleepHistory({}),
          sleepAPI.getAnalysis({})
        ]);
        setSleepRecords(recordsData);
        setAnalysis(analysisData);
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

  const formatDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 80) return 'text-green-500 bg-green-50';
    if (quality >= 60) return 'text-yellow-500 bg-yellow-50';
    return 'text-red-500 bg-red-50';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sleep Tracking</h1>
          <p className="text-slate-500">Monitor your sleep patterns and quality.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          <Plus className="h-4 w-4" />
          <span>Log Sleep</span>
        </button>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Moon className="text-indigo-500" />}
          label="Average Quality"
          value={`${analysis.averageQuality}%`}
          unit="score"
        />
        <StatCard
          icon={<Clock className="text-blue-500" />}
          label="Average Duration"
          value={`${Math.round(analysis.averageDuration / 60)}h`}
          unit="per night"
        />
        <StatCard
          icon={<BarChart3 className="text-purple-500" />}
          label="Total Records"
          value={analysis.totalRecords.toString()}
          unit="nights"
        />
      </div>

      {/* Sleep Records */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Sleep History</h2>
        </div>

        <div className="divide-y divide-slate-50">
          {sleepRecords.map((record) => (
            <div key={record.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Moon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">
                    {new Date(record.startTime).toLocaleDateString()}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-slate-500">
                      {formatDuration(record.startTime, record.endTime)}
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getQualityColor(record.quality)}`}>
                      {record.quality}% quality
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">{record.deepSleepMinutes} min</p>
                <p className="text-xs text-slate-400">deep sleep</p>
              </div>
            </div>
          ))}
          {sleepRecords.length === 0 && (
            <div className="p-12 text-center">
              <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Moon className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-slate-500">No sleep records yet.</p>
              <p className="text-sm text-slate-400 mt-1">Start tracking your sleep for better insights!</p>
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

export default Sleep;