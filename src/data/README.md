# Sentry Data for Generative Art

This directory contains comprehensive dummy data representing both Sentry error envelopes and performance span data, designed for use in generative art projects that visualize error patterns, performance metrics, and distributed tracing.

## Data Structure

The generated Sentry envelopes follow the official Sentry event format and include:

- **Event Metadata**: Event ID, timestamps, environment, platform
- **Error Details**: Exception types, stack traces, error messages
- **Context Information**: User data, device info, runtime details
- **Metrics**: Ingestion data, error frequencies, geographic distribution

## Available Datasets

### Core Datasets

```typescript
import {
  SAMPLE_SENTRY_ENVELOPES,    // 100 mixed error types
  ERROR_STATISTICS,           // Aggregated metrics
  GROUPED_ERRORS_BY_TYPE,     // Organized by error type
  GROUPED_ERRORS_BY_LEVEL,    // Organized by severity
  GROUPED_ERRORS_BY_ENVIRONMENT // Organized by environment
} from '@/data/sampleSentryEnvelopes';
```

### Specialized Datasets

```typescript
// Specific error types (10-15 samples each)
import {
  JAVASCRIPT_ERRORS,
  NETWORK_ERRORS,
  DATABASE_ERRORS,
  AUTHENTICATION_ERRORS,
  VALIDATION_ERRORS,
  PERMISSION_ERRORS,
  TIMEOUT_ERRORS,
  MEMORY_ERRORS,
  SYNTAX_ERRORS
} from '@/data/sampleSentryEnvelopes';

// Filtered datasets
import {
  CRITICAL_ERRORS,     // Fatal and high-severity errors
  PRODUCTION_ERRORS,   // Production environment only
  RECENT_ERRORS,       // Last 24 hours
  HIGH_FREQUENCY_ERRORS // Most common error patterns
} from '@/data/sampleSentryEnvelopes';
```

## Error Types

The generator creates nine distinct error categories:

1. **JavaScript**: `TypeError`, `ReferenceError`, `SyntaxError`
2. **Network**: HTTP errors, CORS issues, timeouts
3. **Database**: Connection errors, query failures
4. **Authentication**: Login failures, token expiration
5. **Validation**: Form validation, schema errors
6. **Permission**: Access denied, role restrictions
7. **Timeout**: Request timeouts, async operation failures
8. **Memory**: Out of memory, heap overflow
9. **Syntax**: Parse errors, compilation failures

## Generative Art Applications

### 1. Error Frequency Visualization

```typescript
import { ERROR_STATISTICS } from '@/data/sampleSentryEnvelopes';

// Create color-coded visualization based on error frequency
const errorColors = Object.entries(ERROR_STATISTICS.distribution)
  .map(([type, count]) => ({
    type,
    count,
    intensity: count / ERROR_STATISTICS.total,
    color: getErrorTypeColor(type)
  }));
```

### 2. Geographic Error Distribution

```typescript
import { SAMPLE_SENTRY_ENVELOPES } from '@/data/sampleSentryEnvelopes';

// Extract geographic data for mapping visualizations
const geoErrors = SAMPLE_SENTRY_ENVELOPES
  .filter(error => error.user?.geo)
  .map(error => ({
    latitude: getLatitude(error.user.geo.city),
    longitude: getLongitude(error.user.geo.city),
    severity: error.level,
    type: error.exception?.values[0]?.type
  }));
```

### 3. Time-Series Animation

```typescript
import { generateTimeSeriesData } from '@/data/sampleSentryEnvelopes';

// Generate daily error patterns for animation
const timeSeriesData = generateTimeSeriesData(30); // 30 days
const animationFrames = timeSeriesData.map(day => ({
  date: day.date,
  errorCount: day.errors.length,
  errorTypes: getErrorTypeDistribution(day.errors)
}));
```

### 4. Stack Trace Patterns

```typescript
import { JAVASCRIPT_ERRORS } from '@/data/sampleSentryEnvelopes';

// Extract function call patterns for network graphs
const callGraphs = JAVASCRIPT_ERRORS.map(error => {
  const frames = error.exception?.values[0]?.stacktrace?.frames || [];
  return frames.map(frame => ({
    function: frame.function,
    module: frame.module,
    inApp: frame.in_app
  }));
});
```

### 5. Error Severity Heat Maps

