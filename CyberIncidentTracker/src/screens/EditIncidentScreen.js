import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  SegmentedButtons,
  Portal,
  Modal,
  List,
} from 'react-native-paper';
import { IncidentContext } from '../context/IncidentContext';
import { 
  INCIDENT_TYPES, 
  SEVERITY_LEVELS, 
  STATUS_OPTIONS,
  AFFECTED_SYSTEMS 
} from '../utils/incidentTypes';

export default function EditIncidentScreen({ route, navigation }) {
  const { incidentId } = route.params;
  const { getIncidentById, updateIncident } = useContext(IncidentContext);
  const incident = getIncidentById(incidentId);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [status, setStatus] = useState('new');
  const [incidentType, setIncidentType] = useState('');
  const [affectedSystem, setAffectedSystem] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [systemModalVisible, setSystemModalVisible] = useState(false);

  useEffect(() => {
    if (incident) {
      setTitle(incident.title);
      setDescription(incident.description);
      setSeverity(incident.severity);
      setStatus(incident.status);
      setIncidentType(incident.incidentType);
      setAffectedSystem(incident.affectedSystem || '');
      setAssignedTo(incident.assignedTo || '');
      setNotes(incident.notes || '');
    }
  }, [incident]);

  if (!incident) {
    return (
      <View style={styles.errorContainer}>
        <Text>Incident not found</Text>
        <Button onPress={() => navigation.goBack()}>Go Back</Button>
      </View>
    );
  }

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an incident title');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter an incident description');
      return;
    }

    if (!incidentType) {
      Alert.alert('Error', 'Please select an incident type');
      return;
    }

    const hasChanges = 
      title !== incident.title ||
      description !== incident.description ||
      severity !== incident.severity ||
      status !== incident.status ||
      incidentType !== incident.incidentType ||
      affectedSystem !== incident.affectedSystem ||
      assignedTo !== incident.assignedTo ||
      notes !== incident.notes;

    if (!hasChanges) {
      Alert.alert('No Changes', 'No changes were made to the incident');
      return;
    }

    const newTimelineEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'Incident Updated',
      description: 'Incident details were modified',
      user: assignedTo.trim() || 'System',
    };

    updateIncident(incidentId, {
      title: title.trim(),
      description: description.trim(),
      severity,
      status,
      incidentType,
      affectedSystem,
      assignedTo: assignedTo.trim(),
      notes: notes.trim(),
      timeline: [...incident.timeline, newTimelineEntry],
    });

    Alert.alert('Success', 'Incident updated successfully', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TextInput
          label="Incident Title *"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
          placeholder="Brief description of the incident"
        />

        <TextInput
          label="Incident ID"
          value={incident.incidentId}
          mode="outlined"
          style={styles.input}
          disabled
        />

        <TextInput
          label="Description *"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          placeholder="Detailed description of the incident"
        />

        <Text variant="titleSmall" style={styles.label}>Severity Level *</Text>
        <SegmentedButtons
          value={severity}
          onValueChange={setSeverity}
          buttons={SEVERITY_LEVELS.map(level => ({
            value: level.value,
            label: level.label,
            style: severity === level.value ? { backgroundColor: level.color } : {},
          }))}
          style={styles.segmentedButtons}
        />

        <Text variant="titleSmall" style={styles.label}>Status</Text>
        <SegmentedButtons
          value={status}
          onValueChange={setStatus}
          buttons={STATUS_OPTIONS.slice(0, 3).map(option => ({
            value: option.value,
            label: option.label,
            icon: option.icon,
          }))}
          style={styles.segmentedButtons}
        />

        <Text variant="titleSmall" style={styles.label}>Incident Type *</Text>
        <Button 
          mode="outlined" 
          onPress={() => setTypeModalVisible(true)}
          icon="chevron-down"
          style={styles.selectButton}
        >
          {incidentType || 'Select Incident Type'}
        </Button>

        <Text variant="titleSmall" style={styles.label}>Affected System</Text>
        <Button 
          mode="outlined" 
          onPress={() => setSystemModalVisible(true)}
          icon="chevron-down"
          style={styles.selectButton}
        >
          {affectedSystem || 'Select Affected System'}
        </Button>

        <TextInput
          label="Assigned To"
          value={assignedTo}
          onChangeText={setAssignedTo}
          mode="outlined"
          style={styles.input}
          placeholder="Name or email of assigned personnel"
        />

        <TextInput
          label="Additional Notes"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          placeholder="Any additional information"
        />

        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={() => navigation.goBack()}
            style={styles.button}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSubmit}
            style={styles.button}
          >
            Save Changes
          </Button>
        </View>
      </View>

      {/* Incident Type Modal */}
      <Portal>
        <Modal 
          visible={typeModalVisible} 
          onDismiss={() => setTypeModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>Select Incident Type</Text>
          <ScrollView>
            {INCIDENT_TYPES.map(type => (
              <List.Item
                key={type}
                title={type}
                onPress={() => {
                  setIncidentType(type);
                  setTypeModalVisible(false);
                }}
                left={props => <List.Icon {...props} icon="shield-alert" />}
                right={incidentType === type ? props => <List.Icon {...props} icon="check" /> : null}
              />
            ))}
          </ScrollView>
        </Modal>
      </Portal>

      {/* Affected System Modal */}
      <Portal>
        <Modal 
          visible={systemModalVisible} 
          onDismiss={() => setSystemModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>Select Affected System</Text>
          <ScrollView>
            {AFFECTED_SYSTEMS.map(system => (
              <List.Item
                key={system}
                title={system}
                onPress={() => {
                  setAffectedSystem(system);
                  setSystemModalVisible(false);
                }}
                left={props => <List.Icon {...props} icon="server" />}
                right={affectedSystem === system ? props => <List.Icon {...props} icon="check" /> : null}
              />
            ))}
          </ScrollView>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    marginTop: 8,
    fontWeight: 'bold',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  selectButton: {
    marginBottom: 16,
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '70%',
  },
  modalTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
});
