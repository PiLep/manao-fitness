import { useState, useEffect } from 'react';
import { workouts, type Workout, type Exercise } from '@/lib/workouts';
import { applyDifficultyToWorkout, type DifficultyLevel } from '@/lib/difficultySystem';
import { useTimer } from '@/hooks/use-timer';
import { useWakeLock } from '@/hooks/use-wake-lock';
import { TimerDisplay } from './timer-display';
import { ArrowLeft, Play, Pause, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

interface WorkoutSessionProps {
  workoutId: string;
  onComplete: (stats: WorkoutStats) => void;
  onBack: () => void;
}

export interface WorkoutStats {
  totalTime: number;
  exercisesCompleted: number;
  roundsCompleted: number;
  caloriesEstimate: number;
}

type SessionState = 'ready' | 'exercise' | 'rest' | 'round-rest';

export function WorkoutSession({ workoutId, onComplete, onBack }: WorkoutSessionProps) {
  const baseWorkout = workouts.find(w => w.id === workoutId);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [sessionState, setSessionState] = useState<SessionState>('ready');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [exercisesCompleted, setExercisesCompleted] = useState(0);
  const [resumingWorkout, setResumingWorkout] = useState(false);
  
  const queryClient = useQueryClient();

  // Get user preferences to apply difficulty level
  const { data: userPreferences } = useQuery({
    queryKey: ['/api/user-preferences'],
  });

  // Check for existing workout progress on mount
  const { data: existingProgress } = useQuery({
    queryKey: ['/api/workout-progress'],
  });

  if (!baseWorkout) {
    return <div>Workout not found</div>;
  }

  // Apply difficulty modifications to the workout
  const difficultyLevel: DifficultyLevel = userPreferences?.difficultyLevel || 'beginner';
  const workout = applyDifficultyToWorkout(baseWorkout, difficultyLevel);

  const currentExercise = workout.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;
  const isLastRound = currentRound === workout.rounds;

  const getTimerDuration = () => {
    switch (sessionState) {
      case 'exercise':
        return currentExercise.duration || 30; // Default 30s for rep-based exercises
      case 'rest':
        return workout.restBetweenExercises;
      case 'round-rest':
        return workout.restBetweenRounds;
      default:
        return 0;
    }
  };

  const timer = useTimer(getTimerDuration(), () => {
    handleTimerComplete();
  });

  // Maintient l'écran allumé pendant l'entraînement
  const isWorkoutActive = sessionState !== 'ready';
  useWakeLock(isWorkoutActive);

  // Load existing progress on component mount
  useEffect(() => {
    if (existingProgress && existingProgress.workoutId === workoutId && !resumingWorkout) {
      setResumingWorkout(true);
      setCurrentRound(existingProgress.currentRound);
      setCurrentExerciseIndex(existingProgress.currentExerciseIndex);
      setExercisesCompleted(existingProgress.exercisesCompleted);
      setSessionState(existingProgress.sessionState as SessionState);
      setStartTime(new Date(existingProgress.startTime).getTime());
      
      // Resume timer if needed
      if (existingProgress.sessionState !== 'ready' && existingProgress.timeRemaining > 0) {
        timer.start(existingProgress.timeRemaining);
      }
    }
  }, [existingProgress, workoutId, resumingWorkout]);

  // Mutations pour sauvegarder/supprimer le progrès
  const saveProgressMutation = useMutation({
    mutationFn: async (progressData: any) => {
      await apiRequest('POST', '/api/workout-progress', progressData);
    },
  });

  const deleteProgressMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', '/api/workout-progress');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workout-progress'] });
    },
  });

  const handleTimerComplete = () => {
    switch (sessionState) {
      case 'exercise':
        const newExercisesCompleted = exercisesCompleted + 1;
        setExercisesCompleted(newExercisesCompleted);
        
        if (isLastExercise && isLastRound) {
          handleWorkoutComplete();
        } else if (isLastExercise) {
          setSessionState('round-rest');
          timer.start(workout.restBetweenRounds);
          // Save progress
          saveProgressMutation.mutate({
            workoutId,
            currentRound,
            currentExerciseIndex,
            exercisesCompleted: newExercisesCompleted,
            sessionState: 'round-rest',
            startTime: new Date(startTime),
            timeRemaining: workout.restBetweenRounds,
            isPaused: false,
          });
        } else {
          setSessionState('rest');
          timer.start(workout.restBetweenExercises);
          // Save progress
          saveProgressMutation.mutate({
            workoutId,
            currentRound,
            currentExerciseIndex,
            exercisesCompleted: newExercisesCompleted,
            sessionState: 'rest',
            startTime: startTime,
            timeRemaining: workout.restBetweenExercises,
            isPaused: false,
          });
        }
        break;
      case 'rest':
        setCurrentExerciseIndex(prev => prev + 1);
        setSessionState('ready');
        break;
      case 'round-rest':
        setCurrentRound(prev => prev + 1);
        setCurrentExerciseIndex(0);
        setSessionState('ready');
        break;
    }
  };

  const handleStartExercise = () => {
    setSessionState('exercise');
    timer.start(getTimerDuration());
    
    // Save progress when starting exercise
    saveProgressMutation.mutate({
      workoutId,
      currentRound,
      currentExerciseIndex,
      exercisesCompleted,
      sessionState: 'exercise',
      startTime: startTime,
      timeRemaining: getTimerDuration(),
      isPaused: false,
    });
  };

  // Auto-start timer for timed exercises when state changes
  useEffect(() => {
    if (sessionState === 'exercise' && currentExercise.duration > 0) {
      timer.start(currentExercise.duration);
    }
  }, [sessionState, currentExercise.duration]);

  const handleWorkoutComplete = async () => {
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const stats: WorkoutStats = {
      totalTime,
      exercisesCompleted,
      roundsCompleted: currentRound,
      caloriesEstimate: Math.floor(totalTime / 60 * 8) // Rough estimate: 8 cal/min
    };

    // Save workout session to database
    try {
      const response = await fetch("/api/workout-sessions", {
        method: "POST",
        body: JSON.stringify({
          workoutId: workout.id,
          workoutTitle: workout.title,
          totalTime: stats.totalTime,
          exercisesCompleted: stats.exercisesCompleted,
          roundsCompleted: stats.roundsCompleted,
          caloriesEstimate: stats.caloriesEstimate,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to save workout session');
      }
    } catch (error) {
      console.error("Failed to save workout session:", error);
    }

    // Clear progress when workout is completed
    deleteProgressMutation.mutate();

    onComplete(stats);
  };

  const getNextExerciseInfo = () => {
    if (sessionState === 'round-rest') {
      return {
        name: workout.exercises[0].name,
        duration: workout.exercises[0].reps
      };
    }
    
    const nextIndex = currentExerciseIndex + 1;
    if (nextIndex < workout.exercises.length) {
      return {
        name: workout.exercises[nextIndex].name,
        duration: workout.exercises[nextIndex].reps
      };
    } else if (!isLastRound) {
      return {
        name: 'Repos entre tours',
        duration: `${workout.restBetweenRounds}s`
      };
    } else {
      return {
        name: 'Fin de séance',
        duration: '🎉'
      };
    }
  };

  const getProgressPercentage = () => {
    const totalExercises = workout.exercises.length * workout.rounds;
    const completedExercises = (currentRound - 1) * workout.exercises.length + currentExerciseIndex;
    return (completedExercises / totalExercises) * 100;
  };

  const getTimerLabel = () => {
    switch (sessionState) {
      case 'exercise':
        return 'Exercice';
      case 'rest':
        return 'Repos';
      case 'round-rest':
        return 'Repos entre tours';
      default:
        return '';
    }
  };

  const nextExercise = getNextExerciseInfo();

  return (
    <div className="max-w-md mx-auto h-screen">
      {/* Fixed Session Header */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-primary to-secondary text-white px-4 py-4 z-20" style={{ maxWidth: '448px', margin: '0 auto' }}>
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={onBack}
            className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <h2 className="text-base font-bold">{workout.title}</h2>
            <p className="text-xs text-white/80">
              Niveau: {difficultyLevel === 'beginner' ? 'Débutant' : difficultyLevel === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
            </p>
          </div>
          <div className="w-8 h-8" /> {/* Spacer */}
        </div>
        
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span>Progression</span>
            <span>{currentExerciseIndex + 1}/{workout.exercises.length} exercices</span>
          </div>
          <div className="bg-white/20 rounded-full h-1.5">
            <div 
              className="bg-white rounded-full h-1.5 transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Round Counter */}
        <div className="text-center">
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
            Tour {currentRound}/{workout.rounds}
          </span>
        </div>
      </div>

      {/* Scrollable Exercise Content */}
      <div 
        className="absolute inset-0 bg-white px-4 py-6 overflow-y-auto" 
        style={{ 
          top: '160px', 
          bottom: '90px',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          WebkitScrollbar: { display: 'none' }
        }}
      >
        {/* Timer Section - Only for timed exercises and rest periods */}
        {(sessionState === 'rest' || sessionState === 'round-rest' || 
          (sessionState === 'exercise' && currentExercise.duration > 0)) && (
          <div className="border-b border-gray-200 pb-6 mb-6 pt-4">
            <TimerDisplay
              timeRemaining={timer.timeRemaining}
              progress={timer.progress}
              label={getTimerLabel()}
              onPause={timer.pause}
              onSkip={timer.skip}
              isPaused={timer.isPaused}
            />
          </div>
        )}

        {/* Rep Display */}
        {(sessionState === 'ready' || sessionState === 'exercise') && currentExercise.duration === 0 && (
          <div className="border-b border-gray-200 pb-6 mb-6 pt-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">{currentExercise.reps.split(' ')[0]}</span>
              </div>
              <p className="text-lg font-semibold text-gray-700 mb-2">Effectuez les répétitions</p>
              <p className="text-sm text-gray-500">Prenez votre temps pour bien exécuter chaque mouvement</p>
              

            </div>
          </div>
        )}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentExercise.name}</h3>
          <p className="text-lg text-primary font-semibold">{currentExercise.reps}</p>
        </div>

        {/* Exercise Instructions */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Instructions</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {currentExercise.instructions}
          </p>
        </div>

        {/* Next Exercise Preview */}
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Suivant</p>
              <p className="font-semibold text-gray-900">{nextExercise.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Durée</p>
              <p className="font-semibold text-gray-700">{nextExercise.duration}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Action Bar - Always visible */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pt-4 pb-3 z-20" style={{ maxWidth: '448px', margin: '0 auto' }}>
        <div className="flex gap-3">
          {sessionState === 'ready' && currentExercise.duration > 0 && (
            <>
              <button 
                onClick={handleStartExercise}
                className="flex-1 bg-primary text-white rounded-lg py-3 font-semibold hover:bg-primary/90 transition-colors"
              >
                Commencer
              </button>
              <button 
                onClick={handleWorkoutComplete}
                className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}

          {sessionState === 'ready' && currentExercise.duration === 0 && (
            <>
              <button 
                onClick={handleStartExercise}
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg py-3 font-semibold hover:from-teal-600 hover:to-cyan-700 transition-colors"
              >
                Prêt !
              </button>
              <button 
                onClick={handleWorkoutComplete}
                className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 hover:bg-teal-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
          
          {(sessionState === 'rest' || sessionState === 'round-rest') && (
            <>
              <button 
                onClick={() => timer.pause()}
                className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 hover:bg-teal-200 transition-colors"
              >
                {timer.isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => timer.skip()}
                className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg py-3 font-semibold hover:from-pink-600 hover:to-orange-600 transition-colors"
              >
                Passer le repos
              </button>
              <button 
                onClick={handleWorkoutComplete}
                className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 hover:bg-teal-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}

          {sessionState === 'exercise' && currentExercise.duration > 0 && (
            <>
              <button 
                onClick={() => timer.pause()}
                className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 hover:bg-teal-200 transition-colors"
              >
                {timer.isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => timer.skip()}
                className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg py-3 font-semibold hover:from-pink-600 hover:to-orange-600 transition-colors"
              >
                Passer
              </button>
              <button 
                onClick={handleWorkoutComplete}
                className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 hover:bg-teal-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}

          {sessionState === 'exercise' && currentExercise.duration === 0 && (
            <>
              <button 
                onClick={() => timer.skip()}
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg py-3 font-semibold hover:from-teal-600 hover:to-cyan-700 transition-colors"
              >
                Terminé
              </button>
              <button 
                onClick={handleWorkoutComplete}
                className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 hover:bg-teal-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
