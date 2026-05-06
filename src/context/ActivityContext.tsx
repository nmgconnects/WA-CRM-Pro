import React, { createContext, useContext, useState, useCallback } from 'react';
import { Activity } from '../types';

interface ActivityContextType {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'time'>) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', user: 'Sarah J.', action: 'Moved deal to "Negotiating"', time: '2m ago', icon: 'Zap', color: 'text-brand-600' },
    { id: '2', user: 'AI Bot', action: 'Drafted follow-up for 2 leads', time: '15m ago', icon: 'MessageSquare', color: 'text-indigo-600' },
  ]);

  const addActivity = useCallback((newAct: Omit<Activity, 'id' | 'time'>) => {
    const activity: Activity = {
      ...newAct,
      id: Math.random().toString(36).substr(2, 9),
      time: 'Just now',
    };
    setActivities(prev => [activity, ...prev]);
  }, []);

  return (
    <ActivityContext.Provider value={{ activities, addActivity }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) throw new Error('useActivity must be used within ActivityProvider');
  return context;
};
