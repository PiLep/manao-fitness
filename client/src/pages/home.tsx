import { useState } from 'react';
import { WorkoutSelection, WorkoutStats } from '@/components/workout-selection';
import { WorkoutSession, type WorkoutStats as WorkoutStatsType } from '@/components/workout-session';
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
  const [workoutStats, setWorkoutStats] = useState<WorkoutStatsType | null>(null);

  // Check for existing workout progress
  const { data: workoutProgress, refetch: refetchProgress } = useQuery({
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

  const handleWorkoutComplete = (stats: WorkoutStatsType) => {
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
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-20" style={{ maxWidth: '448px', margin: '0 auto' }}>
        <div className="px-4 py-4 flex items-center justify-between">
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

      {/* Scrollable Main Content */}
      {appState === 'selection' && (
        <>
          <div 
            className="max-w-md mx-auto overflow-y-auto home-content" 
            style={{ 
              paddingTop: '90px', 
              paddingBottom: '100px',
              height: '100vh',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
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

          {/* Fixed Stats Section at Bottom */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10" style={{ maxWidth: '448px', margin: '0 auto' }}>
            <div className="px-4 py-4">
              <WorkoutStats />
            </div>
          </div>
        </>
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
