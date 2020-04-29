import React from 'react';
import i18n from '../services/i18n';
import { StyleSheet, View, Linking} from 'react-native';
import { Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';


export const AboutScreen = () => {

  return (
    <ScrollView style={styles.container}>
        <GrayBox title={'About Covid Companion'}>
          Covid Companion is developed by Horizontal, a technology non-profit.
          Learn more about us at <Text style={styles.link} onPress={()=> Linking.openURL('https://wearehorizontal.org')}>wearehorizontal.org</Text> and send us feedback or questions at <Text style={styles.link} onPress={()=> Linking.openURL('mailto:diary@wearehorizontal.org')} >diary@wearehorizontal.org</Text>.
        </GrayBox>

        <GrayBox title={'Data Privacy'}>
          All the data you enter in Covid Companion stays on your phone.
          We can never access any of your data.
          You can see our privacy policy at <Text style={styles.link} onPress={()=> Linking.openURL('https://wearehorizontal.org/diary/privacy')}>https://wearehorizontal.org/diary/privacy</Text>
        </GrayBox>

        <GrayBox title={'Open Source'}>
        Covid Companion is open-source.
        The code is publicly available at <Text style={styles.link} onPress={()=> Linking.openURL('https://github.com/horizontal-org/covid-diary')}>https://github.com/horizontal-org/covid-diary</Text>
        </GrayBox>
    </ScrollView>
  );
}

type GrayBoxProps = {
  title: string;
}
const GrayBox: React.FC<GrayBoxProps> = ({title, children}) => {
  return (
    <View style={styles.grayBox}>
      <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>
          {children}
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginTop: 80,
    paddingHorizontal: 20,
  },
  grayBox: {
    width: '100%',
    borderRadius: 30,
    backgroundColor: '#ECECEC',
    padding: 27,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
    letterSpacing: 1.14,
    lineHeight: 24,
    color: "#457B9D",
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 14,
    lineHeight: 24,
    marginTop: 10
  },
  link: {
    color: '#70C1B3'
  }
});
