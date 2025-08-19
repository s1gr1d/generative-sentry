import React, { useMemo, useState } from "react";
import { MovingGradientCanvas } from "@/components/MovingGradient";
import { SAMPLE_SPANS } from "@/data/sampleSpanData";
import { getOperationDistribution } from "@/utils/spanDataGenerator";
import { COLOR_PALETTE } from "@/utils/colorPalette";
import type { SpanData } from "@/types/spanData";
import styles from "./SpanDataGradients.module.css";

interface SpanDataGradientsProps {
	/** Number of gradient layers to render (default: 3) */
	layerCount?: number;
	/** Whether to show data labels (default: true) */
	showLabels?: boolean;
	/** Regeneration key to force new random variations (optional) */
	regenerationKey?: number;
}

// Data science functions to analyze span characteristics
const analyzeSpanData = (spans: SpanData[]) => {
	const durations = spans.map((span) => span.duration);
	const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
	const maxDuration = Math.max(...durations);
	const minDuration = Math.min(...durations);
	const durationVariance =
		durations.reduce((sum, d) => sum + Math.pow(d - avgDuration, 2), 0) / durations.length;
	const durationStdDev = Math.sqrt(durationVariance);

	const operationTypes = [...new Set(spans.map((span) => span.op))];
	const operationDiversity = operationTypes.length;

	const projects = [...new Set(spans.map((span) => span.project.name))];
	const projectDiversity = projects.length;

	const successRate = spans.filter((span) => span.status === "ok").length / spans.length;
	const errorRate = 1 - successRate;

	// Temporal analysis
	const timestamps = spans.map((span) => span.start_timestamp);
	const timeSpan = Math.max(...timestamps) - Math.min(...timestamps);
	const avgTimeInterval = timeSpan / spans.length;

	return {
		avgDuration,
		maxDuration,
		minDuration,
		durationStdDev,
		durationVariance,
		operationDiversity,
		projectDiversity,
		successRate,
		errorRate,
		timeSpan,
		avgTimeInterval,
		totalSpans: spans.length,
	};
};

