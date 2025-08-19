import type { SpanData, TraceData, SpanOperation } from "@/types/spanData";
import { SAMPLE_SPANS, SAMPLE_TRACES } from "@/data/sampleSpanData";

// Statistical analysis utilities for span data
export interface SpanAnalytics {
	// Duration Statistics
	durationStats: {
		mean: number;
		median: number;
		mode: number;
		standardDeviation: number;
		percentiles: {
			p25: number;
			p50: number;
			p75: number;
			p90: number;
			p95: number;
			p99: number;
		};
		distribution: {
			fast: number; // < 20ms
			medium: number; // 20-100ms
			slow: number; // 100-500ms
			verySlow: number; // > 500ms
		};
	};

	// Operation Analysis
	operationStats: {
		frequency: Record<SpanOperation, number>;
		avgDuration: Record<SpanOperation, number>;
		totalDuration: Record<SpanOperation, number>;
		performanceRank: Array<{
			operation: SpanOperation;
			avgDuration: number;
			frequency: number;
			impact: number; // frequency * avgDuration
		}>;
	};

	// Project Analysis
	projectStats: {
		distribution: Record<string, number>;
		avgDuration: Record<string, number>;
		operationMix: Record<string, Record<SpanOperation, number>>;
	};

	// Temporal Analysis
	temporalStats: {
		timeRange: {
			start: number;
			end: number;
			duration: number;
		};
		hourlyDistribution: number[];
		peakHours: number[];
		trends: {
			increasingOperations: SpanOperation[];
			decreasingOperations: SpanOperation[];
		};
	};

	// Trace Analysis
	traceStats: {
		avgSpansPerTrace: number;
		maxSpansPerTrace: number;
		avgTraceDepth: number;
		avgTraceDuration: number;
		hierarchyComplexity: number;
	};

	// Performance Insights
	insights: {
		bottlenecks: Array<{
			operation: SpanOperation;
			reason: string;
			severity: "low" | "medium" | "high";
			recommendation: string;
		}>;
		patterns: Array<{
			name: string;
			description: string;
			operations: SpanOperation[];
			frequency: number;
		}>;
		anomalies: Array<{
			type: "duration" | "frequency" | "timing";
			description: string;
			affectedSpans: number;
		}>;
	};
}

// Helper functions for statistical calculations
const calculatePercentile = (values: number[], percentile: number): number => {
	const sorted = [...values].sort((a, b) => a - b);
	const index = (percentile / 100) * (sorted.length - 1);
	const lower = Math.floor(index);
	const upper = Math.ceil(index);
	const weight = index % 1;

	if (upper >= sorted.length) return sorted[sorted.length - 1];
	return sorted[lower] * (1 - weight) + sorted[upper] * weight;
};

const calculateStandardDeviation = (values: number[], mean: number): number => {
	const squaredDiffs = values.map((value) => Math.pow(value - mean, 2));
	const avgSquaredDiff = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
	return Math.sqrt(avgSquaredDiff);
};

const findMode = (values: number[]): number => {
	const frequency = new Map<number, number>();
	values.forEach((value) => {
		const rounded = Math.round(value / 10) * 10; // Round to nearest 10ms for mode calculation
		frequency.set(rounded, (frequency.get(rounded) || 0) + 1);
	});

	let maxFreq = 0;
	let mode = 0;
	frequency.forEach((freq, value) => {
		if (freq > maxFreq) {
			maxFreq = freq;
			mode = value;
		}
	});

	return mode;
};

