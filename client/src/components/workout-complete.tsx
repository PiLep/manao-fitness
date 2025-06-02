import { CheckCircle } from 'lucide-react';

interface WorkoutCompleteProps {
  stats: {
    totalTime: number;
    exercisesCompleted: number;
    roundsCompleted: number;
    caloriesEstimate: number;
  };
  onNewWorkout: () => void;
}

export function WorkoutComplete({ stats, onNewWorkout }: WorkoutCompleteProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center px-4 py-12">
        {/* Success Animation */}
        <div className="w-24 h-24 bg-gradient-to-br from-success to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Bravo !</h2>
        <p className="text-gray-600 mb-8">Tu as terminé ta séance d'entraînement</p>

        {/* Session Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatTime(stats.totalTime)}</div>
              <div className="text-sm text-gray-500">Temps total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{stats.exercisesCompleted}</div>
              <div className="text-sm text-gray-500">Exercices</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{stats.roundsCompleted}</div>
              <div className="text-sm text-gray-500">Tours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: 'hsl(var(--warning))' }}>
                {stats.caloriesEstimate}
              </div>
              <div className="text-sm text-gray-500">Calories est.</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={onNewWorkout}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl py-4 font-semibold text-lg hover:from-teal-600 hover:to-cyan-700 transition-colors"
          >
            Nouvelle séance
          </button>
          <button className="w-full bg-teal-50 text-teal-700 rounded-xl py-3 font-medium hover:bg-teal-100 transition-colors border border-teal-200">
            Partager mes résultats
          </button>
        </div>
      </div>
    </div>
  );
}
