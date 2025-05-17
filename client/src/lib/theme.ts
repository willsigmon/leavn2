/**
 * Toggle between light and dark mode
 */
export function toggleTheme(): void {
  const root = document.documentElement;
  const dark = root.classList.toggle('dark');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

/**
 * Initialize theme based on user preference or system settings
 */
export function initTheme(): void {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
}