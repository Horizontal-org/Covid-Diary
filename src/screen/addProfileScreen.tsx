import React, { useState, useEffect } from 'react';
import i18n from '../services/i18n';
import { StyleSheet, View, Text } from 'react-native';
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
    <View style={styles.container}>
      <ScrollView style={styles.body} contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}>
        <Reinput
          label={i18n.t('name')}
          value={name}
          onChangeText={(value) => {
            onChangeText(value);
            setError(false)
          }}
          activeColor={'#A9A9A9'}
          fontSize={24}
          fontWeight={'600'}
          color={'#70C1B3'}
          labelActiveScale={0.7}
          labelActiveTop={-30}
          labelActiveColor={'#1D3557'}
          underlineColor={'#A9A9A9'}
          error={ error ? i18n.t('name-error') : undefined}
        />
        <Text style={styles.bodyTitles}>
          {i18n.t('record-my-temp')}
        </Text>
        <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', alignContent: 'center'}}>
          <Text style={{fontSize: 48, opacity: 0.66, color: isFarenheit? '#B4B4B4' : '#050505' }}>C°</Text>
          <Switch
            trackColor={{ false: "#70C1B3", true: "#70C1B3" }}
            thumbColor={"#fff"}
            ios_backgroundColor="#70C1B3"
            onValueChange={toggleSwitch}
            value={isFarenheit}
            style={{marginLeft: 10, marginRight: 10}}
          />
          <Text style={{fontSize: 48, opacity: 0.66, color: !isFarenheit? '#B4B4B4' : '#050505' }}>F°</Text>
        </View>
        { 
          isEditMode()
            ? <CustomButton containerStyle={deleteBtnStyle.container} style={deleteBtnStyle.btn} text={i18n.t('deleteProfile')} onPress={()=> showDeleteBox(true)}/>
            : null
        }
      </ScrollView>
      <View style={styles.footer}>
        <CustomButton style={styles.buttonTabText} containerStyle={styles.buttonTab} onPress={() => navigation.goBack()} text={i18n.t('cancel')} />
        <CustomButton style={styles.buttonTabText} containerStyle={styles.buttonTab} onPress={submit} text={i18n.t('save')} />
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
                <CustomButton containerStyle={modalStyle.modalButton} text={i18n.t('cancel')} onPress={() => showDeleteBox(false)} />
                <CustomButton containerStyle={modalStyle.modalButton} text={i18n.t('delete')} onPress={confirmDelete} />
            </View>
        </View>
    </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100
  },
  header: {
    fontWeight: '800',
    color: '#1D3557',
    fontSize: 18,
    textTransform: 'uppercase'
  },
  body: {
    width: '100%',
    padding: 34,
  },
  bodyTitles: {
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
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
    width: 'auto',
    paddingLeft: 30,
    paddingRight: 30,
    marginBottom: 10,
  },
  buttonTabText: {
    backgroundColor: 'rgba(255,255,255,0)',
    color: '#050505',
    opacity: 0.76,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontSize: 14
  }
});

const deleteBtnStyle = StyleSheet.create({
  btn: {backgroundColor: '#D7263D'},
  container: {width: '100%', marginTop: 30}
})


const modalStyle = StyleSheet.create({
  modalText: {
      paddingHorizontal: 10,
      paddingVertical: 20,
      lineHeight: 24,
      fontSize: 15
  },
  modalButton: {
      flex: 1,
      padding:10
  },
  modalFooter: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between'
  }
})
