import React, { useContext, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { 
  Text, 
  Card, 
  Chip, 
  FAB, 
  Searchbar, 
  Menu, 
  Button,
  Portal,
  Modal,
  IconButton,
} from 'react-native-paper';
import { IncidentContext } from '../context/IncidentContext';
import { STATUS_OPTIONS, SEVERITY_LEVELS } from '../utils/incidentTypes';

export default function IncidentListScreen({ navigation }) {
  const { incidents, loading, getIncidentStats } = useContext(IncidentContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [menuVisible, setMenuVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  const stats = getIncidentStats();

  const getStatusColor = (status) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    return statusOption ? statusOption.color : '#757575';
  };

  const getSeverityColor = (severity) => {
    const severityLevel = SEVERITY_LEVELS.find(s => s.value === severity);
    return severityLevel ? severityLevel.color : '#757575';
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = 
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.incidentId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const renderIncidentCard = ({ item }) => (
    <Card 
      style={styles.card}
      onPress={() => navigation.navigate('IncidentDetail', { incidentId: item.id })}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="labelSmall" style={styles.incidentId}>
            {item.incidentId}
          </Text>
          <Chip 
            mode="flat"
            style={[styles.severityChip, { backgroundColor: getSeverityColor(item.severity) }]}
            textStyle={styles.chipText}
          >
            {item.severity.toUpperCase()}
          </Chip>
        </View>
        
        <Text variant="titleMedium" style={styles.title}>
          {item.title}
        </Text>
        
        <Text variant="bodySmall" numberOfLines={2} style={styles.description}>
          {item.description}
        </Text>
        
        <View style={styles.footer}>
          <Chip 
            icon={STATUS_OPTIONS.find(s => s.value === item.status)?.icon}
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
            textStyle={styles.chipText}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Chip>
          
          <Text variant="bodySmall" style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search incidents..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <View style={styles.filterContainer}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button 
              mode="outlined" 
              onPress={() => setMenuVisible(true)}
              icon="filter"
            >
              Filters
            </Button>
          }
        >
          <Menu.Item onPress={() => { setFilterStatus('all'); setMenuVisible(false); }} title="All Status" />
          {STATUS_OPTIONS.map(status => (
            <Menu.Item 
              key={status.value}
              onPress={() => { setFilterStatus(status.value); setMenuVisible(false); }} 
              title={status.label} 
            />
          ))}
        </Menu>
        
        <Button 
          mode="outlined" 
          onPress={() => setStatsVisible(true)}
          icon="chart-bar"
          style={styles.statsButton}
        >
          Stats
        </Button>
      </View>

      {filterStatus !== 'all' && (
        <Chip 
          onClose={() => setFilterStatus('all')}
          style={styles.activeFilter}
        >
          Status: {filterStatus}
        </Chip>
      )}

      <FlatList
        data={filteredIncidents}
        renderItem={renderIncidentCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium">No incidents found</Text>
            <Text variant="bodySmall">Tap the + button to add a new incident</Text>
          </View>
        }
      />

      <Portal>
        <Modal 
          visible={statsVisible} 
          onDismiss={() => setStatsVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text variant="headlineSmall">Incident Statistics</Text>
            <IconButton icon="close" onPress={() => setStatsVisible(false)} />
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text variant="displaySmall">{stats.total}</Text>
              <Text variant="bodyMedium">Total Incidents</Text>
            </View>
          </View>

          <Text variant="titleMedium" style={styles.statsSection}>By Status</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text variant="headlineMedium">{stats.new}</Text>
              <Text variant="bodySmall">New</Text>
            </View>
            <View style={styles.statCard}>
              <Text variant="headlineMedium">{stats.investigating}</Text>
              <Text variant="bodySmall">Investigating</Text>
            </View>
            <View style={styles.statCard}>
              <Text variant="headlineMedium">{stats.contained}</Text>
              <Text variant="bodySmall">Contained</Text>
            </View>
            <View style={styles.statCard}>
              <Text variant="headlineMedium">{stats.resolved}</Text>
              <Text variant="bodySmall">Resolved</Text>
            </View>
          </View>

          <Text variant="titleMedium" style={styles.statsSection}>By Severity</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: '#ffebee' }]}>
              <Text variant="headlineMedium">{stats.critical}</Text>
              <Text variant="bodySmall">Critical</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#fff3e0' }]}>
              <Text variant="headlineMedium">{stats.high}</Text>
              <Text variant="bodySmall">High</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#fffde7' }]}>
              <Text variant="headlineMedium">{stats.medium}</Text>
              <Text variant="bodySmall">Medium</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#e8f5e9' }]}>
              <Text variant="headlineMedium">{stats.low}</Text>
              <Text variant="bodySmall">Low</Text>
            </View>
          </View>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddIncident')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  statsButton: {
    marginLeft: 8,
  },
  activeFilter: {
    marginHorizontal: 16,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  incidentId: {
    color: '#666',
  },
  severityChip: {
    height: 24,
  },
  chipText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusChip: {
    height: 28,
  },
  date: {
    color: '#999',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  statsSection: {
    marginTop: 8,
    marginBottom: 12,
    fontWeight: 'bold',
  },
});
