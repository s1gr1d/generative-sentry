import type { SentryEnvelope, SentryException, SentryFrame, ErrorType, ErrorTemplate } from '@/types/sentryEnvelope';

// Helper function to generate random hex string
const generateHex = (length: number): string => {
  return Array.from({ length }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Helper function to generate random event ID
const generateEventId = (): string => generateHex(32);

// Helper function to generate random trace ID
const generateTraceId = (): string => generateHex(32);

// Helper function to generate random span ID
const generateSpanId = (): string => generateHex(16);

// Helper function to get random element from array
const getRandomElement = <T>(array: T[]): T => 
  array[Math.floor(Math.random() * array.length)];

// Helper function to get random date within last 30 days
const getRandomDate = (): Date => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  const randomTime = thirtyDaysAgo.getTime() + 
    Math.random() * (now.getTime() - thirtyDaysAgo.getTime());
  return new Date(randomTime);
};

// Helper function to format date as ISO string
const formatDate = (date: Date): string => date.toISOString();

// Helper function to get timestamp
const getTimestamp = (date: Date): number => Math.floor(date.getTime() / 1000);

// Error templates for different types of errors
const ERROR_TEMPLATES: Record<ErrorType, ErrorTemplate> = {
  javascript: {
    type: 'javascript',
    platform: 'javascript',
    level: 'error',
    commonMessages: [
      'Cannot read property of undefined',
      'TypeError: Cannot read properties of null',
      'ReferenceError: variable is not defined',
      'TypeError: Cannot call method of undefined',
      'SyntaxError: Unexpected token',
      'RangeError: Maximum call stack size exceeded'
    ],
    commonFunctions: [
      'onClick',
      'handleSubmit',
      'componentDidMount',
      'useEffect',
      'render',
      'fetchData'
    ],
    commonModules: [
      'app/components/Button.tsx',
      'app/pages/Dashboard.tsx',
      'app/utils/helpers.ts',
      'app/hooks/useAuth.ts',
      'node_modules/react/index.js'
    ],
    environments: ['production', 'staging', 'development']
  },
  network: {
    type: 'network',
    platform: 'javascript',
    level: 'error',
    commonMessages: [
      'NetworkError: Failed to fetch',
      'CORS error: Access-Control-Allow-Origin',
      'Timeout: Request timed out after 30s',
      'HTTP 404: Resource not found',
      'HTTP 500: Internal server error',
      'Connection refused'
    ],
    commonFunctions: [
      'fetch',
      'axios.get',
      'XMLHttpRequest.send',
      'apiCall',
      'loadData',
      'submitForm'
    ],
    commonModules: [
      'app/api/client.ts',
      'app/services/userService.ts',
      'node_modules/axios/lib/core/xhr.js',
      'app/utils/fetchWrapper.ts'
    ],
    environments: ['production', 'staging']
  },
  database: {
    type: 'database',
    platform: 'node',
    level: 'error',
    commonMessages: [
      'Connection timeout',
      'Query failed: syntax error',
      'Constraint violation: duplicate key',
      'Table does not exist',
      'Permission denied for table',
      'Connection refused to database'
    ],
    commonFunctions: [
      'query',
      'connect',
      'transaction',
      'findById',
      'create',
      'update'
    ],
    commonModules: [
      'node_modules/pg/lib/client.js',
      'node_modules/mysql2/index.js',
      'app/models/User.ts',
      'app/database/connection.ts'
    ],
    environments: ['production', 'staging', 'development']
  },
  authentication: {
    type: 'authentication',
    platform: 'javascript',
    level: 'warning',
    commonMessages: [
      'Invalid credentials',
      'Token expired',
      'Unauthorized access',
      'Session not found',
      'Invalid JWT token',
      'Authentication failed'
    ],
    commonFunctions: [
      'login',
      'authenticate',
      'verifyToken',
      'checkAuth',
      'refreshToken',
      'logout'
    ],
    commonModules: [
      'app/auth/AuthProvider.tsx',
      'app/services/authService.ts',
      'app/middleware/auth.ts',
      'node_modules/jsonwebtoken/index.js'
    ],
    environments: ['production', 'staging']
  },
  validation: {
    type: 'validation',
    platform: 'javascript',
    level: 'warning',
    commonMessages: [
      'Required field missing',
      'Invalid email format',
      'Password too weak',
      'Invalid phone number',
      'Value out of range',
      'Invalid date format'
    ],
    commonFunctions: [
      'validateForm',
      'checkEmail',
      'validatePassword',
      'sanitizeInput',
      'parseDate',
      'validateSchema'
    ],
    commonModules: [
      'app/utils/validation.ts',
      'app/components/Form.tsx',
      'node_modules/joi/lib/index.js',
      'app/schemas/userSchema.ts'
    ],
    environments: ['production', 'staging', 'development']
  },
  permission: {
    type: 'permission',
    platform: 'javascript',
    level: 'warning',
    commonMessages: [
      'Access denied',
      'Insufficient permissions',
      'Role not authorized',
      'Resource forbidden',
      'Admin access required',
      'User not in group'
    ],
    commonFunctions: [
      'checkPermission',
      'hasRole',
      'canAccess',
      'authorize',
      'validateRole',
      'enforcePolicy'
    ],
    commonModules: [
      'app/middleware/rbac.ts',
      'app/services/permissionService.ts',
      'app/utils/acl.ts',
      'app/guards/RoleGuard.tsx'
    ],
    environments: ['production', 'staging']
  },
  timeout: {
    type: 'timeout',
    platform: 'javascript',
    level: 'error',
    commonMessages: [
      'Request timeout',
      'Operation timed out',
      'Connection timeout',
      'Script execution timeout',
      'Promise timeout',
      'Async operation timeout'
    ],
    commonFunctions: [
      'setTimeout',
      'fetch',
      'waitFor',
      'delay',
      'promiseWithTimeout',
      'asyncOperation'
    ],
    commonModules: [
      'app/utils/timeout.ts',
      'app/api/client.ts',
      'node_modules/axios/lib/adapters/xhr.js',
      'app/services/fileUpload.ts'
    ],
    environments: ['production', 'staging']
  },
  memory: {
    type: 'memory',
    platform: 'node',
    level: 'fatal',
    commonMessages: [
      'Out of memory',
      'Memory limit exceeded',
      'Heap out of memory',
      'Stack overflow',
      'Memory leak detected',
      'GC allocation failed'
    ],
    commonFunctions: [
      'allocateMemory',
      'processLargeFile',
      'recursiveFunction',
      'loadBigData',
      'createBuffer',
      'handleUpload'
    ],
    commonModules: [
      'node_modules/node/lib/buffer.js',
      'app/services/dataProcessor.ts',
      'app/utils/fileHandler.ts',
      'node_modules/sharp/lib/index.js'
    ],
    environments: ['production', 'staging']
  },
  syntax: {
    type: 'syntax',
    platform: 'javascript',
    level: 'error',
    commonMessages: [
      'Unexpected token',
      'Unexpected end of input',
      'Invalid left-hand side',
      'Missing ) after argument list',
      'Unexpected identifier',
      'Invalid regular expression'
    ],
    commonFunctions: [
      'parse',
      'eval',
      'compile',
      'transpile',
      'validate',
      'transform'
    ],
    commonModules: [
      'app/utils/parser.ts',
      'node_modules/babel-core/lib/index.js',
      'app/compiler/index.ts',
      'node_modules/typescript/lib/typescript.js'
    ],
    environments: ['development', 'staging']
  }
};

// Generate random browser info
const generateBrowserInfo = () => {
  const browsers = [
    { name: 'Chrome', version: '120.0.6099.109' },
    { name: 'Firefox', version: '121.0.1' },
    { name: 'Safari', version: '17.2.1' },
    { name: 'Edge', version: '120.0.2210.91' }
  ];
  return getRandomElement(browsers);
};

// Generate random OS info
const generateOSInfo = () => {
  const systems = [
    { os: 'macOS 14.2', name: 'macOS', version: '14.2', build: '23C64' },
    { os: 'Windows 11', name: 'Windows', version: '11', build: '22631.2861' },
    { os: 'Ubuntu 22.04', name: 'Ubuntu', version: '22.04', build: 'jammy' },
    { os: 'iOS 17.2', name: 'iOS', version: '17.2', build: '21C62' }
  ];
  return getRandomElement(systems);
};

// Generate random user info
const generateUserInfo = () => {
  const users = [
    { id: 'user_1234', email: 'john.doe@example.com', username: 'johndoe' },
    { id: 'user_5678', email: 'jane.smith@company.org', username: 'janesmith' },
    { id: 'user_9012', email: 'alex.wilson@startup.io', username: 'alexw' },
    { id: 'user_3456', email: 'sarah.brown@corp.net', username: 'sarahb' }
  ];
  
  const locations = [
    { country_code: 'US', city: 'New York', subdivision: 'New York', region: 'United States' },
    { country_code: 'GB', city: 'London', subdivision: 'England', region: 'United Kingdom' },
    { country_code: 'DE', city: 'Berlin', subdivision: 'Berlin', region: 'Germany' },
    { country_code: 'CA', city: 'Toronto', subdivision: 'Ontario', region: 'Canada' },
    { country_code: 'AU', city: 'Sydney', subdivision: 'New South Wales', region: 'Australia' }
  ];
  
  const user = getRandomElement(users);
  const geo = getRandomElement(locations);
  
  return { ...user, geo };
};

// Generate stack frames for an error
const generateStackFrames = (template: ErrorTemplate, count: number = 5): SentryFrame[] => {
  const frames: SentryFrame[] = [];
  
  for (let i = 0; i < count; i++) {
    const isInApp = Math.random() > 0.3; // 70% chance of being in-app
    const module = getRandomElement(template.commonModules);
    const func = getRandomElement(template.commonFunctions);
    
    frames.push({
      function: func,
      module: module.replace(/\.[^/.]+$/, '').replace(/.*\//, ''),
      filename: module,
      abs_path: `/Users/developer/project/${module}`,
      lineno: Math.floor(Math.random() * 500) + 1,
      colno: Math.floor(Math.random() * 80) + 1,
      pre_context: [
        '  const result = await processData();',
        '  if (!result) {',
        '    throw new Error("Processing failed");'
      ],
      context_line: `  return ${func}(data);`,
      post_context: [
        '  } catch (error) {',
        '    console.error("Error:", error);',
        '    throw error;'
      ],
      in_app: isInApp,
      data: {
        client_in_app: isInApp,
        symbolicated: Math.random() > 0.2
      }
    });
  }
  
  return frames;
};

// Generate an exception with stacktrace
const generateException = (template: ErrorTemplate): SentryException => {
  const message = getRandomElement(template.commonMessages);
  const exceptionTypes = {
    javascript: ['TypeError', 'ReferenceError', 'SyntaxError', 'RangeError'],
    network: ['NetworkError', 'FetchError', 'TimeoutError'],
    database: ['DatabaseError', 'QueryError', 'ConnectionError'],
    authentication: ['AuthenticationError', 'TokenError', 'SessionError'],
    validation: ['ValidationError', 'SchemaError', 'FormatError'],
    permission: ['PermissionError', 'AuthorizationError', 'AccessError'],
    timeout: ['TimeoutError', 'AbortError'],
    memory: ['MemoryError', 'OutOfMemoryError'],
    syntax: ['SyntaxError', 'ParseError']
  };
  
  const type = getRandomElement(exceptionTypes[template.type]);
  
  return {
    type,
    value: message,
    stacktrace: {
      frames: generateStackFrames(template)
    },
    raw_stacktrace: {
      frames: generateStackFrames(template)
    },
    mechanism: {
      type: 'generic',
      handled: template.level !== 'fatal',
      exception_id: 0
    }
  };
};

// Generate a complete Sentry envelope
export const generateSentryEnvelope = (errorType: ErrorType): SentryEnvelope => {
  const template = ERROR_TEMPLATES[errorType];
  const date = getRandomDate();
  const traceId = generateTraceId();
  const browser = generateBrowserInfo();
  const os = generateOSInfo();
  const user = generateUserInfo();
  const environment = getRandomElement(template.environments);
  
  return {
    event_id: generateEventId(),
    project: Math.floor(Math.random() * 9000000000000000) + 1000000000000000,
    release: Math.random() > 0.3 ? `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}` : null,
    dist: Math.random() > 0.5 ? generateHex(8) : null,
    platform: template.platform,
    message: '',
    datetime: formatDate(date),
    tags: [
      ['environment', environment],
      ['handled', template.level !== 'fatal' ? 'yes' : 'no'],
      ['level', template.level],
      ['mechanism', 'generic'],
      ['os', os.os],
      ['os.name', os.name],
      ['runtime', template.platform === 'node' ? 'node v20.10.0' : browser.name],
      ['runtime.name', template.platform === 'node' ? 'node' : browser.name.toLowerCase()],
      ['server_name', 'app-server-' + Math.floor(Math.random() * 100)],
      ['transaction', `${getRandomElement(['GET', 'POST', 'PUT', 'DELETE'])} /${errorType}-error`]
    ],
    _dsc: {
      environment,
      org_id: Math.floor(Math.random() * 1000000).toString(),
      public_key: generateHex(32),
      release: null,
      replay_id: Math.random() > 0.7 ? generateHex(32) : null,
      trace_id: traceId,
      transaction: null
    },
    _meta: {
      transaction: {
        '': {
          rem: [['!limit', 's', 197, 200]],
          len: Math.floor(Math.random() * 2000) + 1000
        }
      }
    },
    _metrics: {
      bytes_ingested_event: Math.floor(Math.random() * 50000) + 10000,
      bytes_stored_event: Math.floor(Math.random() * 100000) + 20000
    },
    contexts: {
      app: {
        app_start_time: formatDate(new Date(date.getTime() - Math.random() * 3600000)),
        app_memory: Math.floor(Math.random() * 2000000000) + 500000000,
        free_memory: Math.floor(Math.random() * 500000000) + 100000000,
        type: 'app'
      },
      cloud_resource: {
        type: 'cloud_resource'
      },
      culture: {
        locale: getRandomElement(['en-US', 'en-GB', 'de-DE', 'fr-FR', 'es-ES']),
        timezone: getRandomElement(['America/New_York', 'Europe/London', 'Europe/Berlin', 'Asia/Tokyo']),
        type: 'culture'
      },
      device: {
        arch: getRandomElement(['x64', 'arm64', 'x86']),
        memory_size: Math.floor(Math.random() * 64) * 1024 * 1024 * 1024 + 8 * 1024 * 1024 * 1024,
        free_memory: Math.floor(Math.random() * 500000000) + 100000000,
        boot_time: formatDate(new Date(date.getTime() - Math.random() * 7 * 24 * 3600000)),
        processor_count: getRandomElement([4, 8, 12, 16]),
        cpu_description: getRandomElement(['Intel Core i7-12700K', 'AMD Ryzen 7 5800X', 'Apple M2 Pro', 'Intel Xeon E5-2686']),
        processor_frequency: getRandomElement([2400, 2800, 3200, 3600]),
        type: 'device'
      },
      os: {
        ...os,
        kernel_version: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        type: 'os'
      },
      runtime: {
        runtime: template.platform === 'node' ? 'node v20.10.0' : `${browser.name} ${browser.version}`,
        name: template.platform === 'node' ? 'node' : browser.name.toLowerCase(),
        version: template.platform === 'node' ? 'v20.10.0' : browser.version,
        type: 'runtime'
      },
      trace: {
        trace_id: traceId,
        span_id: generateSpanId(),
        status: 'unknown',
        type: 'trace'
      },
      ...(template.platform === 'javascript' && {
        browser: {
          name: browser.name,
          version: browser.version,
          type: 'browser'
        }
      }),
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    },
    culprit: `${getRandomElement(template.commonFunctions)} in ${getRandomElement(template.commonModules)}`,
    environment,
    errors: Math.random() > 0.7 ? [{
      type: 'js_no_source',
      symbolicator_type: 'missing_source',
      url: getRandomElement(template.commonModules)
    }] : [],
    exception: {
      values: [generateException(template)]
    },
    fingerprint: ['{{ default }}'],
    grouping_config: {
      enhancements: generateHex(100),
      id: 'newstyle:2023-01-11'
    },
    hashes: [generateHex(32), generateHex(32)],
    ingest_path: [{
      version: '25.7.0',
      public_key: generateHex(43)
    }],
    key_id: Math.floor(Math.random() * 10000000).toString(),
    level: template.level,
    location: getRandomElement(template.commonModules),
    logger: '',
    main_exception_id: 0,
    metadata: {
      filename: getRandomElement(template.commonModules),
      function: getRandomElement(template.commonFunctions),
      in_app_frame_mix: 'mixed',
      type: generateException(template).type,
      value: getRandomElement(template.commonMessages)
    },
    modules: {
      '@sentry/browser': '7.99.0',
      'react': '18.2.0',
      'typescript': '5.3.3',
      'vite': '5.0.10',
      'three': '0.160.0'
    },
    nodestore_insert: getTimestamp(date) + Math.random() * 100,
    received: getTimestamp(date),
    sdk: {
      name: template.platform === 'node' ? 'sentry.javascript.node' : 'sentry.javascript.browser',
      version: '7.99.0',
      integrations: [
        'InboundFilters',
        'FunctionToString', 
        'LinkedErrors',
        'Breadcrumbs',
        'GlobalHandlers',
        'HttpContext',
        'Dedupe'
      ],
      packages: [{
        name: `npm:@sentry/${template.platform === 'node' ? 'node' : 'browser'}`,
        version: '7.99.0'
      }]
    },
    symbolicated_in_app: false,
    timestamp: getTimestamp(date),
    title: `${generateException(template).type}: ${getRandomElement(template.commonMessages)}`,
    transaction: `${getRandomElement(['GET', 'POST', 'PUT', 'DELETE'])} /${errorType}-endpoint`,
    type: 'error',
    user: {
      ...user,
      ip_address: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    },
    version: '7'
  };
};

// Generate multiple envelopes of different types
export const generateSentryEnvelopes = (count: number = 50): SentryEnvelope[] => {
  const errorTypes: ErrorType[] = Object.keys(ERROR_TEMPLATES) as ErrorType[];
  const envelopes: SentryEnvelope[] = [];
  
  for (let i = 0; i < count; i++) {
    const errorType = getRandomElement(errorTypes);
    envelopes.push(generateSentryEnvelope(errorType));
  }
  
  // Sort by timestamp (most recent first)
  return envelopes.sort((a, b) => b.timestamp - a.timestamp);
};

// Generate envelopes for a specific error type
export const generateSentryEnvelopesForType = (errorType: ErrorType, count: number = 10): SentryEnvelope[] => {
  const envelopes: SentryEnvelope[] = [];
  
  for (let i = 0; i < count; i++) {
    envelopes.push(generateSentryEnvelope(errorType));
  }
  
  return envelopes.sort((a, b) => b.timestamp - a.timestamp);
};

// Get error type distribution for visualization
export const getErrorTypeDistribution = (envelopes: SentryEnvelope[]): Record<ErrorType, number> => {
  const distribution: Record<ErrorType, number> = {
    javascript: 0,
    network: 0,
    database: 0,
    authentication: 0,
    validation: 0,
    permission: 0,
    timeout: 0,
    memory: 0,
    syntax: 0
  };
  
  envelopes.forEach(envelope => {
    const errorType = envelope.exception?.values[0]?.type?.toLowerCase();
    if (errorType?.includes('type')) distribution.javascript++;
    else if (errorType?.includes('network') || errorType?.includes('fetch')) distribution.network++;
    else if (errorType?.includes('database') || errorType?.includes('query')) distribution.database++;
    else if (errorType?.includes('auth') || errorType?.includes('token')) distribution.authentication++;
    else if (errorType?.includes('validation') || errorType?.includes('schema')) distribution.validation++;
    else if (errorType?.includes('permission') || errorType?.includes('access')) distribution.permission++;
    else if (errorType?.includes('timeout') || errorType?.includes('abort')) distribution.timeout++;
    else if (errorType?.includes('memory') || errorType?.includes('heap')) distribution.memory++;
    else if (errorType?.includes('syntax') || errorType?.includes('parse')) distribution.syntax++;
    else distribution.javascript++; // default fallback
  });
  
  return distribution;
};
