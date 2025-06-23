import { create } from "zustand";

type RequestItemStore = {
  requestedItems: RequestedItems[];
  addItem: (newItem: RequestedItems) => void;
  updateQuantity: (rowIndex: number, newQuantity: number) => void;
  removeItem: (rowIndex: number) => void;
  clearItem: () => void;
};

const useRequestItemStore = create<RequestItemStore>((set) => ({
  requestedItems: [],
  addItem: (newItem: RequestedItems) => {
    set((state) => ({
      requestedItems: [...state.requestedItems, newItem],
    }));
  },
  updateQuantity: (rowIndex, newQuantity) => {
    set((state) => ({
      requestedItems: state.requestedItems.map((item, index) => {
        if (index === rowIndex) {
          return {
            ...item,
            quantity: newQuantity,
          };
        }
        return item;
      }),
    }));
  },
  removeItem: (rowIndex) => {
    set((state) => ({
      requestedItems: state.requestedItems.filter(
        (_, index) => index !== rowIndex,
      ),
    }));
  },
  clearItem: () => set({ requestedItems: [] }),
}));

export default useRequestItemStore;
