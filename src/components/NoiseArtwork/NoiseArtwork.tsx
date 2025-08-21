import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { COLOR_PALETTE, getRandomColors } from "@/utils/colorPalette";
import styles from "./NoiseArtwork.module.css";

// Constants for the noise artwork (matching original style)
const NOISE_SCALE = 0.01;
const NUMBER_LINES = 15000;
const BORDER = 40;
const STROKE_WEIGHT = 0.2;
const LINE_LENGTH_MULTIPLIER = 30;
const RANDOM_COLOR_PROBABILITY = 0.5;
const COLOR_CATEGORY = "ALL" as const;

export interface NoiseArtworkProps {
	width?: number;
	height?: number;
	backgroundColor?: string;
	className?: string;
}

// This is inspired by https://blog.kevin-ewing.com/Sprills/
export const NoiseArtwork: React.FC<NoiseArtworkProps> = ({
	width = 800,
	height = 800,
	backgroundColor = COLOR_PALETTE.RICH_BLACK,
	className,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const sketchRef = useRef<p5 | null>(null);
	const isDrawingRef = useRef(false);

	useEffect(() => {
		if (!containerRef.current) return;

		// Get colors from the approved palette
		const paletteColors = getRandomColors(12, COLOR_CATEGORY);

		const sketch = (p: p5) => {
			let offsetX: number, offsetY: number, offsetZ: number, offsetColor: number;

			p.setup = () => {
				p.createCanvas(width, height);
				p.background(backgroundColor);
				p.noFill();
				p.strokeWeight(STROKE_WEIGHT);
				p.noLoop();

				// Initialize random offsets for noise - ensure they're valid numbers
				offsetX = Math.random() * 10000;
				offsetY = Math.random() * 10000;
				offsetZ = Math.random() * 10000;
				offsetColor = Math.random() * 10000;
			};

			p.draw = () => {
				if (isDrawingRef.current) return; // Prevent overlapping draws
				isDrawingRef.current = true;

				p.background(backgroundColor);

				// Batch drawing for better performance
				const batchSize = Math.min(NUMBER_LINES, 1000);
				const totalBatches = Math.ceil(NUMBER_LINES / batchSize);

				for (let batch = 0; batch < totalBatches; batch++) {
					const startIdx = batch * batchSize;
					const endIdx = Math.min(startIdx + batchSize, NUMBER_LINES);

					for (let i = startIdx; i < endIdx; i++) {
						// Random position within borders
						const x = p.random(BORDER, width - BORDER);
						const y = p.random(BORDER, height - BORDER);

						// Use noise to determine line length (matching original formula)
						const len =
							p.noise((x + offsetX) * NOISE_SCALE * 0.1, (y + offsetY) * NOISE_SCALE * 0.1) *
								LINE_LENGTH_MULTIPLIER +
							10;

						// Use noise to determine angle
						const angle =
							p.noise((x + offsetZ) * NOISE_SCALE, (y + offsetZ) * NOISE_SCALE) * p.TWO_PI;

						// Use noise to select color
						const colorIndex = p.floor(
							p.noise(
								(x + offsetColor) * NOISE_SCALE * 0.25,
								(y + offsetColor) * NOISE_SCALE * 0.25,
							) * paletteColors.length,
						);

						// Choose color based on probability (matching original)
						if (p.random() > RANDOM_COLOR_PROBABILITY) {
							p.stroke(paletteColors[colorIndex]);
						} else {
							p.stroke(p.random(paletteColors));
						}

						// Calculate end point
						const x2 = x + p.cos(angle) * len;
						const y2 = y + p.sin(angle) * len;

						// Draw the line
						p.line(x, y, x2, y2);
					}

					// Allow browser to breathe between batches for larger drawings
					if (batch < totalBatches - 1 && NUMBER_LINES > 5000) {
						// Small delay for large drawings to prevent blocking
						setTimeout(() => {}, 0);
					}
				}

				isDrawingRef.current = false;
			};

			p.windowResized = () => {
				p.resizeCanvas(width, height);
				p.redraw();
			};

			// Regenerate artwork on mouse click (with debounce)
			let lastClickTime = 0;
			p.mousePressed = () => {
				const now = Date.now();
				if (now - lastClickTime < 500) return; // 500ms debounce
				lastClickTime = now;

				if (
					p.mouseX >= 0 &&
					p.mouseX <= width &&
					p.mouseY >= 0 &&
					p.mouseY <= height &&
					!isDrawingRef.current
				) {
					offsetX = Math.random() * 10000;
					offsetY = Math.random() * 10000;
					offsetZ = Math.random() * 10000;
					offsetColor = Math.random() * 10000;
					p.redraw();
				}
			};
		};

		// Create the p5 instance
		sketchRef.current = new p5(sketch, containerRef.current);

		// Cleanup function
		return () => {
			if (sketchRef.current) {
				sketchRef.current.remove();
				sketchRef.current = null;
			}
		};
	}, [width, height, backgroundColor]);

	return (
		<div className={`${styles.container} ${className || ""}`}>
			<div ref={containerRef} className={styles.canvas} />
			<div className={styles.instructions}>Click to regenerate the artwork</div>
		</div>
	);
};
