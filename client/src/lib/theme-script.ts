// This script helps prevent FOUC (Flash of Unstyled Content) when the theme loads
// by setting the theme class on the document before the React app loads

export function insertThemeScript() {
  const themeScript = `
    (function() {
      try {
        // Check if the user has explicitly chosen a theme
        let theme = localStorage.getItem('theme');
        
        // If not explicitly set, use the system preference
        if (!theme) {
          theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        // Apply the theme to the document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {
        // If localStorage access fails, default to light mode
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    })();
  `;

  const script = document.createElement('script');
  script.innerHTML = themeScript;
  document.head.appendChild(script);
}