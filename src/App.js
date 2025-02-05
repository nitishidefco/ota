import React from 'react';
import NavigationStack from './NavigationStack';
import { Provider } from 'react-redux';
import { Store } from './Redux/store';

const App = () => {
  return(
  <Provider store={Store}>
  <NavigationStack />
  </Provider>
  )
};

export default App;
