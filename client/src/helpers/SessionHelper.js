class SessionHelper {
  // =========================
  // JWT TOKEN (ACCESS TOKEN)
  // =========================
  static SetToken(token) {
    if (token) {
      localStorage.setItem("AccessToken", token);
    }
  }
  
  static GetToken() {
    const token = localStorage.getItem("AccessToken");
    // Extra safety: make sure we don't return the string "null"
    return (token === "null" || token === "undefined") ? null : token;
  }
  
  static RemoveToken() {
    localStorage.removeItem("AccessToken");
  }

  // =========================
  // USER DETAILS & RBAC ROLES
  // =========================
  static SetUserDetails(UserDetails) {
    if (UserDetails) {
      localStorage.setItem("UserDetails", JSON.stringify(UserDetails));
    }
  }

  static GetUserDetails() {
    let details = localStorage.getItem("UserDetails");
    
    // Hard check for common storage polluters
    if (!details || details === "undefined" || details === "null") {
      return null;
    }

    try {
      const parsed = JSON.parse(details);
      // Ensure we actually got an object with a Roles property
      return (typeof parsed === 'object' && parsed !== null) ? parsed : null;
    } catch (e) {
      console.error("SessionHelper: Failed to parse user details", e);
      return null;
    }
  }

  static RemoveUserDetails() {
    localStorage.removeItem("UserDetails");
  }

  // =========================
  // APP SETTINGS
  // =========================
  static SetLanguage(lang) {
    localStorage.setItem("Language", lang || "en");
  }
  
  static GetLanguage() {
    return localStorage.getItem("Language") || "en";
  }

  static SetTheme(theme) {
    localStorage.setItem("Theme", theme || "light");
  }
  
  static GetTheme() {
    return localStorage.getItem("Theme") || "light";
  }

  // =========================
  // GLOBAL CLEANUP
  // =========================
  static RemoveSession() {
    localStorage.clear();
    // Use replace instead of href to prevent "Back" button security loops
    window.location.replace("/account/login");
  }
}

export default SessionHelper;