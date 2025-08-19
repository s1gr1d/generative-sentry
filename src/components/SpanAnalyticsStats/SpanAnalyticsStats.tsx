import { useState, useMemo } from "react";
import { SPAN_ANALYTICS } from "@/utils/spanAnalytics";
import { SAMPLE_SPANS, SPANS_BY_OPERATION } from "@/data/sampleSpanData";
import {
	COLOR_PALETTE,
	PRIMARY_COLORS,
	SECONDARY_COLORS,
	TERTIARY_COLORS,
} from "@/utils/colorPalette";
import styles from "./SpanAnalyticsStats.module.css";

interface SpanAnalyticsStatsProps {
	className?: string;
}

const SpanAnalyticsStats = ({ className }: SpanAnalyticsStatsProps) => {
	const [activeTab, setActiveTab] = useState<"overview" | "operations" | "projects" | "insights">(
		"overview",
	);
	const [selectedOperation, setSelectedOperation] = useState<string | null>(null);

	const analytics = useMemo(() => SPAN_ANALYTICS, []);

	const formatDuration = (ms: number) => {
		if (ms < 1000) return `${Math.round(ms)}ms`;
		return `${(ms / 1000).toFixed(2)}s`;
	};

	const formatNumber = (num: number) => {
		return new Intl.NumberFormat().format(Math.round(num));
	};

	const getOperationColor = (operation: string) => {
		const colorMap: Record<string, string> = {
			"http.server": PRIMARY_COLORS.BLURPLE,
			"http.client": PRIMARY_COLORS.LT_BLURPLE,
			"ui.paint": SECONDARY_COLORS.DK_PINK,
			"ui.mount": SECONDARY_COLORS.LT_PINK,
			"ui.render": SECONDARY_COLORS.DK_ORANGE,
			"db.query": PRIMARY_COLORS.DK_VIOLET,
			"db.transaction": PRIMARY_COLORS.LT_VIOLET,
			"navigation.navigate": TERTIARY_COLORS.DK_BLUE,
			"function.call": TERTIARY_COLORS.LT_BLUE,
			"cache.get": TERTIARY_COLORS.DK_GREEN,
			"resource.script": SECONDARY_COLORS.DK_YELLOW,
			"auth.verify": TERTIARY_COLORS.LT_GREEN,
		};
		return colorMap[operation] || COLOR_PALETTE.RICH_BLACK;
	};

	const getSeverityColor = (severity: "low" | "medium" | "high") => {
		switch (severity) {
			case "high":
				return SECONDARY_COLORS.DK_PINK;
			case "medium":
				return SECONDARY_COLORS.DK_ORANGE;
			case "low":
				return TERTIARY_COLORS.DK_GREEN;
			default:
				return COLOR_PALETTE.RICH_BLACK;
		}
	};

	const renderOverview = () => (
		<div className={styles.overviewGrid}>
			<div className={styles.statCard}>
				<h3>Duration Statistics</h3>
				<div className={styles.statRow}>
					<span>Mean Duration:</span>
					<span className={styles.statValue}>{formatDuration(analytics.durationStats.mean)}</span>
				</div>
				<div className={styles.statRow}>
					<span>Median Duration:</span>
					<span className={styles.statValue}>{formatDuration(analytics.durationStats.median)}</span>
				</div>
				<div className={styles.statRow}>
					<span>95th Percentile:</span>
					<span className={styles.statValue}>
						{formatDuration(analytics.durationStats.percentiles.p95)}
					</span>
				</div>
				<div className={styles.statRow}>
					<span>Standard Deviation:</span>
					<span className={styles.statValue}>
						{formatDuration(analytics.durationStats.standardDeviation)}
					</span>
				</div>
			</div>

			<div className={styles.statCard}>
				<h3>Performance Distribution</h3>
				<div className={styles.distributionChart}>
					{Object.entries(analytics.durationStats.distribution).map(([category, count]) => {
						const percentage = (count / SAMPLE_SPANS.length) * 100;
						const colors = {
							fast: TERTIARY_COLORS.DK_GREEN,
							medium: SECONDARY_COLORS.DK_YELLOW,
							slow: SECONDARY_COLORS.DK_ORANGE,
							verySlow: SECONDARY_COLORS.DK_PINK,
						};

						return (
							<div key={category} className={styles.distributionItem}>
								<div className={styles.distributionLabel}>
									<span>{category}</span>
									<span>{count} spans</span>
								</div>
								<div className={styles.distributionBar}>
									<div
										className={styles.distributionFill}
										style={{
											width: `${percentage}%`,
											backgroundColor: colors[category as keyof typeof colors],
										}}
									/>
								</div>
								<span className={styles.distributionPercentage}>{percentage.toFixed(1)}%</span>
							</div>
						);
					})}
				</div>
			</div>

			<div className={styles.statCard}>
				<h3>Trace Analysis</h3>
				<div className={styles.statRow}>
					<span>Total Traces:</span>
					<span className={styles.statValue}>{formatNumber(50)}</span>
				</div>
				<div className={styles.statRow}>
					<span>Avg Spans per Trace:</span>
					<span className={styles.statValue}>{analytics.traceStats.avgSpansPerTrace}</span>
				</div>
				<div className={styles.statRow}>
					<span>Max Trace Depth:</span>
					<span className={styles.statValue}>{analytics.traceStats.avgTraceDepth}</span>
				</div>
				<div className={styles.statRow}>
					<span>Complexity Score:</span>
					<span className={styles.statValue}>{analytics.traceStats.hierarchyComplexity}</span>
				</div>
			</div>

			<div className={styles.statCard}>
				<h3>System Overview</h3>
				<div className={styles.statRow}>
					<span>Total Spans:</span>
					<span className={styles.statValue}>{formatNumber(SAMPLE_SPANS.length)}</span>
				</div>
				<div className={styles.statRow}>
					<span>Operation Types:</span>
					<span className={styles.statValue}>
						{Object.keys(analytics.operationStats.frequency).length}
					</span>
				</div>
				<div className={styles.statRow}>
					<span>Projects:</span>
					<span className={styles.statValue}>
						{Object.keys(analytics.projectStats.distribution).length}
					</span>
				</div>
				<div className={styles.statRow}>
					<span>Time Range:</span>
					<span className={styles.statValue}>
						{formatDuration(analytics.temporalStats.timeRange.duration)}
					</span>
				</div>
			</div>
		</div>
	);

	const renderOperations = () => (
		<div className={styles.operationsView}>
			<div className={styles.topOperations}>
				<h3>Top Operations by Impact</h3>
				<div className={styles.operationsList}>
					{analytics.operationStats.performanceRank.slice(0, 12).map((op, index) => (
						<div
							key={op.operation}
							className={`${styles.operationItem} ${selectedOperation === op.operation ? styles.selected : ""}`}
							onClick={() =>
								setSelectedOperation(selectedOperation === op.operation ? null : op.operation)
							}
							style={{ borderLeftColor: getOperationColor(op.operation) }}
						>
							<div className={styles.operationHeader}>
								<span className={styles.operationName}>{op.operation}</span>
								<span className={styles.operationRank}>#{index + 1}</span>
							</div>
							<div className={styles.operationStats}>
								<span>Avg: {formatDuration(op.avgDuration)}</span>
								<span>Count: {op.frequency}</span>
								<span>Impact: {formatNumber(op.impact)}</span>
							</div>
							<div className={styles.operationBar}>
								<div
									className={styles.operationBarFill}
									style={{
										width: `${(op.impact / analytics.operationStats.performanceRank[0].impact) * 100}%`,
										backgroundColor: getOperationColor(op.operation),
									}}
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			{selectedOperation && (
				<div className={styles.operationDetails}>
					<h3>Operation Details: {selectedOperation}</h3>
					<div className={styles.operationDetailStats}>
						<div className={styles.detailItem}>
							<span>Average Duration:</span>
							<span>
								{formatDuration(
									analytics.operationStats.avgDuration[
										selectedOperation as keyof typeof analytics.operationStats.avgDuration
									],
								)}
							</span>
						</div>
						<div className={styles.detailItem}>
							<span>Total Duration:</span>
							<span>
								{formatDuration(
									analytics.operationStats.totalDuration[
										selectedOperation as keyof typeof analytics.operationStats.totalDuration
									],
								)}
							</span>
						</div>
						<div className={styles.detailItem}>
							<span>Frequency:</span>
							<span>
								{
									analytics.operationStats.frequency[
										selectedOperation as keyof typeof analytics.operationStats.frequency
									]
								}{" "}
								calls
							</span>
						</div>
					</div>

					<div className={styles.operationSamples}>
						<h4>Sample Descriptions:</h4>
						<div className={styles.samplesList}>
							{SPANS_BY_OPERATION[selectedOperation as keyof typeof SPANS_BY_OPERATION]
								?.slice(0, 5)
								.map((span, index) => (
									<div key={index} className={styles.sampleItem}>
										<span className={styles.sampleDescription}>{span.description}</span>
										<span className={styles.sampleDuration}>{formatDuration(span.duration)}</span>
									</div>
								))}
						</div>
					</div>
				</div>
			)}
		</div>
	);

	const renderProjects = () => (
		<div className={styles.projectsView}>
			<div className={styles.projectGrid}>
				{Object.entries(analytics.projectStats.distribution).map(([project, count]) => {
					const avgDuration = analytics.projectStats.avgDuration[project];
					const percentage = (count / SAMPLE_SPANS.length) * 100;

					return (
						<div key={project} className={styles.projectCard}>
							<h4>{project}</h4>
							<div className={styles.projectStats}>
								<div className={styles.projectStat}>
									<span>Spans:</span>
									<span>
										{formatNumber(count)} ({percentage.toFixed(1)}%)
									</span>
								</div>
								<div className={styles.projectStat}>
									<span>Avg Duration:</span>
									<span>{formatDuration(avgDuration)}</span>
								</div>
							</div>

							<div className={styles.operationMix}>
								<h5>Operation Mix:</h5>
								{Object.entries(analytics.projectStats.operationMix[project] || {})
									.sort(([, a], [, b]) => b - a)
									.slice(0, 5)
									.map(([op, opCount]) => (
										<div key={op} className={styles.mixItem}>
											<span
												className={styles.mixColor}
												style={{ backgroundColor: getOperationColor(op) }}
											/>
											<span className={styles.mixOp}>{op}</span>
											<span className={styles.mixCount}>{opCount}</span>
										</div>
									))}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);

	const renderInsights = () => (
		<div className={styles.insightsView}>
			<div className={styles.insightsGrid}>
				<div className={styles.insightCard}>
					<h3>Performance Bottlenecks</h3>
					<div className={styles.bottlenecksList}>
						{analytics.insights.bottlenecks.map((bottleneck, index) => (
							<div key={index} className={styles.bottleneckItem}>
								<div className={styles.bottleneckHeader}>
									<span className={styles.bottleneckOp}>{bottleneck.operation}</span>
									<span
										className={styles.bottleneckSeverity}
										style={{ backgroundColor: getSeverityColor(bottleneck.severity) }}
									>
										{bottleneck.severity}
									</span>
								</div>
								<div className={styles.bottleneckReason}>{bottleneck.reason}</div>
								<div className={styles.bottleneckRecommendation}>
									<strong>Recommendation:</strong> {bottleneck.recommendation}
								</div>
							</div>
						))}
					</div>
				</div>

				<div className={styles.insightCard}>
					<h3>Common Patterns</h3>
					<div className={styles.patternsList}>
						{analytics.insights.patterns.map((pattern, index) => (
							<div key={index} className={styles.patternItem}>
								<h4>{pattern.name}</h4>
								<p>{pattern.description}</p>
								<div className={styles.patternOps}>
									{pattern.operations.map((op) => (
										<span
											key={op}
											className={styles.patternOp}
											style={{ backgroundColor: getOperationColor(op) }}
										>
											{op}
										</span>
									))}
								</div>
								<div className={styles.patternFreq}>Frequency: {pattern.frequency} occurrences</div>
							</div>
						))}
					</div>
				</div>

				<div className={styles.insightCard}>
					<h3>System Anomalies</h3>
					<div className={styles.anomaliesList}>
						{analytics.insights.anomalies.length > 0 ? (
							analytics.insights.anomalies.map((anomaly, index) => (
								<div key={index} className={styles.anomalyItem}>
									<div className={styles.anomalyType}>{anomaly.type}</div>
									<div className={styles.anomalyDescription}>{anomaly.description}</div>
									<div className={styles.anomalyAffected}>
										Affects {anomaly.affectedSpans} spans
									</div>
								</div>
							))
						) : (
							<div className={styles.noAnomalies}>
								No significant anomalies detected in the current dataset.
							</div>
						)}
					</div>
				</div>

				<div className={styles.insightCard}>
					<h3>Peak Activity Hours</h3>
					<div className={styles.hourlyChart}>
						{analytics.temporalStats.hourlyDistribution.map((count, hour) => {
							const maxCount = Math.max(...analytics.temporalStats.hourlyDistribution);
							const height = (count / maxCount) * 100;
							const isPeak = analytics.temporalStats.peakHours.includes(hour);

							return (
								<div key={hour} className={styles.hourBar}>
									<div
										className={`${styles.hourBarFill} ${isPeak ? styles.peakHour : ""}`}
										style={{
											height: `${height}%`,
											backgroundColor: isPeak
												? SECONDARY_COLORS.DK_PINK
												: PRIMARY_COLORS.LT_BLURPLE,
										}}
									/>
									<span className={styles.hourLabel}>{hour}h</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className={`${styles.container} ${className}`}>
			<div className={styles.header}>
				<h2>Span Analytics Dashboard</h2>
				<p>Real-time statistical analysis of performance span data</p>
			</div>

			<div className={styles.tabs}>
				{[
					{ id: "overview", label: "Overview" },
					{ id: "operations", label: "Operations" },
					{ id: "projects", label: "Projects" },
					{ id: "insights", label: "Insights" },
				].map((tab) => (
					<button
						key={tab.id}
						className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ""}`}
						onClick={() => setActiveTab(tab.id as typeof activeTab)}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className={styles.content}>
				{activeTab === "overview" && renderOverview()}
				{activeTab === "operations" && renderOperations()}
				{activeTab === "projects" && renderProjects()}
				{activeTab === "insights" && renderInsights()}
			</div>
		</div>
	);
};

export default SpanAnalyticsStats;
