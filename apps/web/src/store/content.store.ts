import create from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Content {
  id: any;
  contentFields?: any;
  template?: any;
}

interface ContentState {
  newContents: Content | null;
  addNewContent: (newContent: Content) => void;
}

export const contentStore = create(
  persist<ContentState>(
    (set) => ({
      newContents: null,
      addNewContent: (newContent: Content) =>
        set(() => ({
          newContents: newContent,
        })),
    }),
    {
      name: 'content-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default contentStore;
