import patientData from "../../data/patients";
import { PatientEntry, NewPatientEntry } from "../types";
import { v1 as uuid } from 'uuid';

const patients: PatientEntry[]= patientData as PatientEntry[];

const getPatients = (): PatientEntry[] => {
    return patients.map(({id, name, dateOfBirth, gender, occupation}) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation
    }));
};

const findById = (id: string): PatientEntry | undefined => {
  const entry = patientData.find(d => d.id === id);
  return entry;
};

const addPatient = (entry: NewPatientEntry): PatientEntry => {

  const newPatientEntry = {
    id: uuid(),
    ...entry
  };

  patientData.push(newPatientEntry);
  return newPatientEntry;
};

export default { getPatients, findById, addPatient };