// Map span data characteristics to gradient parameters
const createGradientFromSpanData = (spans: SpanData[], name: string, baseZPosition: number) => {
	const analysis = analyzeSpanData(spans);
	const operationDistribution = getOperationDistribution(spans);

	// More dramatic speed mapping: much wider range based on performance characteristics
	// Fast operations (UI) get very fast animation, slow operations (DB) get very slow
	const durationFactor = Math.min(analysis.avgDuration, 1000) / 1000;
	const speed =
		analysis.avgDuration < 50
			? 3.0 + Math.random() * 2.0 // Very fast for UI operations (3.0-5.0)
			: analysis.avgDuration > 200
				? 0.1 + Math.random() * 0.4 // Very slow for heavy operations (0.1-0.5)
				: 0.8 + (1 - durationFactor) * 2.0; // Variable for medium operations

	// Dramatic noise scale: based on complexity and chaos in the data
	const complexityFactor = (analysis.operationDiversity * analysis.durationStdDev) / 1000;
	const noiseScale =
		analysis.operationDiversity > 5
			? 8.0 + Math.random() * 7.0 // Very noisy for complex systems (8.0-15.0)
			: analysis.operationDiversity < 3
				? 0.5 + Math.random() * 1.5 // Very smooth for simple systems (0.5-2.0)
				: 2.0 + complexityFactor * 8.0; // Variable based on complexity

	// Extreme flow intensity: based on performance variance and error patterns
	const varianceFactor = Math.min(analysis.durationStdDev, 1000) / 1000;
	const flowIntensity =
		analysis.errorRate > 0.1
			? 0.5 + Math.random() * 0.3 // Very turbulent for error-prone systems (0.5-0.8)
			: analysis.durationStdDev < 50
				? 0.01 + Math.random() * 0.05 // Very stable for consistent systems (0.01-0.06)
				: 0.1 + varianceFactor * 0.6; // Variable based on variance

	// Dynamic color shift: dramatic shifts for chaotic data
	const chaosFactor = analysis.errorRate * analysis.operationDiversity * varianceFactor;
	const colorShift =
		chaosFactor > 0.5
			? 0.2 + Math.random() * 0.3 // Extreme shifting for chaotic systems (0.2-0.5)
			: analysis.successRate > 0.95
				? 0.001 + Math.random() * 0.01 // Almost static for perfect systems (0.001-0.011)
				: 0.03 + chaosFactor * 0.4; // Variable based on chaos level

	// Sophisticated color selection based on multiple data characteristics
	const sortedOps = Object.entries(operationDistribution)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 5);

	// Data-driven color intensity and selection
	const performanceProfile =
		analysis.avgDuration < 50 ? "FAST" : analysis.avgDuration > 200 ? "SLOW" : "MEDIUM";
	const errorProfile =
		analysis.errorRate > 0.1 ? "ERROR_PRONE" : analysis.errorRate < 0.05 ? "STABLE" : "NORMAL";
	const complexityProfile =
		analysis.operationDiversity > 6
			? "COMPLEX"
			: analysis.operationDiversity < 3
				? "SIMPLE"
				: "MODERATE";

	// EXTREMELY distinct color palettes based on system characteristics
	const getColorPalette = (): readonly [
		keyof typeof COLOR_PALETTE,
		keyof typeof COLOR_PALETTE,
		keyof typeof COLOR_PALETTE,
		keyof typeof COLOR_PALETTE,
		keyof typeof COLOR_PALETTE,
	] => {
		// Ultra-fast systems: Pure cool blues (no warm colors at all)
		if (analysis.avgDuration < 20) {
			return ["LT_BLUE", "DK_BLUE", "BLURPLE", "DK_BLURPLE", "RICH_BLACK"];
		}

		// Ultra-slow systems: Deep purples and blacks (no warm colors)
		if (analysis.avgDuration > 1000) {
			return ["DK_PURPLE", "DK_VIOLET", "RICH_BLACK", "DK_BLURPLE", "BACKGROUND_GREY"];
		}

		// Error-prone/chaotic systems: Pure warm colors (no cool colors)
		if (analysis.errorRate > 0.3 || name.includes("Chaos")) {
			return ["DK_PINK", "DK_ORANGE", "DK_YELLOW", "LT_PINK", "LT_ORANGE"];
		}

		// Stable/minimal systems: Pure greens (distinct from everything else)
		if (analysis.errorRate < 0.1 && analysis.durationStdDev < 20) {
			return ["DK_GREEN", "LT_GREEN", "BACKGROUND_GREY", "RICH_BLACK", "DK_BLUE"];
		}

		// Medium performance: Pure violets
		if (performanceProfile === "MEDIUM") {
			return ["DK_VIOLET", "LT_VIOLET", "DK_PURPLE", "LT_PURPLE", "RICH_BLACK"];
		}

		// High-performance, stable systems: Cool colors
		if (performanceProfile === "FAST" && errorProfile === "STABLE") {
			return ["LT_BLUE", "BLURPLE", "LT_BLURPLE", "DK_BLUE", "RICH_BLACK"];
		}

		// Slow, heavy systems: Deep, intense colors
		if (performanceProfile === "SLOW") {
			return ["DK_VIOLET", "DK_PURPLE", "RICH_BLACK", "DK_BLURPLE", "BACKGROUND_GREY"];
		}

		// Default fallback with completely distinct palettes based on first operation
		const primaryOp = sortedOps[0]?.[0] || "http.server";
		if (primaryOp.startsWith("ui.")) {
			return ["DK_PINK", "LT_PINK", "DK_ORANGE", "LT_ORANGE", "RICH_BLACK"];
		}
		if (primaryOp.startsWith("db.")) {
			return ["DK_VIOLET", "LT_VIOLET", "DK_PURPLE", "LT_PURPLE", "RICH_BLACK"];
		}
		if (primaryOp.startsWith("cache.")) {
			return ["DK_GREEN", "LT_GREEN", "DK_BLUE", "LT_BLUE", "RICH_BLACK"];
		}

		// HTTP and others: blues
		return ["BLURPLE", "LT_BLURPLE", "DK_BLUE", "LT_BLUE", "RICH_BLACK"];
	};

	const colors = getColorPalette();

	// Dynamic color animation based on system characteristics
	const animateColors =
		analysis.operationDiversity >= 4 || analysis.errorRate > 0.05 || chaosFactor > 0.3;

	// Extreme color animation speed variation
	const colorAnimationSpeed =
		errorProfile === "ERROR_PRONE"
			? 0.3 + Math.random() * 0.4 // Very fast color shifts for unstable systems (0.3-0.7)
			: performanceProfile === "FAST" && complexityProfile === "COMPLEX"
				? 0.2 + Math.random() * 0.2 // Fast shifts for complex fast systems (0.2-0.4)
				: errorProfile === "STABLE" && complexityProfile === "SIMPLE"
					? 0.01 + Math.random() * 0.03 // Almost no color change for stable simple systems (0.01-0.04)
					: 0.05 + (analysis.totalSpans / 200) * 0.15; // Variable based on activity

	// Mouse influence based on system responsiveness characteristics
	const mouseInfluence =
		performanceProfile === "FAST"
			? 1.5 + Math.random() * 1.0 // Very responsive for fast systems (1.5-2.5)
			: performanceProfile === "SLOW"
				? 0.1 + Math.random() * 0.3 // Barely responsive for slow systems (0.1-0.4)
				: 0.5 + analysis.successRate * 1.0; // Variable based on success rate

	return {
		name,
		analysis,
		props: {
			speed,
			noiseScale,
			flowIntensity,
			colorShift,
			colors,
			animateColors,
			colorAnimationSpeed,
			mouseInfluence,
			zPosition: -baseZPosition,
			fullScreen: false,
			width: 20,
			height: 20,
			isStatic: false,
		},
		zIndex: baseZPosition,
	};
};

