import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  SegmentedButtons,
  Chip,
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

export default function AddIncidentScreen({ navigation }) {
  const { addIncident } = useContext(IncidentContext);
  
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

  const generateIncidentId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INC-${year}${month}-${random}`;
  };

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

    const newIncident = {
      incidentId: generateIncidentId(),
      title: title.trim(),
      description: description.trim(),
      severity,
      status,
      incidentType,
      affectedSystem,
      assignedTo: assignedTo.trim(),
      notes: notes.trim(),
      progress: 0,
      timeline: [
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          action: 'Incident Created',
          description: `Incident created with ${severity} severity`,
          user: assignedTo.trim() || 'System',
        }
      ],
    };

    addIncident(newIncident);
    Alert.alert('Success', 'Incident added successfully', [
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
          value={generateIncidentId()}
          mode="outlined"
          style={styles.input}
          disabled
          right={<TextInput.Icon icon="information" />}
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
            Add Incident
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
