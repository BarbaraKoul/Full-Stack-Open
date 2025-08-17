export interface Entry {
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