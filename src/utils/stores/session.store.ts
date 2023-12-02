import { create } from 'zustand'

// Define a type for the slice of state
type UserSessionState = {
  userSession: UserSession | null;
  isSessionActive: () => boolean;
  setUserSession: (newUserSession: UserSession) => void;
};

// Create the Zustand store
const useUserSessionStore = create<UserSessionState>()((set, get) => ({
  userSession: null,

  isSessionActive: () => get().userSession !== null,

  setUserSession: (newUserSession: UserSession) => set({ userSession: newUserSession }),

}));

export default useUserSessionStore;