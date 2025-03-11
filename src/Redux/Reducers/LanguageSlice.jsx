import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import i18n from '../../i18n/i18n';

const initialState = {
  globalLanguage: null,
};

const languages = {
  ARB: 'ar',
  ENG: 'en',
};

const languageSlice = createSlice({
  name: 'languageSlice',
  initialState: initialState,
  reducers: {
    setGlobalLanguage: (state, action) => {
      state.globalLanguage = action?.payload;
    },
  },
});
export const {setGlobalLanguage} = languageSlice.actions;

export const initializeLanguage = () => async dispatch => {
  try {
    const savedLang = await AsyncStorage.getItem('language');
    if (savedLang) {
      dispatch(setGlobalLanguage(savedLang));
      i18n.changeLanguage(savedLang);
    } else {
      const deviceLanguage = RNLocalize.getLocales()[0]?.languageCode;
      const defaultLang = Object.values(languages).includes(deviceLanguage)
        ? deviceLanguage
        : 'de'; // Fallback to German

      dispatch(setGlobalLanguage(defaultLang));
      i18n.changeLanguage(defaultLang);
      await AsyncStorage.setItem('language', defaultLang);
    }
  } catch (error) {
    console.error('Error initializing language:', error);
  }
};

export const setLanguageWithStorage = language => async dispatch => {
  try {
    await AsyncStorage.setItem('language', language);
    dispatch(setGlobalLanguage(language));
    i18n.changeLanguage(language);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

export default languageSlice.reducer;
