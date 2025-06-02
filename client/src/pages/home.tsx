import { useState } from 'react';
import { WorkoutSelection } from '@/components/workout-selection';
import { WorkoutSession, type WorkoutStats } from '@/components/workout-session';
import { WorkoutComplete } from '@/components/workout-complete';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Activity, LogOut, User } from 'lucide-react';

type AppState = 'selection' | 'session' | 'complete';

export default function Home() {
  const { user } = useAuth();
  const [appState, setAppState] = useState<AppState>('selection');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>('');
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats | null>(null);

  const handleSelectWorkout = (workoutId: string) => {
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
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-400 rounded-xl flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FitTimer</h1>
              <p className="text-xs text-gray-500">Entraînement Simple</p>
            </div>
          </div>
          <button className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      {appState === 'selection' && (
        <WorkoutSelection onSelectWorkout={handleSelectWorkout} />
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
    </div>
  );
}
