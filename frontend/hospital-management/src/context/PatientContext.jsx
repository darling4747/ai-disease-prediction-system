import React, { createContext, useContext, useState, useCallback } from 'react';

const PatientContext = createContext(undefined);

export const PatientProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const mockPatients = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          predictions: [],
          lastVisit: '2024-01-15'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          predictions: [],
          lastVisit: '2024-01-10'
        }
      ];
      setPatients(mockPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPatient = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const patient = patients.find(p => p.id === id) || null;
      setCurrentPatient(patient);
    } catch (error) {
      console.error('Error fetching patient:', error);
    } finally {
      setIsLoading(false);
    }
  }, [patients]);

  const addPrediction = useCallback(async (prediction) => {
    setIsLoading(true);
    try {
      const newPrediction = {
        ...prediction,
        id: Date.now().toString()
      };
      console.log('Adding prediction:', newPrediction);
    } catch (error) {
      console.error('Error adding prediction:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPredictions = useCallback(async (patientId) => {
    setIsLoading(true);
    try {
      console.log('Fetching predictions for patient:', patientId);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <PatientContext.Provider
      value={{
        patients,
        currentPatient,
        isLoading,
        fetchPatients,
        fetchPatient,
        addPrediction,
        fetchPredictions
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};

export default PatientContext;
