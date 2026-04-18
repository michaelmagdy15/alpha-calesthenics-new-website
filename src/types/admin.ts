export type PackageTier = 'Alpha Elite' | 'Alpha Athlete';

export type ClientStatus = 
  | 'Assessment Pending' 
  | 'Program Building' 
  | 'Active in App' 
  | 'Inactive';

export interface AssessmentData {
  age: number;
  height: string;
  weight: string;
  fitnessGoals: string;
  maxPullups: number;
  maxPushups: number;
  mobilityLimitations: string;
  injuryHistory: string;
}

export interface ProgramDeliverables {
  customRoutineStatus: 'Drafted' | 'Assigned' | 'Not Started';
  nutritionalPlan: 'General Guidelines' | 'Custom Diet Plan' | 'Pending';
  mobilityRoutineStatus: 'Assigned' | 'Not Assigned';
}

export interface Client {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  packageTier: PackageTier;
  status: ClientStatus;
  assessmentData: AssessmentData;
  deliverables: ProgramDeliverables;
  whatsappLink?: string;
  googleDriveLink?: string;
  appCredentialsSent: boolean;
}
