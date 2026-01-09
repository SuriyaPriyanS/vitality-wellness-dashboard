import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/api';
import { UserProfile } from '../types';
import { User, Mail, Ruler, Weight, Target, Camera, Save, Loader2, Edit } from 'lucide-react';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    weight: '',
    height: '',
    dailyStepGoal: '',
    dailyWaterGoal: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userAPI.getProfile();
        setProfile(data);
        setFormData({
          name: data.name,
          email: data.email,
          weight: data.weight?.toString() || '',
          height: data.height?.toString() || '',
          dailyStepGoal: data.dailyStepGoal.toString(),
          dailyWaterGoal: data.dailyWaterGoal.toString()
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedData = {
        name: formData.name,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        dailyStepGoal: parseInt(formData.dailyStepGoal),
        dailyWaterGoal: parseInt(formData.dailyWaterGoal)
      };
      await userAPI.updateProfile(updatedData);
      setProfile(prev => prev ? { ...prev, ...updatedData } : null);
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500">Unable to load profile data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
          <p className="text-slate-500">Manage your personal information and goals.</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold mx-auto">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                {editing && (
                  <button className="absolute bottom-0 right-0 h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
              <p className="text-slate-500">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Weight className="h-4 w-4" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  disabled={!editing}
                  placeholder="70"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  disabled={!editing}
                  placeholder="175"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Daily Step Goal
                </label>
                <input
                  type="number"
                  name="dailyStepGoal"
                  value={formData.dailyStepGoal}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Daily Water Goal (ml)
                </label>
                <input
                  type="number"
                  name="dailyWaterGoal"
                  value={formData.dailyWaterGoal}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
            </div>

            {editing && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;