import { type Workout } from './workouts';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface DifficultyModifiers {
  exerciseDurationMultiplier: number;
  exerciseRestMultiplier: number;
  roundRestMultiplier: number;
  repsMultiplier: number;
}

export const DIFFICULTY_SETTINGS: Record<DifficultyLevel, DifficultyModifiers> = {
  beginner: {
    exerciseDurationMultiplier: 0.7,  // -30% durée exercices
    exerciseRestMultiplier: 0.8,      // -20% repos entre exercices (réduit)
    roundRestMultiplier: 1.0,         // repos normal entre tours
    repsMultiplier: 0.8,              // -20% répétitions
  },
  intermediate: {
    exerciseDurationMultiplier: 1.0,  // durée normale
    exerciseRestMultiplier: 0.6,      // -40% repos entre exercices (réduit)
    roundRestMultiplier: 0.8,         // -20% repos entre tours (réduit)
    repsMultiplier: 1.0,              // répétitions normales
  },
  advanced: {
    exerciseDurationMultiplier: 1.3,  // +30% durée exercices
    exerciseRestMultiplier: 0.4,      // -60% repos entre exercices (très réduit)
    roundRestMultiplier: 0.6,         // -40% repos entre tours (réduit)
    repsMultiplier: 1.2,              // +20% répétitions
  },
};

export function applyDifficultyToWorkout(
  workout: Workout, 
  difficultyLevel: DifficultyLevel
): Workout {
  const modifiers = DIFFICULTY_SETTINGS[difficultyLevel];
  
  return {
    ...workout,
    restBetweenExercises: Math.round(workout.restBetweenExercises * modifiers.exerciseRestMultiplier),
    restBetweenRounds: Math.round(workout.restBetweenRounds * modifiers.roundRestMultiplier),
    exercises: workout.exercises.map(exercise => ({
      ...exercise,
      duration: exercise.duration > 0 
        ? Math.round(exercise.duration * modifiers.exerciseDurationMultiplier)
        : 0,
      reps: exercise.duration === 0 
        ? adjustReps(exercise.reps, modifiers.repsMultiplier)
        : exercise.reps,
    })),
  };
}

function adjustReps(repsString: string, multiplier: number): string {
  // Extrait le nombre de répétitions du string (ex: "20 répétitions" -> 20)
  const match = repsString.match(/(\d+)/);
  if (!match) return repsString;
  
  const originalReps = parseInt(match[1]);
  const newReps = Math.max(1, Math.round(originalReps * multiplier));
  
  // Gestion spéciale pour les fentes qui ont des répétitions par côté
  if (repsString.includes('fentes') && repsString.includes('de chaque côté')) {
    const repsPerSide = Math.round(newReps / 2);
    return `${newReps} fentes (${repsPerSide} de chaque côté)`;
  }
  
  return repsString.replace(/\d+/, newReps.toString());
}

export function getDifficultyLabel(level: DifficultyLevel): string {
  switch (level) {
    case 'beginner':
      return 'Débutant';
    case 'intermediate':
      return 'Intermédiaire';
    case 'advanced':
      return 'Avancé';
  }
}

export function getDifficultyDescription(level: DifficultyLevel): string {
  switch (level) {
    case 'beginner':
      return 'Temps d\'exercice réduits, pauses courtes, moins de répétitions';
    case 'intermediate':
      return 'Temps d\'exercice standards, pauses très courtes, répétitions standards';
    case 'advanced':
      return 'Temps d\'exercice étendus, pauses minimales, plus de répétitions';
  }
}