export const SpanDataGradients: React.FC<SpanDataGradientsProps> = ({
	layerCount = 3,
	showLabels = true,
	regenerationKey = 0,
}) => {
	const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
	// Create EXTREMELY contrasting data-driven gradient configurations
	const gradientConfigs = useMemo(() => {
		const configs = [];

		// Generate completely artificial extreme data for maximum visual contrast
		const createSyntheticSpans = (
			type: "ULTRA_FAST" | "ULTRA_SLOW" | "CHAOS" | "MINIMAL",
			count: number = 15,
		) => {
			const baseSpans = SAMPLE_SPANS.slice(0, count);
			return baseSpans.map((span) => {
				switch (type) {
					case "ULTRA_FAST":
						return {
							...span,
							duration: 1 + Math.random() * 10, // 1-11ms (super fast)
							op: "ui.interaction" as const,
							status: "ok" as const,
							description: "Lightning Fast UI",
						};
					case "ULTRA_SLOW":
						return {
							...span,
							duration: 2000 + Math.random() * 3000, // 2-5 seconds (very slow)
							op: "file.upload" as const,
							status: Math.random() > 0.7 ? ("deadline_exceeded" as const) : ("ok" as const),
							description: "Heavy File Processing",
						};
					case "CHAOS":
						return {
							...span,
							duration: Math.random() > 0.5 ? 1 + Math.random() * 20 : 500 + Math.random() * 1000,
							op: ["http.server", "db.query", "auth.verify", "process.data"][
								Math.floor(Math.random() * 4)
							] as any,
							status: Math.random() > 0.6 ? ("internal_error" as const) : ("ok" as const),
							description: "System Under Stress",
						};
					case "MINIMAL":
						return {
							...span,
							duration: 5 + Math.random() * 5, // 5-10ms (very consistent)
							op: "cache.get" as const,
							status: "ok" as const,
							description: "Simple Cache Hit",
						};
				}
			});
		};

		if (layerCount === 1) {
			// Single layer: show all data characteristics
			configs.push(createGradientFromSpanData(SAMPLE_SPANS, "Complete System Overview", 1));
		} else if (layerCount === 2) {
			// Two layers: fast vs slow
			configs.push(
				createGradientFromSpanData(createSyntheticSpans("ULTRA_FAST"), "Ultra-Fast Operations", 1),
			);
			configs.push(
				createGradientFromSpanData(createSyntheticSpans("ULTRA_SLOW"), "Heavy Slow Operations", 2),
			);
		} else {
			// Three+ layers: maximum contrast
			configs.push(
				createGradientFromSpanData(
					createSyntheticSpans("ULTRA_FAST"),
					"Lightning Fast (Cool Blues)",
					1,
				),
			);

			configs.push(
				createGradientFromSpanData(
					createSyntheticSpans("ULTRA_SLOW"),
					"Heavy & Slow (Deep Purples)",
					2,
				),
			);

			configs.push(
				createGradientFromSpanData(createSyntheticSpans("CHAOS"), "System Chaos (Warm Chaos)", 3),
			);

			if (layerCount >= 4) {
				configs.push(
					createGradientFromSpanData(
						createSyntheticSpans("MINIMAL"),
						"Minimal & Stable (Greens)",
						4,
					),
				);
			}
		}

		return configs.slice(0, layerCount);
	}, [layerCount, regenerationKey]);

	return (
		<div className={styles.container}>
			{/* Render gradient layers */}
			{gradientConfigs.map((config, index) => (
				<div
					key={`gradient-${index}`}
					className={styles.gradientLayer}
					style={{ zIndex: config.zIndex }}
				>
					<MovingGradientCanvas canvasKey={`span-gradient-${index}`} {...config.props} />
				</div>
			))}

			{/* Data visualization overlay */}
			{showLabels && (
				<div className={styles.dataOverlay}>
					{/* Layer information */}
					<div className={`${styles.layersPanel} ${isPanelCollapsed ? styles.collapsed : ""}`}>
						<div className={styles.panelHeader}>
							<h4>Data Layers ({layerCount})</h4>
							<button
								className={styles.toggleButton}
								onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
								aria-label={isPanelCollapsed ? "Expand data layers" : "Collapse data layers"}
							>
								{isPanelCollapsed ? "▲" : "▼"}
							</button>
						</div>

						{!isPanelCollapsed && (
							<div className={styles.panelContent}>
								{gradientConfigs.map((config, index) => (
									<div key={index} className={styles.layerInfo}>
										<span className={styles.layerName}>{config.name}</span>
										<div className={styles.layerDetails}>
											<span>Speed: {config.props.speed.toFixed(2)}</span>
											<span>Flow: {config.props.flowIntensity.toFixed(3)}</span>
											<span>Noise: {config.props.noiseScale.toFixed(1)}</span>
											<span>Colors: {config.props.animateColors ? "Dynamic" : "Static"}</span>
										</div>
										<div className={styles.profileInfo}>
											Avg: {Math.round(config.analysis.avgDuration)}ms | Ops:{" "}
											{config.analysis.operationDiversity} | Success:{" "}
											{Math.round(config.analysis.successRate * 100)}%
										</div>
										<div className={styles.colorInfo}>
											Colors: {config.props.colors?.join(", ") || "Random"}
										</div>
									</div>
								))}
							</div>
						)}

						{isPanelCollapsed && (
							<div className={styles.collapsedSummary}>
								<span className={styles.summaryText}>
									{gradientConfigs.map((config) => config.name.split(" ")[0]).join(" • ")}
								</span>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
