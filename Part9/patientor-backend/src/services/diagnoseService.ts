import diagnoseData from '../../data/diagnoses';
import { DiagnoseEntry } from '../types';

const diagnoses: DiagnoseEntry[] = diagnoseData as DiagnoseEntry[];

const getDiagnose = (): DiagnoseEntry[] => {
  return diagnoses;
};


const addDiagnose = () => {
  return null;
};

export default {
  getDiagnose,
  addDiagnose
};