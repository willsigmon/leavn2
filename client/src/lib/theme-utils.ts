/**
 * Theme utilities for consistent color usage across the application
 */

export const colors = {
  // Primary earth tones
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  stone: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
  },
  forest: {
    100: '#e0e8e0',
    200: '#c1d2c1',
    300: '#a2bca2',
    400: '#84a683',
    500: '#658f63',
    600: '#517950',
    700: '#3d633c',
    800: '#2c4c3b', // Our primary forest green
    900: '#1a361a',
  }
};

// Typography related values for the reader
export const typography = {
  fontFamilies: {
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    dyslexic: '"OpenDyslexic", serif',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  lineHeights: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
    loose: '2',
  }
};

// Apply theme to document based on a theme name
export function applyTheme(theme: 'light' | 'dark' | 'sepia' | 'solarized'): void {
  // First, remove all theme classes
  document.documentElement.classList.remove('dark', 'sepia', 'solarized');
  
  // Apply the appropriate theme class
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (theme === 'sepia') {
    document.documentElement.classList.add('sepia');
  } else if (theme === 'solarized') {
    document.documentElement.classList.add('solarized');
  }
  
  // Store theme preference
  localStorage.setItem('leavn-theme', theme);
}

// Set warm light filter (for eye comfort)
export function setWarmLight(value: number): void {
  // Apply warm light filter (0-100)
  document.documentElement.style.setProperty('--warm-light', `${value}`);
  document.documentElement.style.setProperty('--hue-rotate', `${value * 10}deg`); // 0-10 degrees
  document.documentElement.style.setProperty('--sepia-amount', `${value * 20}%`);  // 0-20% sepia
  
  // Store preference
  localStorage.setItem('leavn-warm-light', value.toString());
}

// Apply typography settings
export function applyTypography(settings: {
  fontFamily?: string;
  fontSize?: string;
  lineSpacing?: string;
}): void {
  const root = document.documentElement;
  
  if (settings.fontFamily) {
    root.style.setProperty('--font-family', typography.fontFamilies[settings.fontFamily as keyof typeof typography.fontFamilies] || typography.fontFamilies.serif);
  }
  
  if (settings.fontSize) {
    root.style.setProperty('--font-size', typography.fontSizes[settings.fontSize as keyof typeof typography.fontSizes] || typography.fontSizes.base);
  }
  
  if (settings.lineSpacing) {
    root.style.setProperty('--line-height', typography.lineHeights[settings.lineSpacing as keyof typeof typography.lineHeights] || typography.lineHeights.normal);
  }
  
  // Store preferences
  localStorage.setItem('leavn-typography', JSON.stringify(settings));
}