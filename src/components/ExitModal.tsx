import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Modal from 'react-native-modal';
import i18n from '../services/i18n';
import { CustomButton } from './Button';

type Props = {
  onSubmit: (s: boolean) => void; 
};

export const ExitModal = ({ onSubmit }: Props) => (
    <Modal
        isVisible={true}
        onBackButtonPress={()=>{ onSubmit(false) }}
        animationOut={'fadeOut'}
        hideModalContentWhileAnimating={true}
        style={{
            display: "flex",
            alignItems: "center"
        }}
        >
        <View style={{backgroundColor: '#fff', width: '90%', display: 'flex', alignItems: "center", borderRadius: 15, padding: 20}}>
            <Text style={modalStyle.modalText}>
                { i18n.t('exitMessage') }
            </Text>
            <View style={modalStyle.modalFooter}>
                <CustomButton containerStyle={modalStyle.modalBtn} style={[modalStyle.modalBtnText]}text={i18n.t('discard')} onPress={() => onSubmit(false)} />
                <CustomButton containerStyle={modalStyle.modalBtn} style={[modalStyle.modalBtnText, modalStyle.modalBtnTextConfirm]}text={i18n.t('save')} onPress={() => onSubmit(true)} />
            </View>
        </View>
    </Modal>
);

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
  