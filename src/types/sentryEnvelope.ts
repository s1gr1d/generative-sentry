// Sentry Envelope Type Definitions

export interface SentryTag {
  0: string;
  1: string;
}

export interface SentryFrame {
  function?: string;
  module?: string;
  filename?: string;
  abs_path?: string;
  lineno?: number;
  colno?: number;
  pre_context?: string[];
  context_line?: string;
  post_context?: string[];
  in_app?: boolean;
  data?: {
    client_in_app?: boolean;
    symbolicated?: boolean;
  };
}

export interface SentryStacktrace {
  frames: SentryFrame[];
}

export interface SentryException {
  type: string;
  value: string;
  stacktrace?: SentryStacktrace;
  raw_stacktrace?: SentryStacktrace;
  mechanism?: {
    type: string;
    handled: boolean;
    source?: string;
    exception_id?: number;
    parent_id?: number;
  };
}

export interface SentryContext {
  app?: {
    app_start_time?: string;
    app_memory?: number;
    free_memory?: number;
    type: string;
  };
  cloud_resource?: {
    type: string;
  };
  culture?: {
    locale?: string;
    timezone?: string;
    type: string;
  };
  device?: {
    arch?: string;
    memory_size?: number;
    free_memory?: number;
    boot_time?: string;
    processor_count?: number;
    cpu_description?: string;
    processor_frequency?: number;
    type: string;
  };
  os?: {
    os?: string;
    name?: string;
    version?: string;
    build?: string;
    kernel_version?: string;
    type: string;
  };
  runtime?: {
    runtime?: string;
    name?: string;
    version?: string;
    type: string;
  };
  trace?: {
    trace_id?: string;
    span_id?: string;
    status?: string;
    type: string;
  };
  browser?: {
    name?: string;
    version?: string;
    type: string;
  };
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
}

export interface SentryError {
  type: string;
  symbolicator_type?: string;
  url?: string;
  message?: string;
}

export interface SentrySDK {
  name: string;
  version: string;
  integrations?: string[];
  packages?: Array<{
    name: string;
    version: string;
  }>;
}

export interface SentryUser {
  id?: string;
  email?: string;
  username?: string;
  ip_address?: string;
  geo?: {
    country_code?: string;
    city?: string;
    subdivision?: string;
    region?: string;
  };
}

export interface SentryEnvelope {
  event_id: string;
  project: number;
  release?: string | null;
  dist?: string | null;
  platform: string;
  message: string;
  datetime: string;
  tags: SentryTag[];
  _dsc?: {
    environment?: string;
    org_id?: string;
    public_key?: string;
    release?: string | null;
    replay_id?: string | null;
    trace_id?: string;
    transaction?: string | null;
  };
  _meta?: Record<string, any>;
  _metrics?: {
    bytes_ingested_event?: number;
    bytes_stored_event?: number;
  };
  contexts: SentryContext;
  culprit?: string;
  environment: string;
  errors?: SentryError[];
  exception?: {
    values: SentryException[];
  };
  fingerprint?: string[];
  grouping_config?: {
    enhancements?: string;
    id?: string;
  };
  hashes?: string[];
  ingest_path?: Array<{
    version?: string;
    public_key?: string;
  }>;
  key_id?: string;
  level: 'debug' | 'info' | 'warning' | 'error' | 'fatal';
  location?: string;
  logger?: string;
  main_exception_id?: number;
  metadata?: {
    filename?: string;
    function?: string;
    in_app_frame_mix?: string;
    type?: string;
    value?: string;
  };
  modules?: Record<string, string>;
  nodestore_insert?: number;
  received?: number;
  sdk: SentrySDK;
  symbolicated_in_app?: boolean;
  timestamp: number;
  title: string;
  transaction?: string;
  type: 'error' | 'transaction' | 'event';
  user?: SentryUser;
  version: string;
}

export type ErrorType = 
  | 'javascript'
  | 'network'
  | 'database'
  | 'authentication'
  | 'validation'
  | 'permission'
  | 'timeout'
  | 'memory'
  | 'syntax';

export interface ErrorTemplate {
  type: ErrorType;
  platform: string;
  level: SentryEnvelope['level'];
  commonMessages: string[];
  commonFunctions: string[];
  commonModules: string[];
  environments: string[];
}
