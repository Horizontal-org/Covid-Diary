import React from 'react';
import i18n from '../services/i18n';
import { StyleSheet, View} from 'react-native';
import { Text } from 'react-native';


export const AboutScreen = () => {

  return (
    <View style={styles.container}>
        <Text>About screen</Text>
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
