import React, { useEffect, useState } from 'react';
import { goalsAPI } from '../services/api';
import { Goal, GoalStatus } from '../types';
import { Target, Plus, CheckCircle, Clock, AlertTriangle, Loader2, TrendingUp } from 'lucide-react';

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await goalsAPI.getGoals({});
        setGoals(data);
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
    fetchGoals();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const getStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.COMPLETED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case GoalStatus.IN_PROGRESS:
        return <Clock className="h-5 w-5 text-blue-500" />;
      case GoalStatus.FAILED:
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Target className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.COMPLETED:
        return 'border-green-200 bg-green-50';
      case GoalStatus.IN_PROGRESS:
        return 'border-blue-200 bg-blue-50';
      case GoalStatus.FAILED:
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Steps': return 'bg-orange-100 text-orange-700';
      case 'Water': return 'bg-blue-100 text-blue-700';
      case 'Weight': return 'bg-purple-100 text-purple-700';
      case 'Sleep': return 'bg-indigo-100 text-indigo-700';
      case 'Activity': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Goals & Achievements</h1>
          <p className="text-slate-500">Set and track your wellness objectives.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          <Plus className="h-4 w-4" />
          <span>Create Goal</span>
        </button>
      </header>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className={`p-6 rounded-2xl border-2 shadow-sm hover:shadow-md transition ${getStatusColor(goal.status)}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(goal.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(goal.category)}`}>
                  {goal.category}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Due</p>
                <p className="text-xs font-medium text-slate-700">
                  {new Date(goal.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>

            <h3 className="font-semibold text-slate-900 mb-2">{goal.title}</h3>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Progress</span>
                <span className="font-medium text-slate-900">
                  {goal.currentValue} / {goal.targetValue}
                </span>
              </div>
              <div className="w-full bg-white h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                  style={{ width: `${calculateProgress(goal.currentValue, goal.targetValue)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">
                {Math.round(calculateProgress(goal.currentValue, goal.targetValue))}% complete
              </p>
            </div>
          </div>
        ))}

        {goals.length === 0 && (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-slate-500">No goals set yet.</p>
            <p className="text-sm text-slate-400 mt-1">Create your first goal to start tracking progress!</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <p className="text-xl font-bold text-slate-900">
                {goals.filter(g => g.status === GoalStatus.COMPLETED).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">In Progress</p>
              <p className="text-xl font-bold text-slate-900">
                {goals.filter(g => g.status === GoalStatus.IN_PROGRESS).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Success Rate</p>
              <p className="text-xl font-bold text-slate-900">
                {goals.length > 0 ? Math.round((goals.filter(g => g.status === GoalStatus.COMPLETED).length / goals.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;