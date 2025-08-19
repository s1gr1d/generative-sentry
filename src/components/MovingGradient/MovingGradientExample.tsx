import React, { useState } from "react";
import { MovingGradientCanvas } from "./MovingGradientCanvas";
import { type ColorCategory } from "@/utils/colorPalette";
import styles from "./MovingGradient.module.css";

const MovingGradientExample: React.FC = () => {
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [speed, setSpeed] = useState(1.0);
	const [noiseScale, setNoiseScale] = useState(3.0);
	const [flowIntensity, setFlowIntensity] = useState(0.1);
	const [colorShift, setColorShift] = useState(0.05);
	const [colorCategory, setColorCategory] = useState<ColorCategory>("ALL");
	const [animateColors, setAnimateColors] = useState(false);
	const [colorAnimationSpeed, setColorAnimationSpeed] = useState(0.1);
	const [isStatic, setIsStatic] = useState(true);
	const [mouseInfluence, setMouseInfluence] = useState(1.0);

	const colorCategoryOptions: ColorCategory[] = [
		"ALL",
		"PRIMARY",
		"SECONDARY",
		"TERTIARY",
		"PURPLES",
		"BLURPLES",
		"WARM",
		"COOL",
	];

	return (
		<div className={styles.container}>
			<div className={styles.controls}>
				<h2>MovingGradient - Interactive Mouse Effects</h2>
				<p>Static gradient with mouse interaction creating smoky disruption trails</p>

				<div className={styles.controlGroup}>
					<label className={styles.label}>
						<input
							type="checkbox"
							checked={isFullScreen}
							onChange={(e) => setIsFullScreen(e.target.checked)}
						/>
						Full Screen Mode
					</label>
				</div>

				<div className={styles.controlGroup}>
					<label className={styles.label}>
						<input
							type="checkbox"
							checked={isStatic}
							onChange={(e) => setIsStatic(e.target.checked)}
						/>
						Static Mode (Mouse Interaction Only)
					</label>
				</div>

				<div className={styles.controlGroup}>
					<label className={styles.label}>
						Mouse Influence: {mouseInfluence.toFixed(2)}
						<input
							type="range"
							min="0.0"
							max="2.0"
							step="0.1"
							value={mouseInfluence}
							onChange={(e) => setMouseInfluence(parseFloat(e.target.value))}
							className={styles.slider}
						/>
					</label>
				</div>

				{!isStatic && (
					<div className={styles.controlGroup}>
						<label className={styles.label}>
							Animation Speed: {speed.toFixed(1)}
							<input
								type="range"
								min="0.1"
								max="3.0"
								step="0.1"
								value={speed}
								onChange={(e) => setSpeed(parseFloat(e.target.value))}
								className={styles.slider}
							/>
						</label>
					</div>
				)}

				<div className={styles.controlGroup}>
					<label className={styles.label}>
						Noise Scale: {noiseScale.toFixed(1)}
						<input
							type="range"
							min="1.0"
							max="10.0"
							step="0.1"
							value={noiseScale}
							onChange={(e) => setNoiseScale(parseFloat(e.target.value))}
							className={styles.slider}
						/>
					</label>
				</div>

				<div className={styles.controlGroup}>
					<label className={styles.label}>
						Flow Intensity: {flowIntensity.toFixed(2)}
						<input
							type="range"
							min="0.0"
							max="0.5"
							step="0.01"
							value={flowIntensity}
							onChange={(e) => setFlowIntensity(parseFloat(e.target.value))}
							className={styles.slider}
						/>
					</label>
				</div>

				<div className={styles.controlGroup}>
					<label className={styles.label}>
						Color Shift: {colorShift.toFixed(2)}
						<input
							type="range"
							min="0.0"
							max="0.2"
							step="0.01"
							value={colorShift}
							onChange={(e) => setColorShift(parseFloat(e.target.value))}
							className={styles.slider}
						/>
					</label>
				</div>

				<div className={styles.controlGroup}>
					<label className={styles.label}>
						Color Category:
						<select
							value={colorCategory}
							onChange={(e) => setColorCategory(e.target.value as ColorCategory)}
							className={styles.select}
						>
							{colorCategoryOptions.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
					</label>
				</div>

				<div className={styles.controlGroup}>
					<label className={styles.label}>
						<input
							type="checkbox"
							checked={animateColors}
							onChange={(e) => setAnimateColors(e.target.checked)}
						/>
						Animate Colors
					</label>
				</div>

				{animateColors && (
					<div className={styles.controlGroup}>
						<label className={styles.label}>
							Color Animation Speed: {colorAnimationSpeed.toFixed(2)}
							<input
								type="range"
								min="0.01"
								max="0.5"
								step="0.01"
								value={colorAnimationSpeed}
								onChange={(e) => setColorAnimationSpeed(parseFloat(e.target.value))}
								className={styles.slider}
							/>
						</label>
					</div>
				)}

				<div className={styles.controlGroup}>
					<p style={{ fontSize: "0.8rem", opacity: 0.7, margin: "1rem 0 0 0" }}>
						💡 <strong>Tip:</strong> Move your mouse over the gradient to see interactive effects!
					</p>
				</div>
			</div>

			{!isFullScreen && (
				<div className={styles.gradientContainer}>
					<h3>Interactive Mouse Gradient</h3>
					<div className={styles.gradientBox}>
						<MovingGradientCanvas
							speed={speed}
							noiseScale={noiseScale}
							flowIntensity={flowIntensity}
							colorShift={colorShift}
							colorCategory={colorCategory}
							animateColors={animateColors}
							colorAnimationSpeed={colorAnimationSpeed}
							isStatic={isStatic}
							mouseInfluence={mouseInfluence}
							width={8}
							height={6}
						/>
					</div>
				</div>
			)}

			{isFullScreen && (
				<MovingGradientCanvas
					fullScreen
					speed={speed}
					noiseScale={noiseScale}
					flowIntensity={flowIntensity}
					colorShift={colorShift}
					colorCategory={colorCategory}
					animateColors={animateColors}
					colorAnimationSpeed={colorAnimationSpeed}
					isStatic={isStatic}
					mouseInfluence={mouseInfluence}
				/>
			)}
		</div>
	);
};

export { MovingGradientExample };
