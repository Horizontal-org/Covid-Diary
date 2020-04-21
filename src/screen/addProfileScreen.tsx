import React, { useState } from 'react';
import i18n from '../services/i18n';
import { StyleSheet, View, Text } from 'react-native';
import Reinput from 'reinput';
import { CustomButton } from '../components/Button';
import { Switch } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../services/navigation/routeTypes';
import { db } from '../services/orm';
import { User } from '../entities';

type AddProfileNavigationProps = StackNavigationProp<RootStackParamList, 'ProfileAdd'>;
type Props = {
  navigation: AddProfileNavigationProps
}

export const AddProfileScreen = ({ navigation }: Props) => {
  const [name, onChangeText] = useState('');
  const [error, setError] = useState(false);

  const [isFarenheit, setIsFarenheit] = useState(false);
  const toggleSwitch = () => setIsFarenheit(!isFarenheit);

  const submit = async () => {
    if(name === '') {
      setError(true);
      return
    }
    const connection = await db;
    const users = await connection.getRepository(User);
    const user = new User();
    user.name = name;
    user.celsius = !isFarenheit;
    await users.save(user);
    navigation.replace('Home');
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Reinput
          label={i18n.t('name')}
          defaultValue={name}
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
      </View>
      <View style={styles.footer}>
        <CustomButton style={styles.buttonTabText} containerStyle={styles.buttonTab} onPress={() => navigation.goBack()} text={i18n.t('cancel')} />
        <CustomButton style={styles.buttonTabText} containerStyle={styles.buttonTab} onPress={submit} text={i18n.t('save')} />
      </View>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
