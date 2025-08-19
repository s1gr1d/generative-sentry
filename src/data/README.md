# Sentry Error Data for Generative Art

This directory contains comprehensive dummy data representing Sentry error envelopes, designed for use in generative art projects that visualize error patterns and metrics.

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
