import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Modal from 'react-native-modal';
import i18n from '../services/i18n';
import { CustomButton } from '../components/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../services/navigation/routeTypes';
import WargingIcon from '../assets/UI/Warning.svg';

type WelcomeNavigationProps = StackNavigationProp<RootStackParamList, 'Welcome'>;
type Props = {
  navigation: WelcomeNavigationProps
}

export const WelcomeScreen = ({ navigation }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const navigateToHome = () => {
    setModalVisible(false);
    navigation.replace('Home');
  }

  return ( 
    <View style={styles.container}>
        <Modal
          isVisible={modalVisible}
          onBackButtonPress={()=>{ setModalVisible(false) }}
          animationOut={'fadeOut'}
          hideModalContentWhileAnimating={true}
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >
          <View style={{backgroundColor: '#fff', width: '90%', display: 'flex', alignItems: "center", borderRadius: 15, padding: 20}}>
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <WargingIcon width={20} height={20} />
              <Text style={styles.modalTitle}>{i18n.t('welcomePleaseNote')}</Text>
            </View>
            <Text style={styles.modalText}>{i18n.t('welcomePleaseNoteMsg')}</Text>
            <CustomButton containerStyle={styles.modalButton} text={i18n.t('ok')} onPress={navigateToHome} />
          </View>
        </Modal>
      <View style={styles.container}>
        <Image source={ require('../assets/welcome-image.png') } style={{width: 200, height: 200 }}/>
        <Text style={styles.title}>{i18n.t('welcome')}</Text>
        <Text style={styles.text}>{i18n.t('welcome-text')}</Text>
      </View>
      <View style={{width: '100%', paddingLeft: 10, paddingRight: 10, marginBottom: 50 }}>
        <CustomButton containerStyle={styles.button} text={i18n.t('next')} onPress={()=> setModalVisible(true)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },
  title: {
    color: '#457B9D',
    fontFamily: 'OpenSans-Bold',
    fontSize: 40,
    letterSpacing: 2.25,
    marginBottom: 5
  },
  text: {
    fontSize: 15,
    fontFamily: 'OpenSans-Regular',
    opacity: 0.76,
    textAlign: 'center',
    lineHeight: 24,
    color: '#050505'
  },
  button: {
    width: '100%',
  },
  modalButton: {
    width: 180
  },
  modalTitle: {
    padding: 10,
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: '#1D3557',
    opacity: 0.76
  },
  modalText: {
    marginTop: 10,
    lineHeight: 25,
    marginBottom: 20,
    fontSize: 15,
    color: '#050505',
    opacity: 0.76
  }
});
