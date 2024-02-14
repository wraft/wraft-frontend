import create from 'zustand';

interface ContentStore {
  msg: string;
  variant: any;
  clear: () => void;
}

const contentStore = create<ContentStore>((set) => ({
  msg: '',
  variant: 'warning',
  setUser: (variant: any) => set({ variant }),
  clear: () => set({ msg: '' }),
}));

export default contentStore;
