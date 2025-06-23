import { create } from "zustand";

interface SidebarState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

// Create a Zustand store
const useSidebarStore = create<SidebarState>((set) => ({
  isSidebarOpen: false,

  toggleSidebar: () =>
    set((state: { isSidebarOpen: boolean }) => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),

  openSidebar: () => set({ isSidebarOpen: true }),

  // Close the sidebar
  closeSidebar: () => set({ isSidebarOpen: false }),
}));

export default useSidebarStore;
