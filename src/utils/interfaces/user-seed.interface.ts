import { Sex } from '../../enum/sex.enum';
import { Objective } from '../../enum/objective.enum';
import { Roles } from '../../enum/roles.enum';

export interface UserSeedData {
  fullName: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  sex: Sex;
  objective: Objective;
  weight?: number;
  height?: number;
  observations?: string;
  photoUrl?: string;
  password: string;
  role: string;
}


