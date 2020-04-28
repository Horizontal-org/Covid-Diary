import 'reflect-metadata';
import 'react-native-gesture-handler';

import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Updates } from 'expo';
import { I18nManager as RNI18nManager, ActivityIndicator, Image, View, Text } from 'react-native';
import { useFonts } from '@use-expo/font';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';

import i18n from './src/services/i18n';
import { HomeScreen } from './src/screen/homeScreen';
import { WelcomeScreen } from './src/screen/welcomeScreen';
import { AboutScreen } from './src/screen/aboutScreen';
import { ResourcesScreen } from './src/screen/resourcesScreen';
import { AddProfileScreen } from './src/screen/addProfileScreen';
import { ProfileScreen } from './src/screen/profileScreen';
import { RootStackParamList } from './src/services/navigation/routeTypes';
import { WizardScreen } from './src/screen/wizardScreen';

const headerCustomStyle = (title: string | (() => React.ReactNode)): StackNavigationOptions => ({
  headerTitle: typeof title === 'string' ? () => <Text style={titleStyle.title}>{title}</Text> : title,
  headerShown: true,
  headerTitleAlign:'center',
  headerTintColor: 'rgba(29, 53, 87,0.76)',
  headerTransparent: true
});

const titleStyle = StyleSheet.create({
  title: {
    fontFamily: 'OpenSans-Bold',
    color: '#1D3557',
    opacity: 0.76,
    fontSize: 18,
  }
});

const brandHeader = () => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', paddingTop: 10}}>
      <Image style={{ width: 37, height: 37, marginRight: 10 }} source={require('./assets/icon.png')} />
      <Text style={{textTransform: 'uppercase', lineHeight: 24, fontFamily: 'OpenSans-Bold', color: '#1D3557', opacity: 0.76, fontSize: 18 }}>Covid Diary</Text>
    </View>
  )
}

const Stack = createStackNavigator<RootStackParamList>();
export default function App() {
  const [ isFontLoaded ] = useFonts({
    'OpenSans-Light': require('./assets/fonts/OpenSans-Light.ttf'),
    'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-SemiBold': require('./assets/fonts/OpenSans-SemiBold.ttf'),
    'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),

  });
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

  return !isI18nInitialized || !isFontLoaded
    ? (
      <ActivityIndicator style={{flex: 1, width: '100%'}} />
    )
    : (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Welcome'}>
          <Stack.Screen name={'Welcome'} component={WelcomeScreen} options={{headerShown: false}} />
          <Stack.Screen name={'Home'} component={HomeScreen} options={headerCustomStyle(brandHeader)} />
          <Stack.Screen name={'About'} component={AboutScreen} options={headerCustomStyle(i18n.t('about'))} />
          <Stack.Screen name={'Resources'} component={ResourcesScreen} options={headerCustomStyle(i18n.t('resources'))} />
          <Stack.Screen name={'ProfileAdd'} component={AddProfileScreen} options={headerCustomStyle(i18n.t('new-profile').toUpperCase())} />
          <Stack.Screen name={'Profile'} component={ProfileScreen} options={({route}) => headerCustomStyle(route.params.user.name)} />
          <Stack.Screen name={'Wizard'} component={WizardScreen} options={headerCustomStyle(i18n.t('today'))} />
       </Stack.Navigator>
      </NavigationContainer> 
    );
}
