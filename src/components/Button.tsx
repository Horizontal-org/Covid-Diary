

import React from 'react';
import { StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';
import Button from 'react-native-button';


interface CustomButtonProps extends TouchableOpacityProps {
    text: string;
    onPress: () => void;
    style?: StyleProp<ViewStyle>
}

export const CustomButton =  (props: CustomButtonProps) => {
    return (
        <Button style={[styles.button, props.style? props.style : {}]} onPress={props.onPress}>
            {props.text}
        </Button>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'rgb(78, 200, 180)',
        borderRadius: 50,
        padding: 15,
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 18,
        width: '100%'
    },
});
