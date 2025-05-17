/**
 * Toggle between light and dark mode
 */
export function toggleTheme(): "light" | "dark" {
  const root = document.documentElement;
  const dark = root.classList.toggle('dark');
  const newTheme = dark ? 'dark' : 'light';
  
  localStorage.setItem('theme', newTheme);
  root.setAttribute('data-theme', newTheme);
  
  return newTheme;
}

/**
 * Get the current theme
 */
export function getCurrentTheme(): "light" | "dark" {
  const saved = localStorage.getItem('theme') as "light" | "dark" | null;
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  return saved || (systemPrefersDark ? 'dark' : 'light');
}

/**
 * Set theme explicitly
 */
export function setTheme(theme: "light" | "dark"): void {
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

/**
 * Initialize theme based on user preference or system settings
 */
export function initTheme(): void {
  const theme = getCurrentTheme();
  setTheme(theme);
  
  // Set up listener for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = (e: MediaQueryListEvent) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  };
  
  try {
    // Modern API (standard)
    mediaQuery.addEventListener('change', handleChange);
  } catch (e) {
    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
  }
}