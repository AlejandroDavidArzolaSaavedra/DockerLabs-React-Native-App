// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import maquinasVirtualesReducer from './state/reducer';

export const store = configureStore({
  reducer: {
    maquinasVirtuales: maquinasVirtualesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false, 
  }),
});

export default store;