```typescript
import { getErrorsByLevel } from '@/data/sampleSentryEnvelopes';

const severityLevels = ['debug', 'info', 'warning', 'error', 'fatal'];
const heatMapData = severityLevels.map(level => ({
  level,
  errors: getErrorsByLevel(level),
  intensity: getErrorsByLevel(level).length
}));
```

## Color Mapping

Use the project's color palette for consistent error type visualization:

```typescript
import { COLOR_PALETTE } from '@/utils/colorPalette';

const ERROR_TYPE_COLORS = {
  javascript: COLOR_PALETTE.BLURPLE,
  network: COLOR_PALETTE.DK_ORANGE,
  database: COLOR_PALETTE.DK_VIOLET,
  authentication: COLOR_PALETTE.DK_PINK,
  validation: COLOR_PALETTE.DK_YELLOW,
  permission: COLOR_PALETTE.LT_PURPLE,
  timeout: COLOR_PALETTE.DK_BLUE,
  memory: COLOR_PALETTE.LT_PINK,
  syntax: COLOR_PALETTE.DK_GREEN
};
```

## Usage Examples

### Three.js Visualization

```typescript
import * as THREE from 'three';
import { SAMPLE_SENTRY_ENVELOPES } from '@/data/sampleSentryEnvelopes';

const createErrorParticles = () => {
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  
  SAMPLE_SENTRY_ENVELOPES.forEach((error, index) => {
    // Position based on timestamp and severity
    positions.push(
      index * 0.1,                    // x: chronological
      getSeverityHeight(error.level), // y: severity
      Math.random() * 10 - 5          // z: random spread
    );
    
    // Color based on error type
    const color = new THREE.Color(getErrorTypeColor(error));
    colors.push(color.r, color.g, color.b);
  });
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  
  return new THREE.Points(geometry, material);
};
```

### P5.js Sketch

```typescript
import { ERROR_STATISTICS } from '@/data/sampleSentryEnvelopes';

const draw = (p: p5) => {
  const centerX = p.width / 2;
  const centerY = p.height / 2;
  
  Object.entries(ERROR_STATISTICS.distribution).forEach(([type, count], index) => {
    const angle = (index / 9) * p.TWO_PI;
    const radius = p.map(count, 0, ERROR_STATISTICS.total, 50, 200);
    
    const x = centerX + p.cos(angle) * radius;
    const y = centerY + p.sin(angle) * radius;
    
    p.fill(getErrorTypeColor(type));
    p.circle(x, y, count * 2);
  });
};
```

## Performance Considerations

- **SMALL_SAMPLE**: 10 envelopes for quick prototyping
- **SAMPLE_SENTRY_ENVELOPES**: 100 envelopes for standard visualization
- **LARGE_SAMPLE**: 500 envelopes for performance testing

Choose the appropriate dataset size based on your rendering requirements and performance constraints.

## Custom Data Generation

Generate custom datasets for specific requirements:

```typescript
import { generateSentryEnvelopes, generateSentryEnvelopesForType } from '@/utils/sentryDataGenerator';

// Generate 50 random errors
const customErrors = generateSentryEnvelopes(50);

// Generate 20 network errors only
const networkErrors = generateSentryEnvelopesForType('network', 20);
```

---

# Performance Span Data for Tracing Visualization

In addition to error data, this project includes comprehensive span data for visualizing distributed tracing and performance patterns.

## Span Data Structure

Span data represents operations in distributed systems with timing information:

```typescript
interface SpanData {
  span_id: string;           // Unique span identifier
  trace_id: string;          // Trace this span belongs to
  parent_span_id?: string;   // Parent span (for hierarchical traces)
  description: string;       // Human-readable operation description
  op: string;               // Operation type (e.g., 'http.server', 'db.query')
  duration: number;         // Duration in milliseconds
  start_timestamp: number;  // When the operation started
  end_timestamp: number;    // When the operation ended
  project: {
    name: string;           // Project name (e.g., 'Sentry Dashboard')
    id: string;            // Project identifier
  };
  tags?: Record<string, string>;  // Additional metadata
  status: string;               // Operation status ('ok', 'error', etc.)
}
```

## Available Span Datasets

### Core Span Collections

