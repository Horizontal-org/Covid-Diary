import React from 'react';
import { View, StyleSheet, Text } from "react-native";

type GrayBoxProps = {
    title: string;
    footer?: React.ReactNode
}

export const GrayBox: React.FC<GrayBoxProps> = ({ title, children, footer }) => {
    return (
        <View style={styles.grayBox}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>
                {children}
            </Text>
            { footer? footer: null}
        </View>
    );
}

const styles = StyleSheet.create({
    grayBox: {
        width: '100%',
        borderRadius: 30,
        backgroundColor: '#ECECEC',
        padding: 27,
        marginBottom: 20,
    },
    title: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 14,
        letterSpacing: 1.19,
        lineHeight: 24,
        color: "#457B9D",
        textTransform: 'uppercase',
    },
    text: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
        lineHeight: 24,
        marginTop: 10
    },
    link: {
        fontFamily: 'OpenSans-SemiBold',
        color: '#70C1B3'
    }
});
