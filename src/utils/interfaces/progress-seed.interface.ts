export interface ProgressSeedData {
  userEmail: string;
  recordDate: string; // YYYY-MM-DD

  weightKg?: number;
  bodyFatPercentage?: number;
  muscleMassKg?: number;
  waistCm?: number;
  hipCm?: number;
  chestCm?: number;

  energyLevel?: string;
  adherenceLevel?: string;

  professionalNotes?: string;
  userNotes?: string;
}