```typescript
import {
  SAMPLE_SPANS,        // All spans from generated traces
  SAMPLE_TRACES,       // Complete traces with hierarchical spans
  SPAN_STATISTICS,     // Aggregated metrics and statistics
  POPULAR_DATASETS     // Most commonly used datasets
} from '@/data/sampleSpanData';
```

### Operation-Specific Datasets

```typescript
// HTTP Operations (great for network visualizations)
import {
  HTTP_SERVER_SPANS,   // 'GET /homepage', 'POST /api/login', etc.
  HTTP_CLIENT_SPANS,   // API calls, external requests
  ALL_HTTP_SPANS       // Combined HTTP operations
} from '@/data/sampleSpanData';

// UI Operations (perfect for frontend performance art)
import {
  UI_PAINT_SPANS,      // 'Paint Dashboard', 'Render Chart Component'
  UI_MOUNT_SPANS,      // 'Mount Dashboard Component', 'Mount User Profile'
  UI_RENDER_SPANS,     // 'Render App Component', 'Render Error Details'
  ALL_UI_SPANS         // Combined UI operations
} from '@/data/sampleSpanData';

// Database Operations
import {
  DB_QUERY_SPANS,      // 'SELECT users WHERE active = true'
  ALL_DB_SPANS         // All database operations
} from '@/data/sampleSpanData';
```

### Performance-Based Datasets

```typescript
// Duration-based groupings for performance visualization
import {
  FAST_SPANS,         // < 20ms (UI interactions, cache hits)
  MEDIUM_SPANS,       // 20-100ms (API calls, rendering)
  SLOW_SPANS,         // 100-500ms (database queries)
  VERY_SLOW_SPANS     // > 500ms (file uploads, heavy processing)
} from '@/data/sampleSpanData';
```

### Common Pattern Datasets

```typescript
// Spans grouped by common user flows
import {
  HOMEPAGE_SPANS,     // All spans related to homepage loading
  LOGIN_SPANS,        // Complete login flow spans
  DASHBOARD_SPANS,    // Dashboard rendering and data loading
  API_SPANS          // All API-related operations
} from '@/data/sampleSpanData';
```

## Span Operations

The generator includes 27 different operation types optimized for art visualization:

### High-Frequency Operations (great for pattern density)
- `http.server` - Server-side HTTP requests
- `http.client` - Client-side HTTP requests  
- `ui.paint` - UI painting operations
- `ui.mount` - Component mounting
- `db.query` - Database queries

### Medium-Frequency Operations
- `ui.render` - Component rendering
- `navigation.navigate` - Page navigation
- `function.call` - Function executions
- `cache.get` - Cache retrievals

### Specialized Operations
- `auth.verify` - Authentication checks
- `file.upload` - File uploads (long duration)
- `process.video` - Video processing (very long duration)

## Span Data for Generative Art

### 1. Performance Waterfall Visualization

```typescript
import { SAMPLE_TRACES } from '@/data/sampleSpanData';
import { COLOR_PALETTE } from '@/utils/colorPalette';

// Create waterfall chart showing span hierarchies
const createWaterfallVisualization = (trace: TraceData) => {
  return trace.spans.map((span, index) => ({
    x: span.start_timestamp - trace.start_timestamp,
    y: index * 20,
    width: span.duration,
    height: 15,
    color: getOperationColor(span.op),
    description: span.description
  }));
};
```

### 2. Operation Type Clustering

```typescript
import { SPANS_BY_OPERATION } from '@/data/sampleSpanData';

// Group spans by operation for clustered visualizations
const operationClusters = Object.entries(SPANS_BY_OPERATION).map(([op, spans]) => ({
  operation: op,
  count: spans.length,
  avgDuration: spans.reduce((sum, span) => sum + span.duration, 0) / spans.length,
  color: getOperationColor(op),
  spans: spans
}));
```

### 3. Duration-Based Particle Systems

```typescript
import { SAMPLE_SPANS } from '@/data/sampleSpanData';

// Create particles with size based on duration
const createDurationParticles = () => {
  return SAMPLE_SPANS.map(span => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.log(span.duration + 1) * 5, // Logarithmic scaling
    color: getDurationColor(span.duration),
    velocity: 100 / span.duration, // Slower particles for longer operations
    operation: span.op
  }));
};
```

### 4. Project-Based Network Graphs

