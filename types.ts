
export enum GoalStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  weight?: number;
  height?: number;
  dailyStepGoal: number;
  dailyWaterGoal: number;
}

export interface HealthMetric {
  id: string;
  date: string;
  steps: number;
  waterIntake: number; // in ml
  caloriesBurned: number;
  wellnessScore: number;
}

export interface Meal {
  id: string;
  name: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: string;
  imageUrl?: string;
}

export interface Activity {
  id: string;
  type: string;
  duration: number; // in minutes
  caloriesBurned: number;
  intensity: 'Low' | 'Moderate' | 'High';
  timestamp: string;
}

export interface SleepRecord {
  id: string;
  startTime: string;
  endTime: string;
  quality: number; // 1-100
  deepSleepMinutes: number;
}

export interface Goal {
  id: string;
  title: string;
  category: 'Steps' | 'Water' | 'Weight' | 'Sleep' | 'Activity';
  targetValue: number;
  currentValue: number;
  deadline: string;
  status: GoalStatus;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}
