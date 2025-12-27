function initializeTheme() {
    const primaryColorScheme = ""; // "light" | "dark"
  
    function getPreferTheme() {
      const currentTheme = localStorage.getItem("theme");
      if (currentTheme) return currentTheme;
      if (primaryColorScheme) return primaryColorScheme;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
  
    let themeValue = getPreferTheme();
  
    function setPreference() {
      localStorage.setItem("theme", themeValue);
      reflectPreference();
    }
  
    function reflectPreference() {
      document.firstElementChild.setAttribute("data-theme", themeValue);
      document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue);
      const body = document.body;
      if (body) {
        const computedStyles = window.getComputedStyle(body);
        const bgColor = computedStyles.backgroundColor;
        document
          .querySelector("meta[name='theme-color']")
          ?.setAttribute("content", bgColor);
      }
    }
  
    // set early so no page flashes
    reflectPreference();
  
    function setThemeFeature() {
      reflectPreference();
      document.querySelector("#theme-btn")?.addEventListener("click", () => {
        themeValue = themeValue === "light" ? "dark" : "light";
        setPreference();
      });
    }
  
    // Set initial theme on load
    setThemeFeature();
  
    // Add event listener for view transitions
    document.addEventListener("astro:after-swap", setThemeFeature);
  
    // Set theme-color meta tag before page transition
    document.addEventListener("astro:before-swap", event => {
      const bgColor = document
        .querySelector("meta[name='theme-color']")
        ?.getAttribute("content");
      if (bgColor) {
        event.newDocument
          .querySelector("meta[name='theme-color']")
          ?.setAttribute("content", bgColor);
      }
    });
  
    // Sync with system changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", ({ matches: isDark }) => {
        themeValue = isDark ? "dark" : "light";
        setPreference();
      });
  }
  
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    initializeTheme();
  }