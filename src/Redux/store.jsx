// --------------- LIBRARIES ---------------
import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './Reducers';
// --------------- ASSETS ---------------
// Root reducer with persist config
const reducers = rootReducer;

// Create store ----->>>>>
export const Store = configureStore({
  reducer: reducers,
});
