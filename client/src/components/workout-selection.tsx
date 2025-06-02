import { workouts } from '@/lib/workouts';
import { Clock, RotateCcw, Play } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface WorkoutSelectionProps {
  onSelectWorkout: (workoutId: string) => void;
}

export function WorkoutSelection({ onSelectWorkout }: WorkoutSelectionProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'orange':
        return {
          badge: 'bg-orange-50 text-orange-600',
          icon: 'bg-primary/10 text-primary'
        };
      case 'blue':
        return {
          badge: 'bg-blue-50 text-blue-600',
          icon: 'bg-secondary/10 text-secondary'
        };
      case 'teal':
        return {
          badge: 'bg-teal-50 text-teal-600',
          icon: 'bg-accent/10 text-accent'
        };
      default:
        return {
          badge: 'bg-gray-50 text-gray-600',
          icon: 'bg-gray-100 text-gray-600'
        };
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Prêt à t'entraîner ?</h2>
        <p className="text-gray-600">Choisis ta séance d'aujourd'hui</p>
      </div>

      {/* Workout Cards */}
      <div className="space-y-4 mb-6">
        {workouts.map((workout) => {
          const colors = getColorClasses(workout.color);
          const exerciseNames = workout.exercises.slice(0, 3).map(ex => ex.name.split(' ')[0]);
          
          return (
            <div
              key={workout.id}
              onClick={() => onSelectWorkout(workout.id)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{workout.emoji}</span>
                    <h3 className="text-lg font-bold text-gray-900">{workout.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{workout.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{workout.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <RotateCcw className="w-3 h-3" />
                      <span>{workout.rounds} tours</span>
                    </span>
                  </div>
                </div>
                <div className={`rounded-xl p-2 ${colors.icon}`}>
                  <Play className="w-4 h-4" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {exerciseNames.map((name, index) => (
                  <span key={index} className={`px-2 py-1 rounded-md text-xs font-medium ${colors.badge}`}>
                    {name}
                  </span>
                ))}
                {workout.exercises.length > 3 && (
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${colors.badge}`}>
                    +{workout.exercises.length - 3}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <WorkoutStats />
    </div>
  );
}

function WorkoutStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/workout-stats'],
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-300">--</div>
            <div className="text-xs text-gray-500">Séances</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-300">--</div>
            <div className="text-xs text-gray-500">Temps total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-300">--</div>
            <div className="text-xs text-gray-500">Cette semaine</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-primary">{stats?.totalSessions || 0}</div>
          <div className="text-xs text-gray-500">Séances</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-secondary">{stats?.totalTime ? formatTime(stats.totalTime) : '0m'}</div>
          <div className="text-xs text-gray-500">Temps total</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-accent">{stats?.thisWeek || 0}</div>
          <div className="text-xs text-gray-500">Cette semaine</div>
        </div>
      </div>
    </div>
  );
}
