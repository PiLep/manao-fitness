import { useState } from 'react';
import { WorkoutSelection } from '@/components/workout-selection';
import { WorkoutSession, type WorkoutStats } from '@/components/workout-session';
import { WorkoutComplete } from '@/components/workout-complete';
import { WorkoutInProgress } from '@/components/workout-in-progress';
import Settings from '@/pages/settings';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Activity, LogOut, User, Settings as SettingsIcon } from 'lucide-react';

type AppState = 'selection' | 'session' | 'complete' | 'settings';

export default function Home() {
  const { user } = useAuth();
  const [appState, setAppState] = useState<AppState>('selection');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>('');
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats | null>(null);

  // Check for existing workout progress
  const { data: workoutProgress } = useQuery({
    queryKey: ['/api/workout-progress'],
  });

  const handleSelectWorkout = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
    setAppState('session');
  };

  const handleResumeWorkout = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
    setAppState('session');
  };

  const handleWorkoutComplete = (stats: WorkoutStats) => {
    setWorkoutStats(stats);
    setAppState('complete');
  };

  const handleBackToSelection = () => {
    setAppState('selection');
    setSelectedWorkoutId('');
    setWorkoutStats(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FitTimer</h1>
              <p className="text-xs text-gray-500">Entraînement Simple</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAppState('settings')}
              className="text-gray-600 hover:text-gray-800"
            >
              <SettingsIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/api/logout'}
              className="text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {appState === 'selection' && (
        <div className="space-y-6">
          {/* Show workout in progress if exists */}
          {workoutProgress && (
            <WorkoutInProgress 
              progress={workoutProgress}
              onResumeWorkout={handleResumeWorkout}
            />
          )}
          
          <WorkoutSelection 
            onSelectWorkout={handleSelectWorkout}
            hasWorkoutInProgress={!!workoutProgress}
          />
        </div>
      )}

      {appState === 'session' && selectedWorkoutId && (
        <WorkoutSession
          workoutId={selectedWorkoutId}
          onComplete={handleWorkoutComplete}
          onBack={handleBackToSelection}
        />
      )}

      {appState === 'complete' && workoutStats && (
        <WorkoutComplete
          stats={workoutStats}
          onNewWorkout={handleBackToSelection}
        />
      )}

      {appState === 'settings' && (
        <Settings onBack={handleBackToSelection} />
      )}
    </div>
  );
}
