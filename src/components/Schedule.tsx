import React, { useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CustomButton } from './Button';

import BackArrow from '../assets/UI/Arrows/Back/Green.svg';
import ForwardArrow from '../assets/UI/Arrows/Forward/Green.svg';

import moment, { Moment } from 'moment';
import i18n from '../services/i18n';

import { getConnection } from 'typeorm/browser';
import { Symptom, User } from '../entities';
import { isToday } from '../utils/isToday';


type Props = {
  onSubmit: (date: Moment) => void; 
  onChange: (date: Moment) => void; 
  user: User;
};

export const ScheduleScreen = ({ onSubmit, onChange, user }: Props) => {
    const [date, setDate] = useState(moment().startOf('day'));
    const [ warning, setWarning ] = useState(false);

    const changeDate = (date: Moment) => {
        setDate(date);
        onChange(date)
    }

    const submitDate = async() => {
        const connection = await getConnection();
        const count = await connection
            .getRepository(Symptom)
            .count({ 
                relations: ['user'],
                where: {
                    user,
                    date: date.format('YYYY-MM-DD')
                }
            })
        if (count === 0) return onSubmit(date)
        setWarning(true)
        return;
    }

    return (
        <View style={styles.container}>
             <Modal
                isVisible={warning}
                onBackButtonPress={()=>{ setWarning(false) }}
                animationOut={'fadeOut'}
                hideModalContentWhileAnimating={true}
                style={{
                    display: "flex",
                    alignItems: "center"
                }}
                >
                <View style={{backgroundColor: '#fff', width: '90%', display: 'flex', alignItems: "center", borderRadius: 15, padding: 20}}>
                    <Text style={modalStyle.modalText}>
                        { i18n.t('editMessage') }
                    </Text>
                    <View style={modalStyle.modalFooter}>
                        <CustomButton containerStyle={modalStyle.modalBtn} style={[modalStyle.modalBtnText]}text={i18n.t('cancel')} onPress={() => setWarning(false)} />
                        <CustomButton containerStyle={modalStyle.modalBtn} style={[modalStyle.modalBtnText, modalStyle.modalBtnTextConfirm]}text={i18n.t('edit')} onPress={() => onSubmit(date)} />
                    </View>
                </View>
            </Modal>
            <Text style={styles.title}>{i18n.t('selectDateMessage')}</Text>
            <View style={styles.whiteContainer}>
                <View style={styles.arrowContainer}>
                    <TouchableOpacity style={styles.arrowBtn} onPress={() => changeDate(moment(date).subtract(1, 'd'))}>
                        <BackArrow width={30} height={30}/>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.dayTitle}>{date.format('dddd')}</Text>
                        <Text style={styles.daySubTitle}>{date.format('D MMMM YYYY')}</Text>
                    </View>
                    <TouchableOpacity style={styles.arrowBtn} onPress={() =>  !isToday(date.toDate()) ? changeDate(moment(date).add(1, 'd')) : false }>
                        <ForwardArrow width={30} height={30} style={{opacity: isToday(date.toDate())? 0 : 1}}/>
                    </TouchableOpacity>
                </View>
                <Image source={require('../assets/calendar-image.png')} style={styles.calendarImg} />
                <CustomButton text={i18n.t('getStarted')} onPress={submitDate} style={{paddingHorizontal: 80}} containerStyle={{paddingBottom: 40}}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#70C1B3',
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    title: {
        fontFamily: 'OpenSans-SemiBold',
        letterSpacing: 0.7,
        padding: 35,
        color: "#ffffff",
        fontSize: 24,
        textAlign: 'center'
    },
    whiteContainer: {
        backgroundColor: '#ffffff',
        borderTopEndRadius: 30,
        borderTopStartRadius: 30,
        width: '100%',
        minHeight: '40%',
        alignItems: 'center'
    },
    arrowContainer: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
        width: '100%'
    },
    arrowBtn: {
        padding: 20
    },
    dayTitle: {
        color: "#050505",
        fontSize: 28,
        height: 45,
        fontFamily: 'OpenSans-SemiBold',
        letterSpacing: 0.88,
        textAlign: 'center'
    },
    daySubTitle: {
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 14,
        opacity: 0.66,
        letterSpacing: 1.19,
        fontFamily: 'OpenSans-SemiBold',
        color: '#050505',
    
    },
    calendarImg: {
        padding: 10,
        height:180,
        width: 180
    },    
});

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
        padding:5,
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
  