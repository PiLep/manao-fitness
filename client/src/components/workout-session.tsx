import { useState, useEffect } from 'react';
import { workouts, type Workout, type Exercise } from '@/lib/workouts';
import { useTimer } from '@/hooks/use-timer';
import { TimerDisplay } from './timer-display';
import { ArrowLeft } from 'lucide-react';

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
  const workout = workouts.find(w => w.id === workoutId);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [sessionState, setSessionState] = useState<SessionState>('ready');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [exercisesCompleted, setExercisesCompleted] = useState(0);

  if (!workout) {
    return <div>Workout not found</div>;
  }

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

  const handleTimerComplete = () => {
    switch (sessionState) {
      case 'exercise':
        setExercisesCompleted(prev => prev + 1);
        if (isLastExercise && isLastRound) {
          handleWorkoutComplete();
        } else if (isLastExercise) {
          setSessionState('round-rest');
          timer.start(workout.restBetweenRounds);
        } else {
          setSessionState('rest');
          timer.start(workout.restBetweenExercises);
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
  };

  const handleWorkoutComplete = () => {
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const stats: WorkoutStats = {
      totalTime,
      exercisesCompleted,
      roundsCompleted: currentRound,
      caloriesEstimate: Math.floor(totalTime / 60 * 8) // Rough estimate: 8 cal/min
    };
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
    <div className="max-w-md mx-auto">
      {/* Session Header */}
      <div className="bg-gradient-to-r from-primary to-orange-400 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-bold">{workout.title}</h2>
            <p className="text-sm text-white/80">Séance d'entraînement</p>
          </div>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progression</span>
            <span>{currentExerciseIndex + 1}/{workout.exercises.length} exercices</span>
          </div>
          <div className="bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Round Counter */}
        <div className="text-center">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
            Tour {currentRound}/{workout.rounds}
          </span>
        </div>
      </div>

      {/* Timer Section */}
      {(sessionState === 'exercise' || sessionState === 'rest' || sessionState === 'round-rest') && (
        <div className="bg-white border-b border-gray-200 px-4 py-6">
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

      {/* Current Exercise */}
      <div className="bg-white px-4 py-6">
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

      {/* Action Buttons */}
      <div className="bg-white border-t border-gray-200 px-4 py-6">
        <div className="space-y-3">
          {sessionState === 'ready' && (
            <button 
              onClick={handleStartExercise}
              className="w-full bg-primary text-white rounded-xl py-4 font-semibold text-lg hover:bg-primary/90 transition-colors"
            >
              Je suis prêt(e) !
            </button>
          )}
          
          <button 
            onClick={handleWorkoutComplete}
            className="w-full bg-gray-100 text-gray-700 rounded-xl py-3 font-medium hover:bg-gray-200 transition-colors"
          >
            Terminer la séance
          </button>
        </div>
      </div>
    </div>
  );
}
