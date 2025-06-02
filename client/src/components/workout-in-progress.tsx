import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, X, Clock, Dumbbell } from 'lucide-react';
import { workouts } from '@/lib/workouts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface WorkoutInProgressProps {
  progress: {
    workoutId: string;
    currentRound: number;
    currentExerciseIndex: number;
    exercisesCompleted: number;
    sessionState: string;
    startTime: string;
  };
  onResumeWorkout: (workoutId: string) => void;
}

export function WorkoutInProgress({ progress, onResumeWorkout }: WorkoutInProgressProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const workout = workouts.find(w => w.id === progress.workoutId);
  
  const deleteProgressMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', '/api/workout-progress');
    },
    onSuccess: () => {
      // Force immediate cache update
      queryClient.setQueryData(['/api/workout-progress'], null);
      queryClient.invalidateQueries({ queryKey: ['/api/workout-progress'] });
      toast({
        title: "Entraînement supprimé",
        description: "Votre progression a été effacée",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'entraînement",
        variant: "destructive",
      });
    },
  });

  if (!workout) {
    return null;
  }

  const currentExercise = workout.exercises[progress.currentExerciseIndex];
  const totalExercises = workout.exercises.length * workout.rounds;
  const progressPercentage = Math.round((progress.exercisesCompleted / totalExercises) * 100);
  
  // Calculer le temps écoulé
  const startTime = typeof progress.startTime === 'number' 
    ? new Date(progress.startTime) 
    : new Date(progress.startTime);
  const timeElapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;

  return (
    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-orange-600" />
            Entraînement en cours
          </CardTitle>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-xs">
            {progressPercentage}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-100">
            {workout.emoji} {workout.title}
          </h3>
          <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
            Tour {progress.currentRound}/{workout.rounds} • {currentExercise?.name || 'Repos'}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-orange-600 dark:text-orange-400">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
          </div>
          <div>
            {progress.exercisesCompleted}/{totalExercises} exercices
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => onResumeWorkout(progress.workoutId)}
            className="flex-1 text-sm py-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white border-none"
            size="sm"
          >
            <Play className="h-3 w-3 mr-1 text-white" />
            Reprendre
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => deleteProgressMutation.mutate()}
            disabled={deleteProgressMutation.isPending}
            className="border-teal-300 text-teal-700 hover:bg-teal-100 dark:border-teal-700 dark:text-teal-300"
            size="sm"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}