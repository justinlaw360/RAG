export const INCIDENT_TYPES = [
  'Malware',
  'Phishing',
  'DDoS Attack',
  'Data Breach',
  'Ransomware',
  'Insider Threat',
  'SQL Injection',
  'XSS Attack',
  'Man-in-the-Middle',
  'Zero-Day Exploit',
  'Social Engineering',
  'Unauthorized Access',
  'Other',
];

export const SEVERITY_LEVELS = [
  { label: 'Critical', value: 'critical', color: '#d32f2f' },
  { label: 'High', value: 'high', color: '#f57c00' },
  { label: 'Medium', value: 'medium', color: '#fbc02d' },
  { label: 'Low', value: 'low', color: '#388e3c' },
];

export const STATUS_OPTIONS = [
  { label: 'New', value: 'new', color: '#2196f3', icon: 'alert-circle' },
  { label: 'Investigating', value: 'investigating', color: '#ff9800', icon: 'magnify' },
  { label: 'Contained', value: 'contained', color: '#9c27b0', icon: 'shield-check' },
  { label: 'Resolved', value: 'resolved', color: '#4caf50', icon: 'check-circle' },
  { label: 'Closed', value: 'closed', color: '#757575', icon: 'close-circle' },
];

export const AFFECTED_SYSTEMS = [
  'Web Server',
  'Database',
  'Email System',
  'Network Infrastructure',
  'Workstation',
  'Mobile Device',
  'Cloud Services',
  'Application Server',
  'IoT Device',
  'Other',
];