// Main analytics function
export const analyzeSpanData = (
	spans: SpanData[] = SAMPLE_SPANS,
	traces: TraceData[] = SAMPLE_TRACES,
): SpanAnalytics => {
	const durations = spans.map((span) => span.duration);
	const mean = durations.reduce((sum, d) => sum + d, 0) / durations.length;
	const median = calculatePercentile(durations, 50);
	const mode = findMode(durations);
	const standardDeviation = calculateStandardDeviation(durations, mean);

	// Duration distribution
	const fastSpans = spans.filter((s) => s.duration < 20).length;
	const mediumSpans = spans.filter((s) => s.duration >= 20 && s.duration < 100).length;
	const slowSpans = spans.filter((s) => s.duration >= 100 && s.duration < 500).length;
	const verySlowSpans = spans.filter((s) => s.duration >= 500).length;

	// Operation statistics
	const operationFreq: Record<string, number> = {};
	const operationDurations: Record<string, number[]> = {};

	spans.forEach((span) => {
		operationFreq[span.op] = (operationFreq[span.op] || 0) + 1;
		if (!operationDurations[span.op]) operationDurations[span.op] = [];
		operationDurations[span.op].push(span.duration);
	});

	const operationAvgDuration: Record<SpanOperation, number> = {} as Record<SpanOperation, number>;
	const operationTotalDuration: Record<SpanOperation, number> = {} as Record<SpanOperation, number>;

	Object.entries(operationDurations).forEach(([op, durations]) => {
		const operation = op as SpanOperation;
		operationAvgDuration[operation] = durations.reduce((sum, d) => sum + d, 0) / durations.length;
		operationTotalDuration[operation] = durations.reduce((sum, d) => sum + d, 0);
	});

	// Performance ranking
	const performanceRank = Object.entries(operationFreq)
		.map(([op, freq]) => {
			const operation = op as SpanOperation;
			const avgDuration = operationAvgDuration[operation];
			return {
				operation,
				avgDuration,
				frequency: freq,
				impact: freq * avgDuration,
			};
		})
		.sort((a, b) => b.impact - a.impact);

	// Project statistics
	const projectFreq: Record<string, number> = {};
	const projectDurations: Record<string, number[]> = {};
	const projectOperations: Record<string, Record<string, number>> = {};

	spans.forEach((span) => {
		const projectName = span.project.name;
		projectFreq[projectName] = (projectFreq[projectName] || 0) + 1;

		if (!projectDurations[projectName]) projectDurations[projectName] = [];
		projectDurations[projectName].push(span.duration);

		if (!projectOperations[projectName]) projectOperations[projectName] = {};
		projectOperations[projectName][span.op] = (projectOperations[projectName][span.op] || 0) + 1;
	});

	const projectAvgDuration: Record<string, number> = {};
	Object.entries(projectDurations).forEach(([project, durations]) => {
		projectAvgDuration[project] = durations.reduce((sum, d) => sum + d, 0) / durations.length;
	});

	// Temporal analysis
	const timestamps = spans.map((span) => span.start_timestamp);
	const timeRange = {
		start: Math.min(...timestamps),
		end: Math.max(...timestamps),
		duration: Math.max(...timestamps) - Math.min(...timestamps),
	};

	// Hourly distribution
	const hourlyDistribution = new Array(24).fill(0);
	spans.forEach((span) => {
		const hour = new Date(span.start_timestamp).getHours();
		hourlyDistribution[hour]++;
	});

	const peakHours = hourlyDistribution
		.map((count, hour) => ({ hour, count }))
		.sort((a, b) => b.count - a.count)
		.slice(0, 3)
		.map((item) => item.hour);

	// Trace analysis
	const spansPerTrace = traces.map((trace) => trace.spans.length);
	const avgSpansPerTrace = spansPerTrace.reduce((sum, count) => sum + count, 0) / traces.length;
	const maxSpansPerTrace = Math.max(...spansPerTrace);

	const traceDurations = traces.map((trace) => trace.duration);
	const avgTraceDuration = traceDurations.reduce((sum, d) => sum + d, 0) / traces.length;

	// Calculate average trace depth (max nesting level)
	const traceDepths = traces.map((trace) => {
		const depthMap = new Map<string, number>();
		trace.spans.forEach((span) => {
			if (!span.parent_span_id) {
				depthMap.set(span.span_id, 0);
			} else {
				const parentDepth = depthMap.get(span.parent_span_id) || 0;
				depthMap.set(span.span_id, parentDepth + 1);
			}
		});
		return Math.max(...Array.from(depthMap.values()));
	});
	const avgTraceDepth = traceDepths.reduce((sum, depth) => sum + depth, 0) / traces.length;

	// Complexity metric (avg spans * avg depth)
	const hierarchyComplexity = avgSpansPerTrace * avgTraceDepth;

	// Performance insights
	const bottlenecks = performanceRank.slice(0, 5).map((item) => {
		let severity: "low" | "medium" | "high" = "low";
		let reason = "";
		let recommendation = "";

		if (item.avgDuration > 500) {
			severity = "high";
			reason = `Very slow average duration (${Math.round(item.avgDuration)}ms)`;
			recommendation = "Optimize operation or consider caching";
		} else if (item.impact > 10000) {
			severity = "medium";
			reason = `High total impact (${Math.round(item.impact)}ms across ${item.frequency} calls)`;
			recommendation = "Focus on frequency reduction or duration optimization";
		} else {
			severity = "low";
			reason = `Moderate performance impact`;
			recommendation = "Monitor for trends";
		}

		return {
			operation: item.operation,
			reason,
			severity,
			recommendation,
		};
	});

	// Common patterns
	const patterns = [
		{
			name: "HTTP Request Chain",
			description: "Server requests followed by client requests",
			operations: ["http.server", "http.client"] as SpanOperation[],
			frequency: Math.min(operationFreq["http.server"] || 0, operationFreq["http.client"] || 0),
		},
		{
			name: "UI Rendering Flow",
			description: "Mount -> Render -> Paint sequence",
			operations: ["ui.mount", "ui.render", "ui.paint"] as SpanOperation[],
			frequency: Math.min(
				operationFreq["ui.mount"] || 0,
				operationFreq["ui.render"] || 0,
				operationFreq["ui.paint"] || 0,
			),
		},
		{
			name: "Database Transaction",
			description: "Connection -> Query -> Transaction",
			operations: ["db.connection", "db.query", "db.transaction"] as SpanOperation[],
			frequency: Math.min(operationFreq["db.connection"] || 0, operationFreq["db.query"] || 0),
		},
	];

	// Anomaly detection
	const anomalies = [];

	// Duration anomalies (spans that are 3+ standard deviations from mean)
	const durationOutliers = spans.filter(
		(span) => Math.abs(span.duration - mean) > 3 * standardDeviation,
	).length;

	if (durationOutliers > 0) {
		anomalies.push({
			type: "duration" as const,
			description: `${durationOutliers} spans with unusual duration patterns`,
			affectedSpans: durationOutliers,
		});
	}

	// Frequency anomalies (operations with very low frequency)
	const lowFreqOps = Object.entries(operationFreq).filter(([_, freq]) => freq < 3).length;
	if (lowFreqOps > 0) {
		anomalies.push({
			type: "frequency" as const,
			description: `${lowFreqOps} operations with very low frequency`,
			affectedSpans: lowFreqOps,
		});
	}

	return {
		durationStats: {
			mean: Math.round(mean * 100) / 100,
			median: Math.round(median * 100) / 100,
			mode,
			standardDeviation: Math.round(standardDeviation * 100) / 100,
			percentiles: {
				p25: Math.round(calculatePercentile(durations, 25) * 100) / 100,
				p50: Math.round(calculatePercentile(durations, 50) * 100) / 100,
				p75: Math.round(calculatePercentile(durations, 75) * 100) / 100,
				p90: Math.round(calculatePercentile(durations, 90) * 100) / 100,
				p95: Math.round(calculatePercentile(durations, 95) * 100) / 100,
				p99: Math.round(calculatePercentile(durations, 99) * 100) / 100,
			},
			distribution: {
				fast: fastSpans,
				medium: mediumSpans,
				slow: slowSpans,
				verySlow: verySlowSpans,
			},
		},
		operationStats: {
			frequency: operationFreq as Record<SpanOperation, number>,
			avgDuration: operationAvgDuration,
			totalDuration: operationTotalDuration,
			performanceRank,
		},
		projectStats: {
			distribution: projectFreq,
			avgDuration: projectAvgDuration,
			operationMix: projectOperations as Record<string, Record<SpanOperation, number>>,
		},
		temporalStats: {
			timeRange,
			hourlyDistribution,
			peakHours,
			trends: {
				increasingOperations: [],
				decreasingOperations: [],
			},
		},
		traceStats: {
			avgSpansPerTrace: Math.round(avgSpansPerTrace * 100) / 100,
			maxSpansPerTrace,
			avgTraceDepth: Math.round(avgTraceDepth * 100) / 100,
			avgTraceDuration: Math.round(avgTraceDuration * 100) / 100,
			hierarchyComplexity: Math.round(hierarchyComplexity * 100) / 100,
		},
		insights: {
			bottlenecks,
			patterns,
			anomalies,
		},
	};
};

// Real-time analytics updates
export const getAnalyticsUpdate = (spans: SpanData[]): Partial<SpanAnalytics> => {
	const recentSpans = spans.filter(
		(span) => span.start_timestamp > Date.now() - 5 * 60 * 1000, // Last 5 minutes
	);

	if (recentSpans.length === 0) return {};

	return analyzeSpanData(recentSpans);
};

// Export pre-computed analytics for the sample data
export const SPAN_ANALYTICS = analyzeSpanData();
