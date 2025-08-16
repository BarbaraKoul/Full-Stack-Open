import express from 'express';
import patientService from '../services/patientService';
import toNewPatientEntry from '../utils';
import { z } from 'zod';

const router=express.Router();

router.get('/', (_req,res) => {
    res.send(patientService.getPatients())
});

router.get('/:id', (req,res) => {
    const patient= patientService.findById(req.params.id);

    if(patient){
        res.send(patient);
    }
    else{
        res.sendStatus(404);
    }
});

router.post('/', (req,res) => {
    try {
        const newPatientEntry = toNewPatientEntry(req.body);
        const addedPatient=patientService.addPatient(newPatientEntry);
        res.json(addedPatient);
    }catch (error: unknown) {
        if (error instanceof z.ZodError) {
            res.status(400).send({ error: error.issues });
        } else {
            res.status(400).send({ error: 'unknown error' });
        }
    }
});

export default router