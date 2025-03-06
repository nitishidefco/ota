import React from 'react';
import NavigationStack from './NavigationStack';
import {Provider} from 'react-redux';
import {Store} from './Redux/store';
import Toast from 'react-native-toast-message';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {toastConfig} from './Helpers';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n/i18n';

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={Store}>
        <I18nextProvider i18n={i18n}>
          <NavigationStack />
          <Toast config={toastConfig} autoHide={true} />
        </I18nextProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
