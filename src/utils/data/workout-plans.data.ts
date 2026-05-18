import { WeeklyWorkoutPlan } from '../../entities/workout.entity';

/* =========================
   ANDRÉS – GAIN MUSCLE
   Principiante fuerza
========================== */
export const andresWorkoutPlan: WeeklyWorkoutPlan = {
  monday: {
    focus: 'Tren superior (fuerza básica)',
    warmUp: 'Movilidad de hombros + jumping jacks (5 min)',
    exercises: [
      {
        name: 'Flexiones',
        description: 'Flexiones controladas, espalda recta',
        sets: 3,
        reps: 10,
        rest: '90s',
      },
      {
        name: 'Remo con mancuerna',
        sets: 3,
        reps: 12,
        rest: '90s',
      },
    ],
    coolDown: 'Estiramiento de brazos y hombros',
  },

  wednesday: {
    focus: 'Piernas',
    warmUp: 'Caminata ligera (5 min)',
    exercises: [
      {
        name: 'Sentadillas',
        sets: 4,
        reps: 12,
        rest: '90s',
      },
      {
        name: 'Zancadas',
        sets: 3,
        reps: 10,
        rest: '90s',
      },
    ],
  },

  friday: {
    focus: 'Core + estabilidad',
    exercises: [
      {
        name: 'Plancha',
        sets: 3,
        time: '30s',
        rest: '60s',
      },
      {
        name: 'Crunch abdominal',
        sets: 3,
        reps: 15,
        rest: '60s',
      },
    ],
  },
};

/* =========================
   LAURA – HEALTH
   Hábitos y acondicionamiento
========================== */
export const lauraWorkoutPlan: WeeklyWorkoutPlan = {
  monday: {
    focus: 'Cardio suave',
    warmUp: 'Movilidad general (5 min)',
    exercises: [
      {
        name: 'Caminata rápida',
        sets: 1,
        time: '25 min',
        rest: '—',
      },
    ],
  },

  wednesday: {
    focus: 'Tonificación cuerpo completo',
    exercises: [
      {
        name: 'Sentadillas',
        sets: 3,
        reps: 12,
        rest: '60s',
      },
      {
        name: 'Flexiones apoyadas',
        sets: 3,
        reps: 8,
        rest: '60s',
      },
    ],
  },

  friday: {
    focus: 'Movilidad y core',
    exercises: [
      {
        name: 'Plancha',
        sets: 3,
        time: '20s',
        rest: '45s',
      },
      {
        name: 'Estiramientos guiados',
        sets: 1,
        time: '10 min',
        rest: '—',
      },
    ],
  },
};
