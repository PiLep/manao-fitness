export function WorkoutSelection({ onSelectWorkout, hasWorkoutInProgress }) {
  const workouts = [
    {
      id: 'full-body',
      title: 'Full Body',
      emoji: '💪',
      description: 'Entraînement complet du corps',
      duration: '15-20 min',
      rounds: 3,
      color: 'orange'
    },
    {
      id: 'core',
      title: 'Core & Gainage',
      emoji: '🔥',
      description: 'Renforcement du tronc',
      duration: '10-15 min',
      rounds: 4,
      color: 'blue'
    },
    {
      id: 'hiit',
      title: 'HIIT',
      emoji: '⚡',
      description: 'Haute intensité',
      duration: '12-18 min',
      rounds: 5,
      color: 'teal'
    }
  ];

  return (
    <div className="px-4 py-3">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Prêt à t'entraîner ?</h2>
        <p className="text-sm text-gray-600">Choisis ta séance d'aujourd'hui</p>
      </div>

      {hasWorkoutInProgress && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
          <p className="text-xs text-amber-800">
            Entraînement en cours. Terminez-le avant d'en commencer un nouveau.
          </p>
        </div>
      )}

      {!hasWorkoutInProgress && (
        <div className="space-y-3 mb-4">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              onClick={() => onSelectWorkout(workout.id)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{workout.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm">{workout.title}</h3>
                  <p className="text-xs text-gray-600">{workout.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                    <span>{workout.duration}</span>
                    <span>•</span>
                    <span>{workout.rounds} tours</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function WorkoutStats() {
  return (
    <div className="bg-white rounded-xl p-3 border border-gray-100">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-lg font-bold text-primary">1</div>
          <div className="text-xs text-gray-500">Séances</div>
        </div>
        <div>
          <div className="text-lg font-bold text-secondary">53s</div>
          <div className="text-xs text-gray-500">Temps total</div>
        </div>
        <div>
          <div className="text-lg font-bold text-accent">1</div>
          <div className="text-xs text-gray-500">Cette semaine</div>
        </div>
      </div>
    </div>
  );
}