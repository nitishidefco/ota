import React from 'react';
import NavigationStack from './NavigationStack';
import { Provider } from 'react-redux';
import { Store } from './Redux/store';
import Toast from 'react-native-toast-message';


const App = () => {
  return (
    <Provider store={Store}>
      <NavigationStack />
      <Toast />
    </Provider>
  )

};

export default App;
