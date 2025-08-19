// Span Data Types for Performance Tracing Visualization

export interface SpanData {
  span_id: string;
  trace_id: string;
  parent_span_id?: string;
  description: string;
  op: string;
  duration: number; // Duration in milliseconds
  start_timestamp: number;
  end_timestamp: number;
  project: {
    name: string;
    id: string;
  };
  tags?: Record<string, string>;
  data?: Record<string, any>;
  status: 'ok' | 'cancelled' | 'internal_error' | 'invalid_argument' | 'deadline_exceeded' | 'not_found' | 'already_exists' | 'permission_denied' | 'resource_exhausted' | 'failed_precondition' | 'aborted' | 'out_of_range' | 'unimplemented' | 'unknown' | 'unauthenticated';
}

export interface TraceData {
  trace_id: string;
  spans: SpanData[];
  duration: number;
  start_timestamp: number;
  end_timestamp: number;
  project: {
    name: string;
    id: string;
  };
}

export type SpanOperation = 
  // HTTP Operations
  | 'http.server'
  | 'http.client'
  // Database Operations
  | 'db.query'
  | 'db.transaction'
  | 'db.connection'
  // UI Operations
  | 'ui.mount'
  | 'ui.render'
  | 'ui.paint'
  | 'ui.interaction'
  // Navigation Operations
  | 'navigation.navigate'
  | 'navigation.load'
  // Resource Operations
  | 'resource.script'
  | 'resource.stylesheet'
  | 'resource.image'
  | 'resource.font'
  // Function Operations
  | 'function.call'
  | 'function.async'
  // File Operations
  | 'file.read'
  | 'file.write'
  | 'file.upload'
  // Cache Operations
  | 'cache.get'
  | 'cache.set'
  | 'cache.miss'
  // Authentication Operations
  | 'auth.login'
  | 'auth.verify'
  | 'auth.logout'
  // Processing Operations
  | 'process.data'
  | 'process.image'
  | 'process.video';

export interface ProjectInfo {
  name: string;
  id: string;
  type: 'frontend' | 'backend' | 'mobile' | 'fullstack';
  technology: string[];
}
