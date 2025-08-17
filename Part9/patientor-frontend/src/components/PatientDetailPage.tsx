import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PatientFormValues, Entry } from '../types';
import patientService from '../services/patients';

const PatientDetailPage = () => {
  const [patient, setPatient] = useState<PatientFormValues | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const fetchedPatient = await patientService.getById(id);
        setPatient(fetchedPatient);
      }
    };
    fetchPatient();
  }, [id]);

  const renderEntries = (entries: Entry[]) => {
    return entries.map(entry => (
      <div key={entry.id}>
        <p><strong>Date:</strong> {entry.date}</p>
        <p><strong>Description:</strong> {entry.description}</p>
        <p><strong>Specialist:</strong> {entry.specialist}</p>
      </div>
    ));
  };

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{patient.name}</h2>
      <p>SSN: {patient.ssn}</p>
      <p>Occupation: {patient.occupation}</p>
      <p>Gender: {patient.gender}</p>
      <p>Date of Birth: {patient.dateOfBirth}</p>
      <h3>Entries</h3>
      {patient.entries && patient.entries.length > 0 ? (
        renderEntries(patient.entries)
      ) : (
        <p>No entries found</p>
      )}
    </div>
  );
};

export default PatientDetailPage;