```typescript
import { FRONTEND_SPANS, BACKEND_SPANS } from '@/data/sampleSpanData';

// Create network graph showing project interactions
const projectNetwork = {
  nodes: [
    { id: 'frontend', spans: FRONTEND_SPANS, color: COLOR_PALETTE.LT_BLUE },
    { id: 'backend', spans: BACKEND_SPANS, color: COLOR_PALETTE.DK_VIOLET }
  ],
  edges: findSpanConnections(FRONTEND_SPANS, BACKEND_SPANS)
};
```

### 5. Temporal Flow Visualization

```typescript
import { RECENT_SPANS } from '@/data/sampleSpanData';

// Create flowing visualization based on span timing
const createTemporalFlow = () => {
  const sortedSpans = RECENT_SPANS.sort((a, b) => a.start_timestamp - b.start_timestamp);
  
  return sortedSpans.map((span, index) => ({
    position: index / sortedSpans.length,
    flow: span.duration / 1000, // Flow speed based on duration
    color: getOperationColor(span.op),
    size: Math.sqrt(span.duration),
    description: span.description
  }));
};
```

## Operation Color Mapping

Use consistent colors for operation types:

```typescript
import { COLOR_PALETTE, PRIMARY_COLORS, SECONDARY_COLORS } from '@/utils/colorPalette';

const OPERATION_TYPE_COLORS = {
  // HTTP Operations
  'http.server': PRIMARY_COLORS.BLURPLE,
  'http.client': PRIMARY_COLORS.LT_BLURPLE,
  
  // UI Operations
  'ui.paint': SECONDARY_COLORS.DK_PINK,
  'ui.mount': SECONDARY_COLORS.LT_PINK,
  'ui.render': SECONDARY_COLORS.DK_ORANGE,
  
  // Database Operations
  'db.query': PRIMARY_COLORS.DK_VIOLET,
  'db.transaction': PRIMARY_COLORS.LT_VIOLET,
  
  // Cache Operations
  'cache.get': SECONDARY_COLORS.DK_GREEN,
  'cache.set': SECONDARY_COLORS.LT_GREEN,
  
  // Function Operations
  'function.call': SECONDARY_COLORS.DK_BLUE,
  'function.async': SECONDARY_COLORS.LT_BLUE
};
```

## Three.js Span Visualization Examples

### Span Duration Towers

```typescript
import * as THREE from 'three';
import { SAMPLE_SPANS } from '@/data/sampleSpanData';

const createSpanTowers = () => {
  const group = new THREE.Group();
  
  SAMPLE_SPANS.forEach((span, index) => {
    const height = Math.log(span.duration + 1) * 2;
    const geometry = new THREE.BoxGeometry(0.5, height, 0.5);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(getOperationColor(span.op))
    });
    
    const tower = new THREE.Mesh(geometry, material);
    tower.position.set(
      (index % 20) * 1,
      height / 2,
      Math.floor(index / 20) * 1
    );
    
    group.add(tower);
  });
  
  return group;
};
```

### Animated Span Flow

```typescript
const createAnimatedSpanFlow = () => {
  const spansWithFlow = SAMPLE_SPANS.map(span => ({
    ...span,
    progress: 0,
    flowSpeed: 1000 / span.duration // Inverse relationship
  }));
  
  const animate = () => {
    spansWithFlow.forEach(span => {
      span.progress += span.flowSpeed * 0.016; // 60fps
      if (span.progress > 1) span.progress = 0;
      
      // Update visual position based on progress
      updateSpanVisualization(span);
    });
  };
  
  return { spansWithFlow, animate };
};
```

## Helper Functions

```typescript
import { 
  getSpansByProject, 
  getSpansByOperation, 
  getSpansByDurationRange 
} from '@/data/sampleSpanData';

// Filter spans for specific visualization needs
const webSpans = getSpansByProject('Sentry Dashboard');
const httpSpans = getSpansByOperation('http.server');
const fastSpans = getSpansByDurationRange(0, 50);
```

## Performance Notes

- **Total Spans**: ~1000+ spans across all datasets
- **Traces**: 50 complete traces with hierarchical relationships  
- **Operations**: 27 different operation types
- **Projects**: 6 realistic project configurations
- **Time Range**: Last 24 hours with realistic timing
- **Relationships**: Parent-child span relationships preserved
