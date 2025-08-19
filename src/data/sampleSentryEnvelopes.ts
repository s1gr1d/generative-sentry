import {
	generateSentryEnvelopes,
	generateSentryEnvelopesForType,
	getErrorTypeDistribution,
} from "@/utils/sentryDataGenerator";
import type { SentryEnvelope, ErrorType } from "@/types/sentryEnvelope";

// Generate a comprehensive dataset of 100 random error envelopes
export const SAMPLE_SENTRY_ENVELOPES: SentryEnvelope[] = generateSentryEnvelopes(100);

// Generate specific datasets for each error type (useful for focused testing)
export const JAVASCRIPT_ERRORS: SentryEnvelope[] = generateSentryEnvelopesForType("javascript", 15);
export const NETWORK_ERRORS: SentryEnvelope[] = generateSentryEnvelopesForType("network", 12);
export const DATABASE_ERRORS: SentryEnvelope[] = generateSentryEnvelopesForType("database", 10);
export const AUTHENTICATION_ERRORS: SentryEnvelope[] = generateSentryEnvelopesForType(
	"authentication",
	8,
);
export const VALIDATION_ERRORS: SentryEnvelope[] = generateSentryEnvelopesForType("validation", 10);
export const PERMISSION_ERRORS: SentryEnvelope[] = generateSentryEnvelopesForType("permission", 6);
export const TIMEOUT_ERRORS: SentryEnvelope[] = generateSentryEnvelopesForType("timeout", 8);
export const MEMORY_ERRORS: SentryEnvelope[] = generateSentryEnvelopesForType("memory", 5);
export const SYNTAX_ERRORS: SentryEnvelope[] = generateSentryEnvelopesForType("syntax", 7);

// Combined datasets for specific scenarios
export const CRITICAL_ERRORS: SentryEnvelope[] = [
	...MEMORY_ERRORS.filter((e) => e.level === "fatal"),
	...DATABASE_ERRORS.filter((e) => e.level === "error"),
	...AUTHENTICATION_ERRORS.filter((e) => e.environment === "production"),
];

export const PRODUCTION_ERRORS: SentryEnvelope[] = SAMPLE_SENTRY_ENVELOPES.filter(
	(envelope) => envelope.environment === "production",
);

export const RECENT_ERRORS: SentryEnvelope[] = SAMPLE_SENTRY_ENVELOPES.filter((envelope) => {
	const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
	return envelope.timestamp * 1000 > oneDayAgo;
}).slice(0, 20);

export const HIGH_FREQUENCY_ERRORS: SentryEnvelope[] = SAMPLE_SENTRY_ENVELOPES.slice(0, 30) // Most recent errors tend to be high frequency
	.map((envelope) => ({
		...envelope,
		// Add some metadata to indicate frequency
		_meta: {
			...envelope._meta,
			frequency: Math.floor(Math.random() * 50) + 10, // 10-60 occurrences
		},
	}));

// Error distribution analysis
export const ERROR_DISTRIBUTION = getErrorTypeDistribution(SAMPLE_SENTRY_ENVELOPES);

// Helper function to get errors by environment
export const getErrorsByEnvironment = (
	environment: "production" | "staging" | "development",
): SentryEnvelope[] => {
	return SAMPLE_SENTRY_ENVELOPES.filter((envelope) => envelope.environment === environment);
};

// Helper function to get errors by level
export const getErrorsByLevel = (level: SentryEnvelope["level"]): SentryEnvelope[] => {
	return SAMPLE_SENTRY_ENVELOPES.filter((envelope) => envelope.level === level);
};

// Helper function to get errors by platform
export const getErrorsByPlatform = (platform: string): SentryEnvelope[] => {
	return SAMPLE_SENTRY_ENVELOPES.filter((envelope) => envelope.platform === platform);
};

// Helper function to get errors in time range
export const getErrorsInTimeRange = (startTime: Date, endTime: Date): SentryEnvelope[] => {
	const startTimestamp = Math.floor(startTime.getTime() / 1000);
	const endTimestamp = Math.floor(endTime.getTime() / 1000);

	return SAMPLE_SENTRY_ENVELOPES.filter(
		(envelope) => envelope.timestamp >= startTimestamp && envelope.timestamp <= endTimestamp,
	);
};

// Grouped datasets for visualization
export const GROUPED_ERRORS_BY_TYPE: Record<ErrorType, SentryEnvelope[]> = {
	javascript: JAVASCRIPT_ERRORS,
	network: NETWORK_ERRORS,
	database: DATABASE_ERRORS,
	authentication: AUTHENTICATION_ERRORS,
	validation: VALIDATION_ERRORS,
	permission: PERMISSION_ERRORS,
	timeout: TIMEOUT_ERRORS,
	memory: MEMORY_ERRORS,
	syntax: SYNTAX_ERRORS,
};

export const GROUPED_ERRORS_BY_LEVEL: Record<SentryEnvelope["level"], SentryEnvelope[]> = {
	debug: getErrorsByLevel("debug"),
	info: getErrorsByLevel("info"),
	warning: getErrorsByLevel("warning"),
	error: getErrorsByLevel("error"),
	fatal: getErrorsByLevel("fatal"),
};

export const GROUPED_ERRORS_BY_ENVIRONMENT = {
	production: getErrorsByEnvironment("production"),
	staging: getErrorsByEnvironment("staging"),
	development: getErrorsByEnvironment("development"),
};

// Time-series data for trending analysis
export const generateTimeSeriesData = (
	days: number = 7,
): Array<{ date: string; errors: SentryEnvelope[] }> => {
	const result = [];
	const now = new Date();

	for (let i = days - 1; i >= 0; i--) {
		const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
		const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

		const errorsForDay = getErrorsInTimeRange(startOfDay, endOfDay);

		result.push({
			date: startOfDay.toISOString().split("T")[0],
			errors: errorsForDay,
		});
	}

	return result;
};

// Statistics and metrics
export const ERROR_STATISTICS = {
	total: SAMPLE_SENTRY_ENVELOPES.length,
	byLevel: GROUPED_ERRORS_BY_LEVEL,
	byEnvironment: GROUPED_ERRORS_BY_ENVIRONMENT,
	byType: GROUPED_ERRORS_BY_TYPE,
	distribution: ERROR_DISTRIBUTION,
	averageErrorsPerDay: Math.floor(SAMPLE_SENTRY_ENVELOPES.length / 7),
	mostCommonErrorType: Object.entries(ERROR_DISTRIBUTION).reduce((a, b) =>
		a[1] > b[1] ? a : b,
	)[0] as ErrorType,
	criticalErrorsCount: CRITICAL_ERRORS.length,
	productionErrorsCount: PRODUCTION_ERRORS.length,
};

// Export commonly used sample data
export const DEMO_ENVELOPE: SentryEnvelope = SAMPLE_SENTRY_ENVELOPES[0];

// Export a smaller dataset for quick testing
export const SMALL_SAMPLE: SentryEnvelope[] = SAMPLE_SENTRY_ENVELOPES.slice(0, 10);

// Export a large dataset for performance testing
export const LARGE_SAMPLE: SentryEnvelope[] = generateSentryEnvelopes(500);

export default SAMPLE_SENTRY_ENVELOPES;
