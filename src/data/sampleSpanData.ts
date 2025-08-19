import { generateTraces, generateSpansForOperation, getProjects } from "@/utils/spanDataGenerator";
import type { SpanData, TraceData, SpanOperation } from "@/types/spanData";

// Generate comprehensive sample data for art visualization
export const SAMPLE_TRACES: TraceData[] = generateTraces(50);

// Extract all spans from traces for easy access
export const SAMPLE_SPANS: SpanData[] = SAMPLE_TRACES.flatMap((trace) => trace.spans);

// Generate specific datasets for popular operations (great for visualization patterns)
export const HTTP_SERVER_SPANS: SpanData[] = generateSpansForOperation("http.server", 25);
export const HTTP_CLIENT_SPANS: SpanData[] = generateSpansForOperation("http.client", 20);
export const UI_PAINT_SPANS: SpanData[] = generateSpansForOperation("ui.paint", 30);
export const UI_MOUNT_SPANS: SpanData[] = generateSpansForOperation("ui.mount", 15);
export const DB_QUERY_SPANS: SpanData[] = generateSpansForOperation("db.query", 18);
export const UI_RENDER_SPANS: SpanData[] = generateSpansForOperation("ui.render", 25);

// Create grouped datasets by operation for easy visualization
export const SPANS_BY_OPERATION: Record<SpanOperation, SpanData[]> = {
	"http.server": HTTP_SERVER_SPANS,
	"http.client": HTTP_CLIENT_SPANS,
	"ui.paint": UI_PAINT_SPANS,
	"ui.mount": UI_MOUNT_SPANS,
	"db.query": DB_QUERY_SPANS,
	"ui.render": UI_RENDER_SPANS,
	"navigation.navigate": generateSpansForOperation("navigation.navigate", 12),
	"resource.script": generateSpansForOperation("resource.script", 10),
	"function.call": generateSpansForOperation("function.call", 20),
	"cache.get": generateSpansForOperation("cache.get", 15),
	"db.transaction": generateSpansForOperation("db.transaction", 8),
	"resource.image": generateSpansForOperation("resource.image", 10),
	"auth.verify": generateSpansForOperation("auth.verify", 12),
	"ui.interaction": generateSpansForOperation("ui.interaction", 18),
	"navigation.load": generateSpansForOperation("navigation.load", 8),
	"resource.stylesheet": generateSpansForOperation("resource.stylesheet", 6),
	"cache.set": generateSpansForOperation("cache.set", 10),
	"process.data": generateSpansForOperation("process.data", 5),
	"db.connection": generateSpansForOperation("db.connection", 5),
	"resource.font": generateSpansForOperation("resource.font", 6),
	"function.async": generateSpansForOperation("function.async", 4),
	"file.read": generateSpansForOperation("file.read", 8),
	"cache.miss": generateSpansForOperation("cache.miss", 12),
	"auth.login": generateSpansForOperation("auth.login", 6),
	"auth.logout": generateSpansForOperation("auth.logout", 4),
	"file.write": generateSpansForOperation("file.write", 5),
	"file.upload": generateSpansForOperation("file.upload", 3),
	"process.image": generateSpansForOperation("process.image", 4),
	"process.video": generateSpansForOperation("process.video", 2),
};

// Create datasets grouped by common descriptions (for pattern visualization)
export const HOMEPAGE_SPANS: SpanData[] = [
	...HTTP_SERVER_SPANS.filter((span) => span.description === "GET /homepage"),
	...HTTP_CLIENT_SPANS.filter(
		(span) => span.description.includes("homepage") || span.description.includes("GET /"),
	),
	...UI_PAINT_SPANS.filter((span) => span.description === "Paint Dashboard"),
	...UI_RENDER_SPANS.filter((span) => span.description === "Render App Component"),
];

export const LOGIN_SPANS: SpanData[] = [
	...HTTP_SERVER_SPANS.filter((span) => span.description === "POST /api/login"),
	...generateSpansForOperation("auth.login", 8),
	...generateSpansForOperation("auth.verify", 6),
	...UI_MOUNT_SPANS.filter((span) => span.description === "Mount User Profile"),
];

export const DASHBOARD_SPANS: SpanData[] = [
	...HTTP_SERVER_SPANS.filter((span) => span.description === "GET /dashboard"),
	...UI_PAINT_SPANS.filter((span) => span.description === "Paint Dashboard"),
	...UI_MOUNT_SPANS.filter((span) => span.description === "Mount Dashboard Component"),
	...DB_QUERY_SPANS.filter(
		(span) => span.description.includes("SELECT") && span.description.includes("projects"),
	),
];

export const API_SPANS: SpanData[] = [
	...HTTP_SERVER_SPANS.filter((span) => span.description.startsWith("GET /api/")),
	...HTTP_SERVER_SPANS.filter((span) => span.description.startsWith("POST /api/")),
	...HTTP_CLIENT_SPANS.filter((span) => span.description.includes("/api/")),
];

// Performance-focused datasets (good for visualizing duration patterns)
export const FAST_SPANS: SpanData[] = SAMPLE_SPANS.filter((span) => span.duration < 20);
export const MEDIUM_SPANS: SpanData[] = SAMPLE_SPANS.filter(
	(span) => span.duration >= 20 && span.duration < 100,
);
export const SLOW_SPANS: SpanData[] = SAMPLE_SPANS.filter(
	(span) => span.duration >= 100 && span.duration < 500,
);
export const VERY_SLOW_SPANS: SpanData[] = SAMPLE_SPANS.filter((span) => span.duration >= 500);

