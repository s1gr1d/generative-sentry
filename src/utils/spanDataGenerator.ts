import type { SpanData, TraceData, SpanOperation, ProjectInfo } from '@/types/spanData';

// Helper function to generate random hex string
const generateHex = (length: number): string => {
  return Array.from({ length }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Helper function to generate random trace ID
const generateTraceId = (): string => generateHex(32);

// Helper function to generate random span ID
const generateSpanId = (): string => generateHex(16);

// Helper function to get random element from array
const getRandomElement = <T>(array: T[]): T => 
  array[Math.floor(Math.random() * array.length)];

// Helper function to get weighted random element (for more realistic patterns)
const getWeightedRandomElement = <T>(items: { item: T; weight: number }[]): T => {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item.item;
    }
  }
  return items[items.length - 1].item;
};

// Project definitions for realistic data
const PROJECTS: ProjectInfo[] = [
  {
    name: 'Sentry Dashboard',
    id: 'sentry-dash',
    type: 'frontend',
    technology: ['React', 'TypeScript', 'Three.js']
  },
  {
    name: 'API Gateway',
    id: 'api-gateway',
    type: 'backend',
    technology: ['Node.js', 'Express', 'PostgreSQL']
  },
  {
    name: 'User Service',
    id: 'user-service',
    type: 'backend',
    technology: ['Python', 'FastAPI', 'Redis']
  },
  {
    name: 'Mobile App',
    id: 'mobile-app',
    type: 'mobile',
    technology: ['React Native', 'JavaScript']
  },
  {
    name: 'Analytics Engine',
    id: 'analytics-engine',
    type: 'backend',
    technology: ['Java', 'Spring Boot', 'Kafka']
  },
  {
    name: 'Admin Portal',
    id: 'admin-portal',
    type: 'fullstack',
    technology: ['Vue.js', 'Node.js', 'MongoDB']
  }
];

