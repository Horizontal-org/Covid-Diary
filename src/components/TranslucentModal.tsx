import React from 'react';
import { StyleSheet, View, Modal } from 'react-native';

interface TranslucentModalProps  {
    children: React.ReactNode,
    visible: boolean,
    onClose: () => void
}

export const TranslucentModal = ({ children, visible, onClose }: TranslucentModalProps) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                onClose? onClose() : null;
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {children}            
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
});