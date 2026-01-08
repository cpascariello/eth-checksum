// Color palette for decorative squares
export const COLORS = [
  'neutral', 'red', 'orange', 'yellow', 'emerald', 'blue', 'fuchsia', 'rose'
] as const;

export type ColorName = typeof COLORS[number];

// Tailwind color values for 300 (light), 600 (picker), 700 (dark) weights
export const COLOR_VALUES: Record<ColorName, { light: string; picker: string; dark: string }> = {
  neutral: { light: '#d4d4d4', picker: '#525252', dark: '#404040' },
  red:     { light: '#fca5a5', picker: '#dc2626', dark: '#b91c1c' },
  orange:  { light: '#fdba74', picker: '#ea580c', dark: '#c2410c' },
  yellow:  { light: '#fde047', picker: '#ca8a04', dark: '#a16207' },
  emerald: { light: '#6ee7b7', picker: '#059669', dark: '#047857' },
  blue:    { light: '#93c5fd', picker: '#2563eb', dark: '#1d4ed8' },
  fuchsia: { light: '#f0abfc', picker: '#c026d3', dark: '#a21caf' },
  rose:    { light: '#fda4af', picker: '#e11d48', dark: '#be123c' },
};

// Default settings values
export const DEFAULT_SETTINGS = {
  squareCount: 50,
  squareStep: 5,
  squareStepIncrement: 0.1,
  squareRotation: 1,
  parallaxMultiplier: 2,
  squareColor: 'neutral' as ColorName,
} as const;

export interface Settings {
  squareCount: number;
  squareStep: number;
  squareStepIncrement: number;
  squareRotation: number;
  parallaxMultiplier: number;
  squareColor: ColorName;
}

export interface Profile {
  id: string;
  name: string;
  settings: Settings;
  createdAt: number;
}
