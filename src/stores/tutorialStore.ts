import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TutorialState {
  hasSeenTutorial: boolean;
  showTutorial: boolean;
  setHasSeenTutorial: (seen: boolean) => void;
  openTutorial: () => void;
  closeTutorial: () => void;
}

export const useTutorialStore = create<TutorialState>()(
  persist(
    (set) => ({
      hasSeenTutorial: false,
      showTutorial: false,
      
      setHasSeenTutorial: (seen: boolean) => set({ hasSeenTutorial: seen }),
      
      openTutorial: () => set({ showTutorial: true }),
      
      closeTutorial: () => set({ showTutorial: false, hasSeenTutorial: true }),
    }),
    {
      name: 'canadian-tax-tutorial',
    }
  )
);
