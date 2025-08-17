export interface BaseEntry {
  id: string;
  date: string;
  type: string;
  specialist: string;
  diagnosisCodes?: Array<DiagnoseEntry['code']>;
  description: string;
}


export interface DiagnoseEntry {
    code: string
    name: string
    latin?: string
}

export interface PatientEntry {
    id: string
    name: string
    dateOfBirth: string
    ssn?: string
    gender: string
    occupation: string
    entries?: Entry[]
}

export type NewPatientEntry = Omit<PatientEntry, 'id'>;

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}


export type NonSensitivePatient = Omit<PatientEntry, 'ssn' | 'entries'>

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

export interface Discharge {
  date: string
  criteria: string
}

interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
}

interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: Discharge;
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;