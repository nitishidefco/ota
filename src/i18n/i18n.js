import 'intl-pluralrules';
import {initReactI18next} from 'react-i18next';
import i18n from 'i18next';
import {defaultLanguage, languagesResources} from './languageConfig';

// @ts-nocheck
// @ts-ignore
i18n.use(initReactI18next).init({
  resources: languagesResources,
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
  debug: true,
});

export default i18n;
