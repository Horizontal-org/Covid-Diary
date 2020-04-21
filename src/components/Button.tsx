

import React from 'react';
import { StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle, TextStyle, View } from 'react-native';
import Button from 'react-native-button';


interface CustomButtonProps extends TouchableOpacityProps {
    text: string;
    onPress: () => void;
    onLongPress?: () => void;
    style?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    hide?: boolean;

}

export const CustomButton =  (props: CustomButtonProps) => {
    const containerStyle = [styles.buttonContainer, props.containerStyle ? props.containerStyle : {}]
    return !props.hide
        ? (
            <Button
                containerStyle={containerStyle}
                style={[styles.buttonText, props.style? props.style : {}]}
                onPress={props.onPress}
                onLongPress={props.onLongPress}
            >
                {props.text}
            </Button>
        )
        : (
            <View style={containerStyle}></View>
        );
};

const styles = StyleSheet.create({
    buttonContainer: {

    },
    buttonText: {
        backgroundColor: 'rgb(78, 200, 180)',
        borderRadius: 50,
        padding: 15,
        width: '100%',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 18,
    }
});
