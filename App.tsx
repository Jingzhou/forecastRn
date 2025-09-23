// In App.js in a new project

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './src/screen/rootStack/index.tsx';
import {
  defaultAppContext,
  AppContext,
  AppSetStateContext,
} from './AppContext.tsx';

export default function App() {
  const [appContext, setAppContext] = useState(defaultAppContext);
  return (
    <AppContext.Provider value={appContext}>
      <AppSetStateContext.Provider value={setAppContext}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </AppSetStateContext.Provider>
    </AppContext.Provider>
  );
}
