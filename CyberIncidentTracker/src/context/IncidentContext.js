import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const IncidentContext = createContext();

export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load incidents from storage
  useEffect(() => {
    loadIncidents();
  }, []);

  // Save incidents to storage whenever they change
  useEffect(() => {
    if (!loading) {
      saveIncidents();
    }
  }, [incidents]);

  const loadIncidents = async () => {
    try {
      const storedIncidents = await AsyncStorage.getItem('incidents');
      if (storedIncidents !== null) {
        setIncidents(JSON.parse(storedIncidents));
      }
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveIncidents = async () => {
    try {
      await AsyncStorage.setItem('incidents', JSON.stringify(incidents));
    } catch (error) {
      console.error('Error saving incidents:', error);
    }
  };

  const addIncident = (incident) => {
    const newIncident = {
      ...incident,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setIncidents([newIncident, ...incidents]);
  };

  const updateIncident = (id, updatedData) => {
    setIncidents(incidents.map(incident => 
      incident.id === id 
        ? { ...incident, ...updatedData, updatedAt: new Date().toISOString() }
        : incident
    ));
  };

  const deleteIncident = (id) => {
    setIncidents(incidents.filter(incident => incident.id !== id));
  };

  const getIncidentById = (id) => {
    return incidents.find(incident => incident.id === id);
  };

  const getIncidentStats = () => {
    const stats = {
      total: incidents.length,
      new: 0,
      investigating: 0,
      contained: 0,
      resolved: 0,
      closed: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    incidents.forEach(incident => {
      // Count by status
      const status = incident.status.toLowerCase();
      if (stats[status] !== undefined) {
        stats[status]++;
      }

      // Count by severity
      const severity = incident.severity.toLowerCase();
      if (stats[severity] !== undefined) {
        stats[severity]++;
      }
    });

    return stats;
  };

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        loading,
        addIncident,
        updateIncident,
        deleteIncident,
        getIncidentById,
        getIncidentStats,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};
