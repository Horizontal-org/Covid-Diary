import React from 'react';
import { StyleSheet, View, Linking} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { GrayBox } from '../components/GrayBox';
import { CustomButton } from '../components/Button';


export const ResourcesScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <GrayBox
        title={'Q&A on Covid-19'}
        footer={<CustomButton text={'Read Q&A'} onPress={()=> Linking.openURL('https://www.who.int/news-room/q-a-detail/q-a-coronaviruses')} style={styles.btn} containerStyle={styles.btnContainer} />}
      >
        A Q&A by the World Health Organization on Covid-19, 
        what it is, and how to protect yourself and your loved ones.
      </GrayBox>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginTop: 80,
    paddingHorizontal: 20,
  },
  btn: {
    borderRadius: 0,
    paddingVertical: 10,
    textTransform: 'uppercase',
    fontSize: 12,
    paddingHorizontal: 20
  },
  btnContainer: {
    marginTop: 20,
    width: 'auto',
    alignSelf: 'flex-start'
  }
});