// Project-specific datasets
export const FRONTEND_SPANS: SpanData[] = SAMPLE_SPANS.filter(
	(span) =>
		span.project.name === "Sentry Dashboard" ||
		span.project.name === "Mobile App" ||
		span.op.startsWith("ui.") ||
		span.op.startsWith("resource."),
);

export const BACKEND_SPANS: SpanData[] = SAMPLE_SPANS.filter(
	(span) =>
		span.project.name === "API Gateway" ||
		span.project.name === "User Service" ||
		span.project.name === "Analytics Engine" ||
		span.op.startsWith("db.") ||
		span.op.startsWith("http.server"),
);

// Environment-specific datasets
export const PRODUCTION_SPANS: SpanData[] = SAMPLE_SPANS.filter(
	(span) => span.tags?.environment === "production",
);
export const STAGING_SPANS: SpanData[] = SAMPLE_SPANS.filter(
	(span) => span.tags?.environment === "staging",
);
export const DEVELOPMENT_SPANS: SpanData[] = SAMPLE_SPANS.filter(
	(span) => span.tags?.environment === "development",
);

// Status-based datasets
export const SUCCESS_SPANS: SpanData[] = SAMPLE_SPANS.filter((span) => span.status === "ok");
export const ERROR_SPANS: SpanData[] = SAMPLE_SPANS.filter((span) => span.status !== "ok");

// Time-based datasets (for temporal visualization)
export const RECENT_SPANS: SpanData[] = SAMPLE_SPANS.sort(
	(a, b) => b.start_timestamp - a.start_timestamp,
).slice(0, 100);

export const FREQUENT_OPERATIONS: SpanData[] = [
	...HTTP_SERVER_SPANS.slice(0, 15),
	...UI_PAINT_SPANS.slice(0, 15),
	...HTTP_CLIENT_SPANS.slice(0, 10),
	...DB_QUERY_SPANS.slice(0, 10),
	...UI_RENDER_SPANS.slice(0, 10),
];

// Combined datasets for complex visualizations
export const ALL_HTTP_SPANS: SpanData[] = [...HTTP_SERVER_SPANS, ...HTTP_CLIENT_SPANS];
export const ALL_UI_SPANS: SpanData[] = [...UI_PAINT_SPANS, ...UI_MOUNT_SPANS, ...UI_RENDER_SPANS];
export const ALL_DB_SPANS: SpanData[] = [
	...DB_QUERY_SPANS,
	...SPANS_BY_OPERATION["db.transaction"],
	...SPANS_BY_OPERATION["db.connection"],
];
export const ALL_CACHE_SPANS: SpanData[] = [
	...SPANS_BY_OPERATION["cache.get"],
	...SPANS_BY_OPERATION["cache.set"],
	...SPANS_BY_OPERATION["cache.miss"],
];

// Statistics and metrics for data exploration
export const SPAN_STATISTICS = {
	total: SAMPLE_SPANS.length,
	traces: SAMPLE_TRACES.length,
	operations: Object.keys(SPANS_BY_OPERATION),
	projects: getProjects(),
	averageDuration: Math.round(
		SAMPLE_SPANS.reduce((sum, span) => sum + span.duration, 0) / SAMPLE_SPANS.length,
	),
	maxDuration: Math.max(...SAMPLE_SPANS.map((span) => span.duration)),
	minDuration: Math.min(...SAMPLE_SPANS.map((span) => span.duration)),
	successRate: Math.round((SUCCESS_SPANS.length / SAMPLE_SPANS.length) * 100),
	environments: ["production", "staging", "development"],
	timeRange: {
		start: Math.min(...SAMPLE_SPANS.map((span) => span.start_timestamp)),
		end: Math.max(...SAMPLE_SPANS.map((span) => span.end_timestamp)),
	},
};

// Helper functions for data exploration
export const getSpansByProject = (projectName: string): SpanData[] => {
	return SAMPLE_SPANS.filter((span) => span.project.name === projectName);
};

export const getSpansByOperation = (operation: SpanOperation): SpanData[] => {
	return SPANS_BY_OPERATION[operation] || [];
};

export const getSpansByDescription = (description: string): SpanData[] => {
	return SAMPLE_SPANS.filter((span) => span.description.includes(description));
};

export const getSpansByDurationRange = (minMs: number, maxMs: number): SpanData[] => {
	return SAMPLE_SPANS.filter((span) => span.duration >= minMs && span.duration <= maxMs);
};

export const getSpansInTimeRange = (startTime: number, endTime: number): SpanData[] => {
	return SAMPLE_SPANS.filter(
		(span) => span.start_timestamp >= startTime && span.end_timestamp <= endTime,
	);
};

// Export for easy access to most common datasets
export const POPULAR_DATASETS = {
	allSpans: SAMPLE_SPANS,
	allTraces: SAMPLE_TRACES,
	httpSpans: ALL_HTTP_SPANS,
	uiSpans: ALL_UI_SPANS,
	databaseSpans: ALL_DB_SPANS,
	fastSpans: FAST_SPANS,
	slowSpans: SLOW_SPANS,
	frontendSpans: FRONTEND_SPANS,
	backendSpans: BACKEND_SPANS,
	homepageSpans: HOMEPAGE_SPANS,
	loginSpans: LOGIN_SPANS,
	dashboardSpans: DASHBOARD_SPANS,
	frequentOperations: FREQUENT_OPERATIONS,
};

// Default export for convenience
export default SAMPLE_SPANS;
