import { signal, computed } from "@preact/signals-core";

const userSession = signal<UserSession | null>(null);

const getUserSession = computed(() => {
  return userSession.value;
})

const isSessionActive = computed(() => {
  return userSession.value !== null;
})

const setUserSession = (newUserSession: UserSession) => {
  userSession.value = newUserSession;
}


export { userSession, isSessionActive, getUserSession, setUserSession }