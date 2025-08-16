import { NewPatientEntry, Gender } from "./types";
import { z } from 'zod'

const newEntrySchema = z.object({
    name: z.string(),
    dateOfBirth: z.string().date(),
    ssn: z.string(),
    gender: z.enum(Gender),
    occupation: z.string()
})

const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }
  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
    return newEntrySchema.parse(object);
  }
  throw new Error('Incorrect data: some fields are missing');
};


export default toNewPatientEntry;