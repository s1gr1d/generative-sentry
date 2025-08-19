/**
 * Official Color Palette for Generative Art Project
 * Only these colors should be used throughout the application
 */

// Primary Colors
export const PRIMARY_COLORS = {
	DK_VIOLET: "#36166b",
	LT_VIOLET: "#6e47ae",
	DK_PURPLE: "#4d0a55",
	LT_PURPLE: "#a737b4",
	DK_BLURPLE: "#4e2a9a",
	BLURPLE: "#7553ff",
	LT_BLURPLE: "#9e86ff",
	RICH_BLACK: "#181225",
} as const;

// Secondary Colors
export const SECONDARY_COLORS = {
	DK_PINK: "#ff45a8",
	LT_PINK: "#ff70bc",
	DK_ORANGE: "#ee8019",
	LT_ORANGE: "#ff9838",
	DK_YELLOW: "#fdb81b",
	LT_YELLOW: "#ffd00e",
} as const;

// Tertiary Colors
export const TERTIARY_COLORS = {
	DK_GREEN: "#92dd00",
	LT_GREEN: "#c0ed49",
	DK_BLUE: "#226dfc",
	LT_BLUE: "#3edcff",
	BACKGROUND_GREY: "#f6f6f8",
} as const;

// Combined palette for easy access
export const COLOR_PALETTE = {
	...PRIMARY_COLORS,
	...SECONDARY_COLORS,
	...TERTIARY_COLORS,
} as const;

// RGB values for Three.js/WebGL usage
export const RGB_VALUES = {
	// Primary Colors
	DK_VIOLET: [54, 22, 107],
	LT_VIOLET: [110, 71, 174],
	DK_PURPLE: [77, 10, 85],
	LT_PURPLE: [167, 55, 180],
	DK_BLURPLE: [78, 42, 154],
	BLURPLE: [117, 83, 255],
	LT_BLURPLE: [158, 134, 255],
	RICH_BLACK: [24, 18, 37],

	// Secondary Colors
	DK_PINK: [255, 69, 168],
	LT_PINK: [255, 112, 188],
	DK_ORANGE: [238, 128, 25],
	LT_ORANGE: [255, 152, 56],
	DK_YELLOW: [253, 184, 27],
	LT_YELLOW: [255, 208, 14],

	// Tertiary Colors
	DK_GREEN: [146, 221, 0],
	LT_GREEN: [192, 237, 73],
	DK_BLUE: [34, 109, 252],
	LT_BLUE: [62, 220, 255],
	BACKGROUND_GREY: [246, 246, 248],
} as const;

// Normalized RGB values (0-1) for Three.js
export const NORMALIZED_RGB = Object.fromEntries(
	Object.entries(RGB_VALUES).map(([key, [r, g, b]]) => [key, [r / 255, g / 255, b / 255] as const]),
) as Record<keyof typeof RGB_VALUES, readonly [number, number, number]>;

// Color categories for themed selections
export const COLOR_CATEGORIES = {
	PRIMARY: Object.values(PRIMARY_COLORS),
	SECONDARY: Object.values(SECONDARY_COLORS),
	TERTIARY: Object.values(TERTIARY_COLORS),
	PURPLES: [
		PRIMARY_COLORS.DK_VIOLET,
		PRIMARY_COLORS.LT_VIOLET,
		PRIMARY_COLORS.DK_PURPLE,
		PRIMARY_COLORS.LT_PURPLE,
	],
	BLURPLES: [PRIMARY_COLORS.DK_BLURPLE, PRIMARY_COLORS.BLURPLE, PRIMARY_COLORS.LT_BLURPLE],
	WARM: [
		SECONDARY_COLORS.DK_PINK,
		SECONDARY_COLORS.LT_PINK,
		SECONDARY_COLORS.DK_ORANGE,
		SECONDARY_COLORS.LT_ORANGE,
		SECONDARY_COLORS.DK_YELLOW,
		SECONDARY_COLORS.LT_YELLOW,
	],
	COOL: [
		TERTIARY_COLORS.DK_GREEN,
		TERTIARY_COLORS.LT_GREEN,
		TERTIARY_COLORS.DK_BLUE,
		TERTIARY_COLORS.LT_BLUE,
	],
	ALL: Object.values(COLOR_PALETTE),
} as const;

// Utility functions for color manipulation
export const getRandomColor = (category: keyof typeof COLOR_CATEGORIES = "ALL"): string => {
	const colors = COLOR_CATEGORIES[category];
	return colors[Math.floor(Math.random() * colors.length)];
};

export const getRandomColors = (
	count: number,
	category: keyof typeof COLOR_CATEGORIES = "ALL",
): string[] => {
	const colors = [...COLOR_CATEGORIES[category]];
	const result: string[] = [];

	for (let i = 0; i < count && colors.length > 0; i++) {
		const randomIndex = Math.floor(Math.random() * colors.length);
		result.push(colors.splice(randomIndex, 1)[0]);
	}

	return result;
};

export const getRandomColorNames = (
	count: number,
	category: keyof typeof COLOR_CATEGORIES = "ALL",
): (keyof typeof COLOR_PALETTE)[] => {
	const colors = [...COLOR_CATEGORIES[category]];
	const result: (keyof typeof COLOR_PALETTE)[] = [];

	// Convert hex colors to color names first
	const colorNames = colors
		.map((hexColor) => {
			return Object.keys(COLOR_PALETTE).find(
				(key) => COLOR_PALETTE[key as keyof typeof COLOR_PALETTE] === hexColor,
			) as keyof typeof COLOR_PALETTE;
		})
		.filter(Boolean);

	// If we need more colors than available, cycle through them
	for (let i = 0; i < count; i++) {
		if (colorNames.length === 0) break;

		const colorIndex = i % colorNames.length;
		result.push(colorNames[colorIndex]);
	}

	// Shuffle the result to add some randomness
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}

	return result;
};

export const hexToThreeColor = (hex: string): [number, number, number] => {
	const colorKey = Object.keys(COLOR_PALETTE).find(
		(key) => COLOR_PALETTE[key as keyof typeof COLOR_PALETTE] === hex,
	) as keyof typeof NORMALIZED_RGB | undefined;

	if (colorKey) {
		return [...NORMALIZED_RGB[colorKey]];
	}

	// Fallback: convert hex to normalized RGB
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (result) {
		return [
			parseInt(result[1], 16) / 255,
			parseInt(result[2], 16) / 255,
			parseInt(result[3], 16) / 255,
		];
	}

	return [0, 0, 0]; // Fallback to black
};

// Type definitions
export type ColorName = keyof typeof COLOR_PALETTE;
export type ColorCategory = keyof typeof COLOR_CATEGORIES;
export type HexColor = (typeof COLOR_PALETTE)[ColorName];
export type RGBColor = readonly [number, number, number];
