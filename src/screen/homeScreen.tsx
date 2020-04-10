import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import i18n from '../services/i18n';

export const HomeScreen = () => ( 
    <View style={styles.container}>
      <Text>{i18n.t('home')}</Text>
    </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
