import patientData from "../../data/patients";
import { PatientEntry } from "../types";

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

export default { getPatients };