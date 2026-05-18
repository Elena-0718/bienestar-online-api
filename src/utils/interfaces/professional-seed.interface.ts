import { ProfessionalType } from '../../entities/professional.entity';

export interface ProfessionalSeedData {
  userEmail: string; // Relación por email
  type: ProfessionalType;
  professionalTitle: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  bio?: string;
  photoUrl?: string;
}