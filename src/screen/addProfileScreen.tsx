import React, { useState, useEffect } from 'react';
import i18n from '../services/i18n';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import Reinput from 'reinput';
import { CustomButton } from '../components/Button';
import { Switch, ScrollView } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../services/navigation/routeTypes';
import { User } from '../entities';
import { RouteProp } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { getConnection } from 'typeorm/browser';

type AddProfileNavigationProps = StackNavigationProp<RootStackParamList, 'ProfileAdd'>;
type AddProfileScreenRouteProp = RouteProp<RootStackParamList, "ProfileAdd">;

type Props = {
  navigation: AddProfileNavigationProps;
  route: AddProfileScreenRouteProp;
}

export const AddProfileScreen = ({ navigation, route }: Props) => {
  const [name, onChangeText] = useState('');
  const [error, setError] = useState(false);
  const [ deleteModal, showDeleteBox ] = useState(false);
  const [isFarenheit, setIsFarenheit] = useState(false);
  
  const toggleSwitch = () => setIsFarenheit(!isFarenheit);

  useEffect(()=> {
    if (isEditMode()) {
      const user = route.params.user as User;
      onChangeText(user.name);
      setIsFarenheit(!user?.celsius);
      navigation.setOptions({title: i18n.t('editProfile').toUpperCase()})
    }
  }, []);

  const submit = async () => {
    if(name === '') {
      setError(true);
      return
    }
    const connection = await getConnection();
    const users = await connection.getRepository(User);

    const user = isEditMode()? route.params.user as User : new User();
    user.name = name;
    user.celsius = !isFarenheit;
    const saved = await users.save(user);
    console.log(saved)
    navigation.pop(1);
  }

  const confirmDelete = async () => {
    const user = route.params.user as User;
    const connection = await getConnection();
    await connection.getRepository(User).remove(user);
    navigation.popToTop();
  }

  const isEditMode = () => route.params && route.params.user ? true : false

  return (
    <KeyboardAvoidingView style={styles.container}  behavior={Platform.OS == "ios" ? "padding" : "height"}>
      <ScrollView style={styles.body} contentContainerStyle={{alignContent: 'center', justifyContent: 'center'}}>
        <Reinput
          label={i18n.t('name')}
          value={name}
          onChangeText={(value) => {
            onChangeText(value);
            setError(false)
          }}
          activeColor={'#A9A9A9'}
          fontSize={24}
          fontFamily={'OpenSans-Bold'}
          color={'#70C1B3'}
          labelActiveScale={0.7}
          labelActiveTop={-30}   
          labelActiveColor={'rgb(82, 96, 128)'}
          underlineColor={'#A9A9A9'}
          error={ error ? i18n.t('name-error') : undefined}
        />
        <Text style={styles.bodyTitles}>
          {i18n.t('record-my-temp')}
        </Text>
        <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 30, fontFamily: 'OpenSans-SemiBold', opacity: 0.66, color: isFarenheit? '#B4B4B4' : '#050505' }}>C°</Text>
          <Switch
            trackColor={{ false: "#70C1B3", true: "#70C1B3" }}
            thumbColor={"#fff"}
            ios_backgroundColor="#70C1B3"
            onValueChange={toggleSwitch}
            value={isFarenheit}
            style={{marginHorizontal: 10}}
          />
          <Text style={{fontSize: 30, fontFamily: 'OpenSans-SemiBold', opacity: 0.66, color: !isFarenheit? '#B4B4B4' : '#050505' }}>F°</Text>
        </View>
        { 
          isEditMode()
            ? <CustomButton containerStyle={deleteBtnStyle.container} style={deleteBtnStyle.btn} text={i18n.t('deleteProfile')} onPress={()=> showDeleteBox(true)}/>
            : null
        }
      </ScrollView>
      <View style={styles.footer}>
        <CustomButton style={styles.buttonTabText} containerStyle={styles.buttonTab} onPress={() => navigation.goBack()} text={i18n.t('cancel')} />
        <CustomButton style={[styles.buttonTabText, styles.buttonTabSaveText]} containerStyle={styles.buttonTab} onPress={submit} text={i18n.t('save')} />
      </View>
      <Modal
        isVisible={deleteModal}
        onBackButtonPress={()=>{ showDeleteBox(false) }}
        animationOut={'fadeOut'}
        hideModalContentWhileAnimating={true}
        style={{
            display: "flex",
            alignItems: "center"
        }}
        >
        <View style={{backgroundColor: '#fff', width: '90%', display: 'flex', alignItems: "center", borderRadius: 15, padding: 20}}>
            <Text style={modalStyle.modalText}>
                { i18n.t('deleteProfileMsg') }
            </Text>
            <View style={modalStyle.modalFooter}>
                <CustomButton containerStyle={modalStyle.modalBtn} style={[modalStyle.modalBtnText]} text={i18n.t('cancel')} onPress={() => showDeleteBox(false)} />
                <CustomButton containerStyle={modalStyle.modalBtn} style={[modalStyle.modalBtnText, modalStyle.modalBtnTextConfirm]} text={i18n.t('delete')} onPress={confirmDelete} />
            </View>
        </View>
    </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:100,
    flex: 1,
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
  },
  header: {
    fontWeight: '800',
    color: '#1D3557',
    fontSize: 18,
    textTransform: 'uppercase'
  },
  body: {
    width: '100%',
    paddingHorizontal: 34,
  },
  bodyTitles: {
    textAlign: 'left',
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: '#1D3557',
    opacity: 0.76,
    width: '100%',
    paddingTop: 0,
    paddingBottom: 10,
  },
  footer: {
    display: 'flex',
    flexDirection:'row',
    width: '100%',
    justifyContent:'space-between'
  },
  buttonTab: {
    paddingHorizontal: 30,
    marginVertical: 20,
  },
  buttonTabText: {
    backgroundColor: "rgba(255,255,255,0)",
    color: "#050505",
    fontFamily: 'OpenSans-Regular',
    opacity: 0.76,
    fontSize: 15,
    letterSpacing: 0
  },
  buttonTabSaveText: {
    backgroundColor:'#6AB7AA',
    fontFamily: 'OpenSans-Bold',
    color: '#ffffff',
    paddingHorizontal: 48
  },
});

const deleteBtnStyle = StyleSheet.create({
  btn: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    letterSpacing: 0.57,
    backgroundColor: '#D7263D'
  },
  container: {width: '100%', marginTop: 50}
})


const modalStyle = StyleSheet.create({
  modalText: {
      fontFamily: 'OpenSans-Regular',
      paddingHorizontal: 10,
      paddingVertical: 20,
      lineHeight: 24,
      fontSize: 15
  },
  modalBtn: {
      flex: 1,
      padding:10,
  },
  modalBtnText: {
    backgroundColor: 'transparent',
    color: "#6AB7AA"
  },
  modalBtnTextConfirm: {
    backgroundColor: "#6AB7AA",
    color: '#ffffff'
  },
  modalFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
})
