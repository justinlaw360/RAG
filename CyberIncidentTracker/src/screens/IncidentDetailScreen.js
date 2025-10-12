import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  Card, 
  Chip, 
  Button, 
  IconButton,
  Divider,
  ProgressBar,
  Portal,
  Modal,
  TextInput,
  List,
} from 'react-native-paper';
import { IncidentContext } from '../context/IncidentContext';
import { STATUS_OPTIONS, SEVERITY_LEVELS } from '../utils/incidentTypes';

export default function IncidentDetailScreen({ route, navigation }) {
  const { incidentId } = route.params;
  const { getIncidentById, updateIncident, deleteIncident } = useContext(IncidentContext);
  const incident = getIncidentById(incidentId);
  
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState(incident?.status || 'new');
  const [updateNote, setUpdateNote] = useState('');
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [newProgress, setNewProgress] = useState(incident?.progress?.toString() || '0');

  if (!incident) {
    return (
      <View style={styles.errorContainer}>
        <Text>Incident not found</Text>
        <Button onPress={() => navigation.goBack()}>Go Back</Button>
      </View>
    );
  }

  const getStatusColor = (status) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    return statusOption ? statusOption.color : '#757575';
  };

  const getSeverityColor = (severity) => {
    const severityLevel = SEVERITY_LEVELS.find(s => s.value === severity);
    return severityLevel ? severityLevel.color : '#757575';
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Incident',
      'Are you sure you want to delete this incident? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteIncident(incidentId);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleStatusUpdate = () => {
    if (!updateNote.trim()) {
      Alert.alert('Error', 'Please add a note for this update');
      return;
    }

    const newTimelineEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'Status Updated',
      description: `Status changed to ${newStatus}. ${updateNote}`,
      user: incident.assignedTo || 'System',
    };

    updateIncident(incidentId, {
      status: newStatus,
      timeline: [...incident.timeline, newTimelineEntry],
    });

    setUpdateModalVisible(false);
    setUpdateNote('');
    Alert.alert('Success', 'Incident status updated');
  };

  const handleProgressUpdate = () => {
    const progress = parseInt(newProgress);
    if (isNaN(progress) || progress < 0 || progress > 100) {
      Alert.alert('Error', 'Progress must be between 0 and 100');
      return;
    }

    const newTimelineEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'Progress Updated',
      description: `Progress set to ${progress}%`,
      user: incident.assignedTo || 'System',
    };

    updateIncident(incidentId, {
      progress,
      timeline: [...incident.timeline, newTimelineEntry],
    });

    setProgressModalVisible(false);
    Alert.alert('Success', 'Progress updated');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text variant="labelSmall" style={styles.incidentId}>
              {incident.incidentId}
            </Text>
            <View style={styles.headerActions}>
              <IconButton 
                icon="pencil" 
                size={20}
                onPress={() => navigation.navigate('EditIncident', { incidentId })}
              />
              <IconButton 
                icon="delete" 
                size={20}
                iconColor="#d32f2f"
                onPress={handleDelete}
              />
            </View>
          </View>

          <Text variant="headlineSmall" style={styles.title}>
            {incident.title}
          </Text>

          <View style={styles.chips}>
            <Chip 
              style={[styles.chip, { backgroundColor: getSeverityColor(incident.severity) }]}
              textStyle={styles.chipText}
            >
              {incident.severity.toUpperCase()}
            </Chip>
            <Chip 
              icon={STATUS_OPTIONS.find(s => s.value === incident.status)?.icon}
              style={[styles.chip, { backgroundColor: getStatusColor(incident.status) }]}
              textStyle={styles.chipText}
            >
              {incident.status.toUpperCase()}
            </Chip>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Progress</Text>
          <View style={styles.progressContainer}>
            <ProgressBar 
              progress={incident.progress / 100} 
              color={getStatusColor(incident.status)}
              style={styles.progressBar}
            />
            <Text variant="bodySmall">{incident.progress}%</Text>
          </View>
          <Button 
            mode="outlined" 
            onPress={() => setProgressModalVisible(true)}
            style={styles.updateButton}
            icon="update"
          >
            Update Progress
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Details</Text>
          
          <View style={styles.detailRow}>
            <Text variant="labelMedium" style={styles.detailLabel}>Type:</Text>
            <Text variant="bodyMedium">{incident.incidentType}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="labelMedium" style={styles.detailLabel}>Affected System:</Text>
            <Text variant="bodyMedium">{incident.affectedSystem || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="labelMedium" style={styles.detailLabel}>Assigned To:</Text>
            <Text variant="bodyMedium">{incident.assignedTo || 'Unassigned'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="labelMedium" style={styles.detailLabel}>Created:</Text>
            <Text variant="bodyMedium">
              {new Date(incident.createdAt).toLocaleString()}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="labelMedium" style={styles.detailLabel}>Last Updated:</Text>
            <Text variant="bodyMedium">
              {new Date(incident.updatedAt).toLocaleString()}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Description</Text>
          <Text variant="bodyMedium" style={styles.description}>
            {incident.description}
          </Text>
        </Card.Content>
      </Card>

      {incident.notes && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Notes</Text>
            <Text variant="bodyMedium" style={styles.description}>
              {incident.notes}
            </Text>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Timeline</Text>
          {incident.timeline?.slice().reverse().map((entry, index) => (
            <View key={entry.id}>
              <View style={styles.timelineEntry}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text variant="labelMedium" style={styles.timelineAction}>
                    {entry.action}
                  </Text>
                  <Text variant="bodySmall" style={styles.timelineDescription}>
                    {entry.description}
                  </Text>
                  <Text variant="bodySmall" style={styles.timelineTime}>
                    {new Date(entry.timestamp).toLocaleString()} - {entry.user}
                  </Text>
                </View>
              </View>
              {index < incident.timeline.length - 1 && <Divider style={styles.timelineDivider} />}
            </View>
          ))}
        </Card.Content>
      </Card>

      <Button 
        mode="contained" 
        onPress={() => setUpdateModalVisible(true)}
        style={styles.mainButton}
        icon="update"
      >
        Update Status
      </Button>

      {/* Status Update Modal */}
      <Portal>
        <Modal 
          visible={updateModalVisible} 
          onDismiss={() => setUpdateModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>Update Status</Text>
          
          <Text variant="labelMedium" style={styles.modalLabel}>New Status</Text>
          {STATUS_OPTIONS.map(option => (
            <List.Item
              key={option.value}
              title={option.label}
              left={props => <List.Icon {...props} icon={option.icon} />}
              right={newStatus === option.value ? props => <List.Icon {...props} icon="check" /> : null}
              onPress={() => setNewStatus(option.value)}
              style={newStatus === option.value ? styles.selectedItem : null}
            />
          ))}

          <TextInput
            label="Update Note *"
            value={updateNote}
            onChangeText={setUpdateNote}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.modalInput}
            placeholder="Describe what has changed..."
          />

          <View style={styles.modalButtons}>
            <Button 
              mode="outlined" 
              onPress={() => setUpdateModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleStatusUpdate}
              style={styles.modalButton}
            >
              Update
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Progress Update Modal */}
      <Portal>
        <Modal 
          visible={progressModalVisible} 
          onDismiss={() => setProgressModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>Update Progress</Text>
          
          <TextInput
            label="Progress (%)"
            value={newProgress}
            onChangeText={setNewProgress}
            mode="outlined"
            keyboardType="numeric"
            style={styles.modalInput}
            placeholder="0-100"
          />

          <View style={styles.modalButtons}>
            <Button 
              mode="outlined" 
              onPress={() => setProgressModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleProgressUpdate}
              style={styles.modalButton}
            >
              Update
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  incidentId: {
    color: '#666',
  },
  headerActions: {
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    height: 28,
  },
  chipText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  updateButton: {
    marginTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 120,
    color: '#666',
  },
  description: {
    lineHeight: 22,
  },
  timelineEntry: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196f3',
    marginTop: 4,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineAction: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timelineDescription: {
    color: '#666',
    marginBottom: 4,
  },
  timelineTime: {
    color: '#999',
    fontSize: 11,
  },
  timelineDivider: {
    marginLeft: 18,
    marginVertical: 4,
  },
  mainButton: {
    margin: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  modalLabel: {
    marginBottom: 8,
  },
  modalInput: {
    marginTop: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
  },
});
