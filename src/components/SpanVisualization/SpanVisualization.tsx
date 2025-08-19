import { useState, Suspense } from "react";
import SpanAnalyticsStats from "@/components/SpanAnalyticsStats";
import SpanVisualizationCanvas from "./SpanVisualizationCanvas";
import { SPAN_ANALYTICS } from "@/utils/spanAnalytics";
import { SAMPLE_SPANS } from "@/data/sampleSpanData";
import { PRIMARY_COLORS, TERTIARY_COLORS } from "@/utils/colorPalette";
import styles from "./SpanVisualization.module.css";

interface SpanVisualizationProps {
	className?: string;
}

const LoadingSpinner = () => (
	<div className={styles.loadingContainer}>
		<div className={styles.spinner}></div>
		<p>Loading span visualization...</p>
		<div className={styles.loadingStats}>
			<span>Analyzing {SAMPLE_SPANS.length} spans</span>
			<span>
				Processing {Object.keys(SPAN_ANALYTICS.operationStats.frequency).length} operation types
			</span>
			<span>Rendering 3D topology...</span>
		</div>
	</div>
);

const SpanVisualization = ({ className }: SpanVisualizationProps) => {
	const [activeView, setActiveView] = useState<"combined" | "analytics" | "visualization">(
		"combined",
	);
	const [showInstructions, setShowInstructions] = useState(true);

	const formatNumber = (num: number) => {
		return new Intl.NumberFormat().format(Math.round(num));
	};

	const formatDuration = (ms: number) => {
		if (ms < 1000) return `${Math.round(ms)}ms`;
		return `${(ms / 1000).toFixed(2)}s`;
	};

	return (
		<div className={`${styles.container} ${className}`}>
			{/* Header Section */}
			<div className={styles.header}>
				<div className={styles.headerContent}>
					<h1>Performance Span Visualization</h1>
					<p className={styles.subtitle}>
						Interactive 3D exploration of distributed tracing data and performance analytics
					</p>

					<div className={styles.quickStats}>
						<div className={styles.quickStat}>
							<span className={styles.statNumber}>{formatNumber(SAMPLE_SPANS.length)}</span>
							<span className={styles.statLabel}>Total Spans</span>
						</div>
						<div className={styles.quickStat}>
							<span className={styles.statNumber}>
								{formatDuration(SPAN_ANALYTICS.durationStats.mean)}
							</span>
							<span className={styles.statLabel}>Avg Duration</span>
						</div>
						<div className={styles.quickStat}>
							<span className={styles.statNumber}>
								{Object.keys(SPAN_ANALYTICS.operationStats.frequency).length}
							</span>
							<span className={styles.statLabel}>Operations</span>
						</div>
						<div className={styles.quickStat}>
							<span className={styles.statNumber}>
								{Object.keys(SPAN_ANALYTICS.projectStats.distribution).length}
							</span>
							<span className={styles.statLabel}>Projects</span>
						</div>
					</div>
				</div>

				{/* View Controls */}
				<div className={styles.viewControls}>
					<button
						className={`${styles.viewButton} ${activeView === "combined" ? styles.active : ""}`}
						onClick={() => setActiveView("combined")}
					>
						Combined View
					</button>
					<button
						className={`${styles.viewButton} ${activeView === "analytics" ? styles.active : ""}`}
						onClick={() => setActiveView("analytics")}
					>
						Analytics Only
					</button>
					<button
						className={`${styles.viewButton} ${activeView === "visualization" ? styles.active : ""}`}
						onClick={() => setActiveView("visualization")}
					>
						3D Visualization
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div className={styles.content}>
				{(activeView === "combined" || activeView === "visualization") && (
					<div className={styles.visualizationSection}>
						<div className={styles.canvasHeader}>
							<h2>3D Span Topology</h2>
							<p>
								Each particle represents a performance span, positioned by operation type and
								duration
							</p>
						</div>

						<Suspense fallback={<LoadingSpinner />}>
							<SpanVisualizationCanvas />
						</Suspense>

						<div className={styles.visualizationLegend}>
							<div className={styles.legendSection}>
								<h4>Performance Layers</h4>
								<div className={styles.legendItems}>
									<div className={styles.legendItem}>
										<div
											className={styles.legendColor}
											style={{ backgroundColor: TERTIARY_COLORS.DK_GREEN }}
										></div>
										<span>Fast (&lt;20ms)</span>
									</div>
									<div className={styles.legendItem}>
										<div
											className={styles.legendColor}
											style={{ backgroundColor: "#fdb81b" }}
										></div>
										<span>Medium (20-100ms)</span>
									</div>
									<div className={styles.legendItem}>
										<div
											className={styles.legendColor}
											style={{ backgroundColor: "#ee8019" }}
										></div>
										<span>Slow (100-500ms)</span>
									</div>
									<div className={styles.legendItem}>
										<div
											className={styles.legendColor}
											style={{ backgroundColor: "#ff45a8" }}
										></div>
										<span>Very Slow (&gt;500ms)</span>
									</div>
								</div>
							</div>

							<div className={styles.legendSection}>
								<h4>Key Operations</h4>
								<div className={styles.legendItems}>
									<div className={styles.legendItem}>
										<div
											className={styles.legendColor}
											style={{ backgroundColor: PRIMARY_COLORS.BLURPLE }}
										></div>
										<span>HTTP Server</span>
									</div>
									<div className={styles.legendItem}>
										<div
											className={styles.legendColor}
											style={{ backgroundColor: "#ff45a8" }}
										></div>
										<span>UI Paint</span>
									</div>
									<div className={styles.legendItem}>
										<div
											className={styles.legendColor}
											style={{ backgroundColor: "#36166b" }}
										></div>
										<span>Database</span>
									</div>
									<div className={styles.legendItem}>
										<div
											className={styles.legendColor}
											style={{ backgroundColor: TERTIARY_COLORS.DK_GREEN }}
										></div>
										<span>Cache</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{(activeView === "combined" || activeView === "analytics") && (
					<div className={styles.analyticsSection}>
						<SpanAnalyticsStats />
					</div>
				)}
			</div>

			{/* Data Science Insights Footer */}
			<div className={styles.insights}>
				<h3>🔬 Data Science Insights</h3>
				<div className={styles.insightsGrid}>
					<div className={styles.insightCard}>
						<h4>Performance Distribution</h4>
						<p>
							Most operations (%
							{(
								((SPAN_ANALYTICS.durationStats.distribution.fast +
									SPAN_ANALYTICS.durationStats.distribution.medium) /
									SAMPLE_SPANS.length) *
								100
							).toFixed(1)}
							) complete within 100ms, indicating healthy system performance. The{" "}
							{SPAN_ANALYTICS.operationStats.performanceRank[0].operation} operation has the highest
							impact.
						</p>
					</div>
					<div className={styles.insightCard}>
						<h4>Operation Clustering</h4>
						<p>
							UI operations (paint, mount, render) cluster together in the visualization, showing
							clear separation from backend operations. Database queries show moderate duration
							variance indicating optimization opportunities.
						</p>
					</div>
					<div className={styles.insightCard}>
						<h4>Temporal Patterns</h4>
						<p>
							Peak activity hours: {SPAN_ANALYTICS.temporalStats.peakHours.join(", ")}h. Trace
							complexity averages {SPAN_ANALYTICS.traceStats.hierarchyComplexity}
							(spans × depth), suggesting moderate service interdependency.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SpanVisualization;
