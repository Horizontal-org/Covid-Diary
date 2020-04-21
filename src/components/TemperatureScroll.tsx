import React, {useState, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import { CToFar, fToCel } from '../utils/temperature';

type TempScrollProps = {
    onChange: (n:number) => void,
    defaultValue?: number
    isFarenheit?: boolean
}
type ScrollInfo = {
    timestamp: number;
    value: number;
}
export const TempScroll = ({onChange, defaultValue, isFarenheit}:TempScrollProps) => {
    const [ scroll, setScroll ] = useState<ScrollInfo | undefined>();
    const [ temperature, setTemperature ] = useState(356);

    const setFormatedTemperature = (temp: number) => {
        if (isFarenheit) return setTemperature(CToFar(temp))
        return setTemperature(temp)
    }

    useEffect(()=> {
        if (defaultValue) {
            setFormatedTemperature(defaultValue)
        }
    }, [])

    return (
        <>
            <ScrollView
                onTouchStart={(e)=> { setScroll({ timestamp: e.timeStamp, value: e.nativeEvent.pageY })}}
                onTouchEnd={(e)=>{
                    if(!scroll) return;
                    const velocity = (scroll.value - e.nativeEvent.pageY)/(e.timeStamp - scroll.timestamp)*2
                    const newTemp = temperature + Math.round((scroll.value - e.nativeEvent.pageY)*Math.abs(velocity) / 100 )
                    onChange( isFarenheit ? fToCel(newTemp) : newTemp );
                    setTemperature(newTemp);
                }}
                pagingEnabled
                >
                <Text style={styles.temp}>{(temperature - 1) / 10}</Text>
                <Text style={[styles.temp, styles.tempSelected]}>{temperature / 10}</Text>
                <Text style={styles.temp}>{(temperature + 1) / 10}</Text>
                </ScrollView>
                <Text style={{flex: 2, textAlign: 'left', fontSize: 40}}>
                {!isFarenheit ? '°C' : '°F'}
                </Text>
        </>
    );
};

const styles = StyleSheet.create({
    temp: {
        fontSize: 70,
        lineHeight: 75,
        padding: 0,
        fontWeight: '300',
        opacity: 0.5,
        color: 'rgb(64, 72, 82)',
    },
        tempSelected: {
        opacity: 1
    },
})