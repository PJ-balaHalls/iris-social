export function IrisThemeScript() {
  const code = `
(function () {
  try {
    var theme = localStorage.getItem('iris:theme:slug') || 'iris-classic';
    var mode = localStorage.getItem('iris:theme:mode') || 'system';
    var prefsRaw = localStorage.getItem('iris:theme:preferences');
    var prefs = prefsRaw ? JSON.parse(prefsRaw) : {};
    var resolved = mode;

    if (mode === 'system') {
      resolved = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    var root = document.documentElement;
    root.setAttribute('data-iris-theme', theme);
    root.setAttribute('data-theme', resolved);
    root.setAttribute('data-theme-mode', mode);
    root.setAttribute('data-font-style', prefs.fontStyle || 'editorial');
    root.setAttribute('data-font-scale', prefs.fontScale || 'normal');
    root.setAttribute('data-spacing', prefs.spacing || 'comfortable');
    root.setAttribute('data-radius', prefs.radius || 'soft');
    root.setAttribute('data-motion', prefs.motion || 'balanced');
    root.setAttribute('data-glass', prefs.glass || 'soft');
    root.style.colorScheme = resolved;
  } catch (error) {}
})();
`;

  return (
    <script
      id="iris-theme-script"
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
