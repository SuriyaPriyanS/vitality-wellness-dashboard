import React, { useEffect, useState } from 'react';
import { achievementsAPI } from '../services/api';
import { Achievement } from '../types';
import { Trophy, Star, Award, Lock, Loader2, CheckCircle } from 'lucide-react';

const Achievements: React.FC = () => {
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const [allData, userData] = await Promise.all([
          achievementsAPI.getAllAchievements(),
          achievementsAPI.getUserAchievements()
        ]);
        setAllAchievements(allData);
        setUserAchievements(userData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const isUnlocked = (achievement: Achievement) => {
    return userAchievements.some(userAch => userAch.id === achievement.id);
  };

  const getAchievementIcon = (icon: string) => {
    // This could be expanded to handle different icon types
    switch (icon) {
      case 'trophy': return <Trophy className="h-6 w-6" />;
      case 'star': return <Star className="h-6 w-6" />;
      case 'award': return <Award className="h-6 w-6" />;
      default: return <Trophy className="h-6 w-6" />;
    }
  };

  const unlockedCount = userAchievements.length;
  const totalCount = allAchievements.length;
  const completionPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Achievements</h1>
          <p className="text-slate-500">Celebrate your wellness milestones and accomplishments.</p>
        </div>

        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8" />
              <div>
                <h2 className="text-xl font-bold">Achievement Progress</h2>
                <p className="text-yellow-100">Keep up the great work!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{unlockedCount} / {totalCount}</p>
              <p className="text-sm text-yellow-100">unlocked</p>
            </div>
          </div>
          <div className="w-full bg-yellow-200 h-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-sm text-yellow-100 mt-2">{completionPercentage}% complete</p>
        </div>
      </header>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allAchievements.map((achievement) => {
          const unlocked = isUnlocked(achievement);
          const userAchievement = userAchievements.find(ua => ua.id === achievement.id);

          return (
            <div
              key={achievement.id}
              className={`p-6 rounded-2xl border-2 shadow-sm hover:shadow-md transition ${
                unlocked
                  ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50'
                  : 'border-slate-200 bg-slate-50 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${unlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-200 text-slate-400'}`}>
                  {unlocked ? getAchievementIcon(achievement.icon) : <Lock className="h-6 w-6" />}
                </div>
                {unlocked && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs font-medium">Unlocked</span>
                  </div>
                )}
              </div>

              <h3 className={`font-semibold mb-2 ${unlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                {achievement.title}
              </h3>

              <p className={`text-sm mb-3 ${unlocked ? 'text-slate-600' : 'text-slate-400'}`}>
                {achievement.description}
              </p>

              {unlocked && userAchievement?.unlockedAt && (
                <p className="text-xs text-slate-500">
                  Unlocked on {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                </p>
              )}

              {!unlocked && (
                <div className="flex items-center gap-1 text-slate-400">
                  <Lock className="h-3 w-3" />
                  <span className="text-xs">Locked</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allAchievements.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-slate-300" />
          </div>
          <p className="text-slate-500">No achievements available yet.</p>
          <p className="text-sm text-slate-400 mt-1">Check back later for new challenges!</p>
        </div>
      )}
    </div>
  );
};

export default Achievements;