// --------------- LIBRARIES ---------------
import {configureStore} from '@reduxjs/toolkit';
// --------------- ASSETS ---------------
import rootReducer from './Reducers';

// Root reducer with persist config
const reducers = rootReducer;

// Create store ----->>>>>
export const Store = configureStore({
  reducer: reducers,
});
