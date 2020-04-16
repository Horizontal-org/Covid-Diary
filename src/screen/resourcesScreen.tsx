import React from 'react';
import i18n from '../services/i18n';
import { StyleSheet, View} from 'react-native';
import { Text } from 'react-native';


export const ResourcesScreen = () => {

  return (
    <View style={styles.container}>
        <Text>Resources screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
