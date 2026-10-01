/**
 * Hack4Her Theme Switcher
 * Curated Themes:
 *  1. Old Light Mode   (Original website light theme)
 *  2. Old Dark Mode    (Original website dark theme)
 *  3. Minimalist Dark  (New sleek obsidian dark theme)
 *  4. Warm Mode        (Soft amber paper, easy on the eyes)
 *  5. Forest Mode      (Deep Nordic emerald dark)
 */

(function () {
  const THEMES = [
    { id: 'old-light', name: 'Old Light Mode', isDark: false },
    { id: 'old-dark',  name: 'Old Dark Mode',  isDark: true  },
    { id: 'new-dark',  name: 'Minimalist Dark', isDark: true },
    { id: 'warm',      name: 'Warm Mode',      isDark: false },
    { id: 'forest',    name: 'Forest Mode',    isDark: true  }
  ];

  function getSavedTheme() {
    const saved = localStorage.getItem('hack4her_theme');
    if (saved && THEMES.find(t => t.id === saved)) return saved;

    const legacy = localStorage.getItem('theme');
    if (legacy === 'dark') return 'old-dark';
    if (legacy === 'light') return 'old-light';

    return 'old-light';
  }

  function applyTheme(themeId) {
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
    document.documentElement.setAttribute('data-theme', theme.id);
    document.body.setAttribute('data-theme', theme.id);

    if (theme.isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    localStorage.setItem('hack4her_theme', theme.id);
    localStorage.setItem('theme', theme.isDark ? 'dark' : 'light');

    const currentIndex = THEMES.findIndex(t => t.id === theme.id);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    const nextTheme = THEMES[nextIndex];

    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(btn => {
      btn.setAttribute('aria-label', `Theme: ${theme.name} (Click to switch to ${nextTheme.name})`);
      btn.setAttribute('title', `Theme: ${theme.name} (Click to switch to ${nextTheme.name})`);
    });
  }

  function cycleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') || getSavedTheme();
    const idx = THEMES.findIndex(t => t.id === cur);
    const next = THEMES[(idx + 1) % THEMES.length];
    applyTheme(next.id);
  }

  function bindToggles() {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      if (!btn._bound) {
        btn._bound = true;
        btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          cycleTheme();
        }, true);
      }
    });
  }

  const init = getSavedTheme();
  document.documentElement.setAttribute('data-theme', init);
  if (THEMES.find(t => t.id === init)?.isDark) {
    document.documentElement.classList.add('dark-mode');
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(init);
    bindToggles();
    new MutationObserver(bindToggles).observe(document.body, { childList: true, subtree: true });
  });
})();
