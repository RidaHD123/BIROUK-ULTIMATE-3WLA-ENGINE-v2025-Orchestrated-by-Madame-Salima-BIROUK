
export enum Language {
  Arabic = 'ar',
  French = 'fr',
  English = 'en',
  Spanish = 'es',
  German = 'de',
  Norwegian = 'no'
}

export enum Discipline {
  Civil = 'Civil',
  Structural = 'Structural',
  Piping = 'Piping',
  Electrical = 'Electrical',
  Instrumentation = 'Instrumentation',
  HSE = 'HSE',
  Logistics = 'Logistics'
}

export enum Status {
  Planned = 'Planned',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Delayed = 'Delayed',
  Cancelled = 'Cancelled'
}

export enum RiskLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export interface Task {
  id: string;
  wbs: string;
  description: string;
  discipline: Discipline;
  startDate: string;
  endDate: string;
  status: Status;
  progress: number; // 0-100
  manpower: number;
  equipment: string[];
  materialsStatus: number; // 0-100 (MRI)
  hseRisks: string[];
  jhaStatus: boolean; // Job Hazard Analysis
  ptwStatus: boolean; // Permit to Work
  riskLevel: RiskLevel;
  delayCause?: string;
  responsible: string;
  comments?: string; // Daily report notes
}

export interface WeekData {
  offset: number; // -3 to +2
  label: string;
  tasks: Task[];
}

export interface ProjectStats {
  cpi: number; // Cost Performance Index
  spi: number; // Schedule Performance Index
  totalManhours: number;
  safetyIncidents: number;
  materialAvailability: number;
}
