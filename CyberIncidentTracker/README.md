# CyberIncident Tracker

A comprehensive mobile application for tracking and managing cybersecurity incidents with real-time status updates and progress monitoring.

## Features

### 📊 Incident Management
- **Create Incidents**: Add new security incidents with detailed information
- **Track Status**: Monitor incident lifecycle from New → Investigating → Contained → Resolved → Closed
- **Severity Levels**: Classify incidents by severity (Critical, High, Medium, Low)
- **Progress Tracking**: Visual progress indicators with percentage completion

### 🔍 Advanced Features
- **Search & Filter**: Quickly find incidents by title, description, or ID
- **Filter by Status**: View incidents by their current status
- **Real-time Statistics**: Dashboard showing incident counts by status and severity
- **Timeline History**: Complete audit trail of all incident updates

### 📱 User Interface
- **Modern UI**: Built with React Native Paper for a polished, Material Design experience
- **Intuitive Navigation**: Easy-to-use navigation between screens
- **Visual Indicators**: Color-coded chips for quick status and severity identification
- **Responsive Design**: Works seamlessly on iOS and Android devices

### 💾 Data Management
- **Local Storage**: All data persisted locally using AsyncStorage
- **Auto-save**: Incidents automatically saved as you work
- **Edit & Delete**: Full CRUD operations for incident management

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Simplified React Native development and deployment
- **React Navigation**: Screen navigation and routing
- **React Native Paper**: Material Design UI components
- **AsyncStorage**: Local data persistence

## Installation

### Prerequisites
- Node.js (v14 or newer)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Setup

1. Install dependencies:
```bash
cd CyberIncidentTracker
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
   - **iOS**: Press `i` in the terminal or scan QR code with Camera app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

## Usage

### Adding an Incident
1. Tap the `+` button on the main screen
2. Fill in the required fields:
   - Incident Title
   - Description
   - Severity Level
   - Incident Type
   - Affected System (optional)
   - Assigned To (optional)
3. Tap "Add Incident"

### Viewing Incident Details
1. Tap any incident card from the main list
2. View complete details including:
   - Current status and progress
   - Timeline of all updates
   - System information
   - Assignment details

### Updating Incident Status
1. Open incident details
2. Tap "Update Status" button
3. Select new status and add update notes
4. Confirm to save changes

### Updating Progress
1. Open incident details
2. Tap "Update Progress" button
3. Enter percentage (0-100)
4. Progress bar updates automatically

### Editing an Incident
1. Open incident details
2. Tap the pencil icon in the top right
3. Modify any fields
4. Tap "Save Changes"

### Filtering Incidents
1. Tap "Filters" button on main screen
2. Select status to filter by
3. Clear filter by tapping the X on active filter chip

### Viewing Statistics
1. Tap "Stats" button on main screen
2. View breakdown of incidents by:
   - Total count
   - Status distribution
   - Severity distribution

## Incident Types

The app supports tracking various cybersecurity incident types:
- Malware
- Phishing
- DDoS Attack
- Data Breach
- Ransomware
- Insider Threat
- SQL Injection
- XSS Attack
- Man-in-the-Middle
- Zero-Day Exploit
- Social Engineering
- Unauthorized Access
- Other

## Status Workflow

Incidents typically follow this lifecycle:
1. **New**: Incident just reported
2. **Investigating**: Team is analyzing the incident
3. **Contained**: Threat has been isolated
4. **Resolved**: Issue has been fixed
5. **Closed**: Incident fully documented and closed

## Severity Levels

- **Critical**: Immediate threat requiring urgent attention
- **High**: Serious threat requiring prompt response
- **Medium**: Moderate threat requiring timely action
- **Low**: Minor threat with low immediate impact

## Data Structure

Each incident includes:
- Unique Incident ID (auto-generated)
- Title and Description
- Severity and Status
- Incident Type
- Affected System
- Assigned Personnel
- Progress Percentage
- Creation and Update Timestamps
- Complete Timeline History
- Additional Notes

## Development

### Project Structure
```
CyberIncidentTracker/
├── App.js                          # Main app entry point
├── src/
│   ├── context/
│   │   └── IncidentContext.js      # Global state management
│   ├── screens/
│   │   ├── IncidentListScreen.js   # Main list view
│   │   ├── AddIncidentScreen.js    # Add new incident
│   │   ├── IncidentDetailScreen.js # Incident details
│   │   └── EditIncidentScreen.js   # Edit incident
│   └── utils/
│       └── incidentTypes.js        # Constants and types
├── package.json
├── app.json
└── babel.config.js
```

### Available Scripts

- `npm start`: Start Expo development server
- `npm run android`: Run on Android device/emulator
- `npm run ios`: Run on iOS simulator
- `npm run web`: Run in web browser
- `npm test`: Run tests
- `npm run lint`: Run linter

## Future Enhancements

Potential features for future releases:
- [ ] Cloud sync and backup
- [ ] Team collaboration features
- [ ] Push notifications for critical incidents
- [ ] Attachment support (screenshots, logs)
- [ ] Export reports (PDF, CSV)
- [ ] Advanced analytics dashboard
- [ ] Integration with security tools (SIEM, etc.)
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Role-based access control

## License

MIT License - feel free to use this app for your cybersecurity incident tracking needs.

## Support

For issues or questions, please create an issue in the project repository.

---

Built with ❤️ for cybersecurity professionals
