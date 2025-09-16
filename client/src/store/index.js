import { configureStore } from '@reduxjs/toolkit';
import poll from './pollSlice.js';


export const store = configureStore({ reducer: { poll } });