// Common span operations with realistic descriptions and durations
const SPAN_TEMPLATES: Record<SpanOperation, {
  descriptions: string[];
  avgDuration: number;
  variance: number;
  weight: number;
}> = {
  'http.server': {
    descriptions: [
      'GET /homepage',
      'POST /api/login',
      'GET /api/users',
      'PUT /api/profile',
      'DELETE /api/sessions',
      'GET /dashboard',
      'POST /api/events',
      'GET /api/projects',
      'PATCH /api/settings',
      'GET /health'
    ],
    avgDuration: 150,
    variance: 100,
    weight: 25
  },
  'http.client': {
    descriptions: [
      'GET /api/user-profile',
      'POST /auth/verify-token',
      'GET /api/notifications',
      'PUT /api/preferences',
      'GET /external/weather-api',
      'POST /analytics/track-event',
      'GET /cdn/assets/bundle.js',
      'GET /api/real-time-data',
      'POST /payment/process',
      'GET /search/autocomplete'
    ],
    avgDuration: 250,
    variance: 200,
    weight: 20
  },
  'ui.paint': {
    descriptions: [
      'Paint Dashboard',
      'Render Error List',
      'Draw Chart Component',
      'Paint Navigation',
      'Render Modal Dialog',
      'Paint Data Grid',
      'Render Loading Spinner',
      'Paint Form Elements',
      'Draw Progress Bar',
      'Render Card Layout'
    ],
    avgDuration: 16,
    variance: 8,
    weight: 15
  },
  'ui.mount': {
    descriptions: [
      'Mount Dashboard Component',
      'Mount Error Boundary',
      'Mount Chart Widget',
      'Mount User Profile',
      'Mount Navigation Menu',
      'Mount Search Component',
      'Mount Settings Panel',
      'Mount Notification Center',
      'Mount Data Table',
      'Mount Upload Component'
    ],
    avgDuration: 45,
    variance: 25,
    weight: 12
  },
  'db.query': {
    descriptions: [
      'SELECT users WHERE active = true',
      'INSERT INTO events (data, timestamp)',
      'UPDATE user_sessions SET last_seen',
      'SELECT * FROM projects ORDER BY created',
      'DELETE FROM expired_tokens',
      'SELECT COUNT(*) FROM error_events',
      'UPDATE project_settings SET theme',
      'SELECT user_permissions JOIN roles',
      'INSERT INTO audit_log (action, user)',
      'SELECT recent_activity LIMIT 50'
    ],
    avgDuration: 85,
    variance: 60,
    weight: 18
  },
  'ui.render': {
    descriptions: [
      'Render App Component',
      'Render Error Details',
      'Render Chart Canvas',
      'Render User Avatar',
      'Render Table Rows',
      'Render Button Group',
      'Render Form Fields',
      'Render Tooltip',
      'Render Dropdown Menu',
      'Render Status Badge'
    ],
    avgDuration: 12,
    variance: 6,
    weight: 10
  },
  'navigation.navigate': {
    descriptions: [
      'Navigate to /dashboard',
      'Navigate to /projects',
      'Navigate to /settings',
      'Navigate to /profile',
      'Navigate to /errors',
      'Navigate to /analytics',
      'Navigate to /team',
      'Navigate to /billing',
      'Navigate to /integrations',
      'Navigate to /help'
    ],
    avgDuration: 120,
    variance: 50,
    weight: 8
  },
  'resource.script': {
    descriptions: [
      'Load main.js bundle',
      'Load vendor.js chunk',
      'Load analytics.js',
      'Load chart-library.js',
      'Load auth-module.js',
      'Load utils.js',
      'Load components.js',
      'Load polyfills.js',
      'Load feature-flags.js',
      'Load theme.js'
    ],
    avgDuration: 180,
    variance: 100,
    weight: 7
  },
  'function.call': {
    descriptions: [
      'processErrorData()',
      'validateUserInput()',
      'formatTimestamp()',
      'calculateMetrics()',
      'parseJsonPayload()',
      'sanitizeHtmlContent()',
      'generateReportData()',
      'transformChartData()',
      'encryptSensitiveData()',
      'cacheUserPreferences()'
    ],
    avgDuration: 8,
    variance: 5,
    weight: 6
  },
  'cache.get': {
    descriptions: [
      'Get user:12345 from cache',
      'Get session:abc123 from cache',
      'Get project:config from cache',
      'Get api:rate-limits from cache',
      'Get chart:data-2024 from cache',
      'Get feature:flags from cache',
      'Get user:preferences from cache',
      'Get system:health from cache',
      'Get auth:permissions from cache',
      'Get dashboard:widgets from cache'
    ],
    avgDuration: 3,
    variance: 2,
    weight: 5
  },
  'db.transaction': {
    descriptions: [
      'Create new user transaction',
      'Update profile transaction',
      'Delete expired data transaction',
      'Bulk insert events transaction',
      'Migrate user data transaction',
      'Archive old projects transaction',
      'Update permissions transaction',
      'Sync external data transaction',
      'Cleanup session data transaction',
      'Backup critical data transaction'
    ],
    avgDuration: 200,
    variance: 150,
    weight: 4
  },
  'resource.image': {
    descriptions: [
      'Load avatar-placeholder.png',
      'Load company-logo.svg',
      'Load chart-background.jpg',
      'Load loading-spinner.gif',
      'Load error-icon.svg',
      'Load success-checkmark.png',
      'Load dashboard-hero.jpg',
      'Load feature-screenshot.png',
      'Load profile-banner.jpg',
      'Load notification-bell.svg'
    ],
    avgDuration: 95,
    variance: 70,
    weight: 3
  },
  'auth.verify': {
    descriptions: [
      'Verify JWT token',
      'Verify session cookie',
      'Verify API key',
      'Verify 2FA code',
      'Verify password hash',
      'Verify OAuth token',
      'Verify refresh token',
      'Verify CSRF token',
      'Verify user permissions',
      'Verify rate limits'
    ],
    avgDuration: 25,
    variance: 15,
    weight: 3
  },
  'ui.interaction': {
    descriptions: [
      'Handle button click',
      'Process form submission',
      'Handle dropdown selection',
      'Process checkbox change',
      'Handle modal close',
      'Process search input',
      'Handle tab switch',
      'Process file upload',
      'Handle scroll event',
      'Process keyboard shortcut'
    ],
    avgDuration: 5,
    variance: 3,
    weight: 2
  },
  'navigation.load': {
    descriptions: [
      'Load page assets',
      'Load route components',
      'Load page data',
      'Load navigation state',
      'Load user context',
      'Load page permissions',
      'Load feature flags',
      'Load theme preferences',
      'Load breadcrumb data',
      'Load sidebar state'
    ],
    avgDuration: 80,
    variance: 40,
    weight: 2
  },
  'resource.stylesheet': {
    descriptions: [
      'Load main.css',
      'Load theme-dark.css',
      'Load components.css',
      'Load charts.css',
      'Load responsive.css',
      'Load animations.css',
      'Load icons.css',
      'Load forms.css',
      'Load tables.css',
      'Load utilities.css'
    ],
    avgDuration: 60,
    variance: 30,
    weight: 2
  },
  'cache.set': {
    descriptions: [
      'Cache user session data',
      'Cache API response',
      'Cache computed metrics',
      'Cache chart data',
      'Cache user preferences',
      'Cache feature flags',
      'Cache auth tokens',
      'Cache search results',
      'Cache dashboard widgets',
      'Cache system config'
    ],
    avgDuration: 4,
    variance: 2,
    weight: 2
  },
  'process.data': {
    descriptions: [
      'Process error events batch',
      'Transform analytics data',
      'Aggregate user metrics',
      'Process uploaded file',
      'Generate report data',
      'Calculate dashboard stats',
      'Process webhook payload',
      'Transform API response',
      'Validate input data',
      'Compress output data'
    ],
    avgDuration: 300,
    variance: 200,
    weight: 2
  },
  'db.connection': {
    descriptions: [
      'Connect to user database',
      'Connect to analytics DB',
      'Connect to cache store',
      'Connect to audit log DB',
      'Connect to session store',
      'Connect to metrics DB',
      'Connect to backup DB',
      'Connect to read replica',
      'Connect to search index',
      'Connect to config store'
    ],
    avgDuration: 50,
    variance: 30,
    weight: 1
  },
  'resource.font': {
    descriptions: [
      'Load Inter-Regular.woff2',
      'Load Inter-Bold.woff2',
      'Load Monaco-Regular.woff',
      'Load Roboto-Medium.woff2',
      'Load icons.woff2',
      'Load Inter-SemiBold.woff2',
      'Load source-code-pro.woff',
      'Load Inter-Light.woff2',
      'Load system-ui.woff2',
      'Load emoji-font.woff2'
    ],
    avgDuration: 120,
    variance: 60,
    weight: 1
  },
  'function.async': {
    descriptions: [
      'Async data fetch',
      'Async file processing',
      'Async user notification',
      'Async cache warming',
      'Async log submission',
      'Async metric collection',
      'Async backup creation',
      'Async email sending',
      'Async image optimization',
      'Async search indexing'
    ],
    avgDuration: 400,
    variance: 300,
    weight: 1
  },
  'file.read': {
    descriptions: [
      'Read config.json',
      'Read user-preferences.json',
      'Read error-templates.json',
      'Read feature-flags.json',
      'Read translations.json',
      'Read dashboard-layout.json',
      'Read chart-config.json',
      'Read theme-settings.json',
      'Read api-endpoints.json',
      'Read manifest.json'
    ],
    avgDuration: 15,
    variance: 10,
    weight: 1
  },
  'cache.miss': {
    descriptions: [
      'Cache miss: user session',
      'Cache miss: API response',
      'Cache miss: chart data',
      'Cache miss: user preferences',
      'Cache miss: feature flags',
      'Cache miss: auth permissions',
      'Cache miss: dashboard config',
      'Cache miss: search results',
      'Cache miss: system metrics',
      'Cache miss: theme settings'
    ],
    avgDuration: 2,
    variance: 1,
    weight: 1
  },
  'auth.login': {
    descriptions: [
      'User login flow',
      'SSO authentication',
      'API key authentication',
      'OAuth2 flow',
      'SAML authentication',
      '2FA verification',
      'Social login',
      'Guest user creation',
      'Service account auth',
      'Token refresh flow'
    ],
    avgDuration: 180,
    variance: 100,
    weight: 1
  },
  'auth.logout': {
    descriptions: [
      'User logout',
      'Session cleanup',
      'Token invalidation',
      'Clear user cache',
      'Audit log entry',
      'SSO logout',
      'Cleanup temp data',
      'Update last seen',
      'Clear permissions',
      'Destroy session'
    ],
    avgDuration: 35,
    variance: 20,
    weight: 1
  },
  'file.write': {
    descriptions: [
      'Write error log',
      'Save user preferences',
      'Write audit entry',
      'Save chart config',
      'Write backup file',
      'Save session data',
      'Write metrics data',
      'Save feature flags',
      'Write cache file',
      'Save system config'
    ],
    avgDuration: 25,
    variance: 15,
    weight: 1
  },
  'file.upload': {
    descriptions: [
      'Upload profile image',
      'Upload error dump',
      'Upload CSV data',
      'Upload backup file',
      'Upload log archive',
      'Upload screenshot',
      'Upload document',
      'Upload config file',
      'Upload report PDF',
      'Upload source map'
    ],
    avgDuration: 800,
    variance: 600,
    weight: 1
  },
  'process.image': {
    descriptions: [
      'Resize profile image',
      'Generate thumbnail',
      'Optimize PNG',
      'Convert to WebP',
      'Apply image filter',
      'Compress JPEG',
      'Generate avatar',
      'Create chart image',
      'Process screenshot',
      'Generate QR code'
    ],
    avgDuration: 150,
    variance: 100,
    weight: 1
  },
  'process.video': {
    descriptions: [
      'Process screen recording',
      'Generate video thumbnail',
      'Compress video file',
      'Extract video frame',
      'Convert video format',
      'Apply video filter',
      'Trim video clip',
      'Merge video segments',
      'Add video watermark',
      'Generate video preview'
    ],
    avgDuration: 2000,
    variance: 1500,
    weight: 1
  }
};

