const ACCESS_CODE = import.meta.env.VITE_ADMIN_ACCESS_CODE;
const STORAGE_KEY = 'auth_status';
const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

interface AuthState {
  isAuthenticated: boolean;
  attempts: number;
  lockoutUntil: number | null;
}

// Initialize auth state
const getInitialState = (): AuthState => {
  const storedState = localStorage.getItem(STORAGE_KEY);
  if (storedState) {
    return JSON.parse(storedState);
  }
  return {
    isAuthenticated: false,
    attempts: 0,
    lockoutUntil: null
  };
};

// Save auth state to localStorage
const saveState = (state: AuthState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

// Get current auth state
export const getAuthState = (): AuthState => {
  return getInitialState();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const state = getInitialState();
  return state.isAuthenticated;
};

// Check if user is locked out
export const isLockedOut = (): boolean => {
  const state = getInitialState();
  if (state.lockoutUntil && state.lockoutUntil > Date.now()) {
    return true;
  }
  
  // Reset lockout if time has passed
  if (state.lockoutUntil && state.lockoutUntil <= Date.now()) {
    const newState = {
      ...state,
      attempts: 0,
      lockoutUntil: null
    };
    saveState(newState);
  }
  
  return false;
};

// Get remaining lockout time in minutes
export const getLockoutTimeRemaining = (): number => {
  const state = getInitialState();
  if (state.lockoutUntil && state.lockoutUntil > Date.now()) {
    return Math.ceil((state.lockoutUntil - Date.now()) / (60 * 1000));
  }
  return 0;
};

// Login with access code
export const login = (accessCode: string): boolean => {
  const state = getInitialState();
  
  // Check if locked out
  if (isLockedOut()) {
    return false;
  }
  
  // Check access code
  if (accessCode === ACCESS_CODE) {
    const newState = {
      isAuthenticated: true,
      attempts: 0,
      lockoutUntil: null
    };
    saveState(newState);
    return true;
  } else {
    // Increment attempts
    const attempts = state.attempts + 1;
    let lockoutUntil = state.lockoutUntil;
    
    // Lock out if max attempts reached
    if (attempts >= MAX_ATTEMPTS) {
      lockoutUntil = Date.now() + LOCKOUT_TIME;
    }
    
    const newState = {
      isAuthenticated: false,
      attempts,
      lockoutUntil
    };
    saveState(newState);
    return false;
  }
};

// Logout
export const logout = (): void => {
  const newState = {
    isAuthenticated: false,
    attempts: 0,
    lockoutUntil: null
  };
  saveState(newState);
};