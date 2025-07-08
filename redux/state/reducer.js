import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  virtualMachines: [],
  notes: [],
  selectedVM: null,
};

const vmSlice = createSlice({
  name: "dockerLabs",
  initialState,
  reducers: {
    setVirtualMachines: (state, action) => {
      state.virtualMachines = action.payload;
    },
    addVirtualMachine: (state, action) => {
      state.virtualMachines.unshift(action.payload);
    },
    updateVirtualMachine: (state, action) => {
      const { name, ...updates } = action.payload;
      const index = state.virtualMachines.findIndex(vm => vm.name === name);
      if (index !== -1) {
        state.virtualMachines[index] = { ...state.virtualMachines[index], ...updates };
      }
    },
    deleteVirtualMachine: (state, action) => {
      state.virtualMachines = state.virtualMachines.filter(vm => vm.name !== action.payload);
      state.notes = state.notes.filter(note => note.vm_name !== action.payload);
    },

    toggleDesired: (state, action) => {
      const vm = state.virtualMachines.find(vm => vm.name === action.payload);
      if (vm) vm.desired = vm.desired ? 0 : 1;
    },
    toggleDone: (state, action) => {
      const vm = state.virtualMachines.find(vm => vm.name === action.payload);
      if (vm) vm.done = vm.done ? 0 : 1;
    },

    setSelectedVM: (state, action) => {
      state.selectedVM = action.payload;
    },
    
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    
    addNote: (state, action) => {
      state.notes.unshift(action.payload);
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
    resetState: () => initialState,
  },
});

export const {
  setVirtualMachines,
  addVirtualMachine,
  updateVirtualMachine,
  deleteVirtualMachine,
  toggleDesired,
  toggleDone,
  setSelectedVM,
  setNotes,
  addNote,
  deleteNote, 
  resetState,
} = vmSlice.actions;

export default vmSlice.reducer;
