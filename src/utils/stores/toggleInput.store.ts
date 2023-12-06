import { create } from 'zustand';

export enum ToggleInput {
  TEXT = 'text',
  AUDIO = 'audio',
}

type ToggleInputState = {
  toggleInput: ToggleInput;
  setToggleInput: (newToggleInput: ToggleInput) => void;
}


const useToggleInputStore = create<ToggleInputState>()((set, get) => ({
  toggleInput: ToggleInput.TEXT,
  setToggleInput: (newToggleInput: ToggleInput) => set({ toggleInput: newToggleInput }),
}));



export default useToggleInputStore;