

import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, StyleProp, ViewStyle, TextStyle, View, Text } from 'react-native';

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
            <View style={containerStyle}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={props.onPress}
                    onLongPress={props.onLongPress}
                >
                    <Text  style={[styles.buttonText, props.style? props.style : {}]}>{props.text}</Text>
                </TouchableOpacity>
            </View>
        )
        : (
            <View style={containerStyle}></View>
        );
};

const styles = StyleSheet.create({
    buttonContainer: {
        
    },
    buttonText: {
        textAlign: 'center',
        backgroundColor: 'rgb(78, 200, 180)',
        borderRadius: 25 ,
        overflow: 'hidden',
        padding: 15,
        width: '100%',
        color: '#ffffff',
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 18,
    }
});
