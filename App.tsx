import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Updates } from 'expo';
import { I18nManager as RNI18nManager, ActivityIndicator } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import i18n from './src/services/i18n';
import { HomeScreen } from './src/screen/homeScreen';

const Stack = createStackNavigator();

export default function App() {

  const [ isI18nInitialized, setI18nInitialized ] = useState(false);

  useEffect(() => {
    i18n.init()
      .then(async () => {
        const RNDir = RNI18nManager.isRTL ? 'RTL' : 'LTR';
        if (i18n.dir !== RNDir) {
            const isLocaleRTL = i18n.dir === 'RTL';
            RNI18nManager.forceRTL(isLocaleRTL);
            await Updates.reloadFromCache();
            setI18nInitialized(true);
            return;
        }
        setI18nInitialized(true);
    })
    .catch((error) => console.warn(error));
  }, []);

  return !isI18nInitialized
    ? (
      <ActivityIndicator />
    )
    : (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Home'}>
          <Stack.Screen name={'Home'} component={HomeScreen} options={{ title: i18n.t('home')}} />
        </Stack.Navigator>
      </NavigationContainer>
    );
}
