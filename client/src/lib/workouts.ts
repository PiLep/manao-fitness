export interface Exercise {
  name: string;
  reps: string;
  duration: number; // 0 for rep-based exercises
  instructions: string;
}

export interface Workout {
  id: string;
  title: string;
  emoji: string;
  description: string;
  duration: string;
  rounds: number;
  restBetweenExercises: number;
  restBetweenRounds: number;
  exercises: Exercise[];
  color: 'orange' | 'blue' | 'teal';
}

export const workouts: Workout[] = [
  {
    id: 'fullbody',
    title: 'Full Body',
    emoji: '🏋️‍♂️',
    description: 'Renforcement complet du corps',
    duration: '30-40 min',
    rounds: 3,
    restBetweenExercises: 30,
    restBetweenRounds: 60,
    color: 'orange',
    exercises: [
      {
        name: 'Squats',
        reps: '20 répétitions',
        duration: 0,
        instructions: 'Descendez en fléchissant les genoux, gardez le dos droit. Remontez en poussant sur les talons.'
      },
      {
        name: 'Pompes',
        reps: '15 répétitions (genoux si besoin)',
        duration: 0,
        instructions: 'Gardez le corps aligné, descendez jusqu\'à effleurer le sol, remontez en poussant.'
      },
      {
        name: 'Fentes',
        reps: '20 fentes (10 de chaque côté)',
        duration: 0,
        instructions: 'Faites un grand pas en avant, descendez le genou arrière vers le sol.'
      },
      {
        name: 'Planche',
        reps: '30 secondes',
        duration: 30,
        instructions: 'Maintenez le corps droit en appui sur les avant-bras et les orteils.'
      },
      {
        name: 'Jumping Jacks',
        reps: '20 répétitions',
        duration: 0,
        instructions: 'Sautez en écartant bras et jambes simultanément.'
      }
    ]
  },
  {
    id: 'core',
    title: 'Core & Gainage',
    emoji: '💪',
    description: 'Renforcement du tronc',
    duration: '25-35 min',
    rounds: 4,
    restBetweenExercises: 15,
    restBetweenRounds: 60,
    color: 'blue',
    exercises: [
      {
        name: 'Planche classique',
        reps: '30 secondes',
        duration: 30,
        instructions: 'Maintenez la position en appui sur les avant-bras.'
      },
      {
        name: 'Planche latérale droite',
        reps: '30 secondes',
        duration: 30,
        instructions: 'Allongé sur le côté, maintenez le corps droit en appui sur un avant-bras.'
      },
      {
        name: 'Planche latérale gauche',
        reps: '30 secondes',
        duration: 30,
        instructions: 'Changez de côté et maintenez la position.'
      },
      {
        name: 'Crunchs',
        reps: '15 répétitions',
        duration: 0,
        instructions: 'Allongé sur le dos, contractez les abdominaux pour décoller les épaules.'
      },
      {
        name: 'Bicycle Crunches',
        reps: '20 répétitions',
        duration: 0,
        instructions: 'Alternez genou-coude opposé en pédalant.'
      },
      {
        name: 'Mountain Climbers',
        reps: '20 répétitions',
        duration: 0,
        instructions: 'En position de planche, ramenez alternativement les genoux vers la poitrine.'
      },
      {
        name: 'Relevés de jambes',
        reps: '15 répétitions',
        duration: 0,
        instructions: 'Allongé sur le dos, levez les jambes tendues vers le plafond.'
      }
    ]
  },
  {
    id: 'hiit',
    title: 'HIIT',
    emoji: '⚡',
    description: 'Haute intensité',
    duration: '20-30 min',
    rounds: 4,
    restBetweenExercises: 15,
    restBetweenRounds: 60,
    color: 'teal',
    exercises: [
      {
        name: 'Burpees',
        reps: '30 secondes',
        duration: 30,
        instructions: 'Enchaînez squat, planche, pompe, saut avec les bras en l\'air.'
      },
      {
        name: 'Air Squats',
        reps: '30 secondes',
        duration: 30,
        instructions: 'Squats rapides sans charge, gardez le rythme élevé.'
      },
      {
        name: 'Pompes',
        reps: '30 secondes',
        duration: 30,
        instructions: 'Enchaînez les pompes à un rythme soutenu.'
      },
      {
        name: 'Montées de genoux',
        reps: '30 secondes',
        duration: 30,
        instructions: 'Courez sur place en montant les genoux le plus haut possible.'
      },
      {
        name: 'Jumping Lunges',
        reps: '30 secondes',
        duration: 30,
        instructions: 'Fentes avec saut pour changer de jambe.'
      },
      {
        name: 'Gainage dynamique',
        reps: '30 secondes',
        duration: 30,
        instructions: 'En planche, touchez alternativement vos épaules avec les mains.'
      }
    ]
  }
];