// Generate realistic duration with some variance
const generateDuration = (avgDuration: number, variance: number): number => {
  const min = Math.max(1, avgDuration - variance);
  const max = avgDuration + variance;
  return Math.round(min + Math.random() * (max - min));
};

// Generate timestamp within the last 24 hours
const generateTimestamp = (): number => {
  const now = Date.now();
  const oneDayAgo = now - (24 * 60 * 60 * 1000);
  return oneDayAgo + Math.random() * (now - oneDayAgo);
};

// Generate a single span
export const generateSpan = (
  traceId: string,
  project: ProjectInfo,
  parentSpanId?: string,
  baseTimestamp?: number
): SpanData => {
  const operations = Object.entries(SPAN_TEMPLATES).map(([op, template]) => ({
    item: op as SpanOperation,
    weight: template.weight
  }));
  
  const operation = getWeightedRandomElement(operations);
  const template = SPAN_TEMPLATES[operation];
  const description = getRandomElement(template.descriptions);
  const duration = generateDuration(template.avgDuration, template.variance);
  
  const startTimestamp = baseTimestamp || generateTimestamp();
  const endTimestamp = startTimestamp + duration;
  
  const statuses: SpanData['status'][] = ['ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'cancelled', 'internal_error', 'not_found'];
  
  return {
    span_id: generateSpanId(),
    trace_id: traceId,
    parent_span_id: parentSpanId,
    description,
    op: operation,
    duration,
    start_timestamp: startTimestamp,
    end_timestamp: endTimestamp,
    project: {
      name: project.name,
      id: project.id
    },
    tags: {
      environment: getRandomElement(['production', 'staging', 'development']),
      technology: getRandomElement(project.technology),
      region: getRandomElement(['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1']),
      version: `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`
    },
    data: {
      'http.method': operation.startsWith('http') ? getRandomElement(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']) : undefined,
      'http.status_code': operation.startsWith('http') ? getRandomElement([200, 201, 204, 400, 401, 403, 404, 500]) : undefined,
      'db.statement': operation.startsWith('db') ? description : undefined,
      'component': operation.startsWith('ui') ? getRandomElement(['Button', 'Form', 'Chart', 'Modal', 'Table']) : undefined,
      'user.id': `user_${Math.floor(Math.random() * 10000)}`,
      'session.id': generateHex(16)
    },
    status: getRandomElement(statuses)
  };
};

// Generate a trace with multiple related spans
export const generateTrace = (project?: ProjectInfo): TraceData => {
  const selectedProject = project || getRandomElement(PROJECTS);
  const traceId = generateTraceId();
  const spans: SpanData[] = [];
  
  // Generate root span
  const rootSpan = generateSpan(traceId, selectedProject);
  spans.push(rootSpan);
  
  // Generate child spans
  const childSpanCount = Math.floor(Math.random() * 8) + 2; // 2-9 child spans
  for (let i = 0; i < childSpanCount; i++) {
    const parentSpan = getRandomElement(spans);
    const childTimestamp = parentSpan.start_timestamp + Math.random() * (parentSpan.duration * 0.8);
    const childSpan = generateSpan(traceId, selectedProject, parentSpan.span_id, childTimestamp);
    
    // Ensure child span doesn't exceed parent span duration
    if (childSpan.end_timestamp > parentSpan.end_timestamp) {
      childSpan.end_timestamp = parentSpan.end_timestamp - 1;
      childSpan.duration = childSpan.end_timestamp - childSpan.start_timestamp;
    }
    
    spans.push(childSpan);
  }
  
  // Sort spans by start timestamp
  spans.sort((a, b) => a.start_timestamp - b.start_timestamp);
  
  const startTimestamp = Math.min(...spans.map(s => s.start_timestamp));
  const endTimestamp = Math.max(...spans.map(s => s.end_timestamp));
  
  return {
    trace_id: traceId,
    spans,
    duration: endTimestamp - startTimestamp,
    start_timestamp: startTimestamp,
    end_timestamp: endTimestamp,
    project: {
      name: selectedProject.name,
      id: selectedProject.id
    }
  };
};

// Generate multiple traces
export const generateTraces = (count: number = 20): TraceData[] => {
  const traces: TraceData[] = [];
  
  for (let i = 0; i < count; i++) {
    traces.push(generateTrace());
  }
  
  // Sort by start timestamp (most recent first)
  return traces.sort((a, b) => b.start_timestamp - a.start_timestamp);
};

// Generate spans for specific operations (for focused visualization)
export const generateSpansForOperation = (operation: SpanOperation, count: number = 10): SpanData[] => {
  const spans: SpanData[] = [];
  const project = getRandomElement(PROJECTS);
  
  for (let i = 0; i < count; i++) {
    const traceId = generateTraceId();
    const template = SPAN_TEMPLATES[operation];
    const description = getRandomElement(template.descriptions);
    const duration = generateDuration(template.avgDuration, template.variance);
    const startTimestamp = generateTimestamp();
    
    spans.push({
      span_id: generateSpanId(),
      trace_id: traceId,
      description,
      op: operation,
      duration,
      start_timestamp: startTimestamp,
      end_timestamp: startTimestamp + duration,
      project: {
        name: project.name,
        id: project.id
      },
      tags: {
        environment: getRandomElement(['production', 'staging', 'development']),
        technology: getRandomElement(project.technology),
        region: getRandomElement(['us-east-1', 'us-west-2', 'eu-west-1']),
        version: `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`
      },
      data: {
        'user.id': `user_${Math.floor(Math.random() * 10000)}`,
        'session.id': generateHex(16)
      },
      status: getRandomElement(['ok', 'ok', 'ok', 'ok', 'cancelled', 'internal_error'])
    });
  }
  
  return spans.sort((a, b) => b.start_timestamp - a.start_timestamp);
};

// Get all available projects
export const getProjects = (): ProjectInfo[] => PROJECTS;

// Get all available operations
export const getOperations = (): SpanOperation[] => Object.keys(SPAN_TEMPLATES) as SpanOperation[];

// Get operation statistics for visualization
export const getOperationDistribution = (spans: SpanData[]): Record<SpanOperation, number> => {
  const distribution = {} as Record<SpanOperation, number>;
  
  // Initialize all operations with 0
  (Object.keys(SPAN_TEMPLATES) as SpanOperation[]).forEach(op => {
    distribution[op] = 0;
  });
  
  // Count spans by operation
  spans.forEach(span => {
    const operation = span.op as SpanOperation;
    if (operation in distribution) {
      distribution[operation]++;
    }
  });
  
  return distribution;
};
