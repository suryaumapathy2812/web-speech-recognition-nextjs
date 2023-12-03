import { create } from 'zustand'


type UserInputState = {
  input: string;
  setInput: (newInput: string) => void;
  disabled: boolean;
  setDisabled: (newDisabled: boolean) => void;
}

const useUserInputStore = create<UserInputState>()((set, get) => ({
  input: '',
  setInput: (newInput: string) => set({ input: newInput }),
  disabled: false,
  setDisabled: (boolean: boolean) => set({ disabled: boolean }),
}));

export default useUserInputStore;