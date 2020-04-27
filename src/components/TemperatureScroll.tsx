import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScrollPicker from 'react-native-picker-scrollview';

import { CToFar, fToCel } from '../utils/temperature';

type TempScrollProps = {
    onChange: (n:number) => void,
    defaultValue?: number
    isFarenheit?: boolean
}

const dataTmpSource = (isFarenheit: boolean | undefined) => {
    if(isFarenheit) return Array(120-92).fill(0).map((_,i) =>  92 + i);
    return Array(55-35).fill(0).map((_,i)=> 35+i);
}
        
const dateTmpDecimals = [0,1,2,3,4,5,6,7,8,9]

export const TempScroll = ({onChange, defaultValue, isFarenheit}:TempScrollProps) => {
    const [ decimal, setDecimal ] = useState(6)
    const [ integer, setInteger ] = useState(35)

    const setFormatedTemperature = (temp: number | undefined, convert: boolean | undefined) => {
        temp = temp ? temp : 365;
        if (convert) { temp = CToFar(temp); }
        const newInteger = Math.floor(temp/10);
        const newDecimal = Math.round(((temp/10) - newInteger) * 10)
        setInteger(newInteger);
        setDecimal(newDecimal === 10 ? 0 : newDecimal);
    }

    const onScroll = (newTemp: number) => {
        setFormatedTemperature(newTemp, false);
        onChange(newTemp);
    }

    useEffect(()=> {
        setFormatedTemperature(defaultValue, isFarenheit)
    }, [defaultValue])

    return (
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center', width: '100%', height: 210}}>
            <View>
                <ScrollPicker
                    dataSource={dataTmpSource(isFarenheit)}
                    selectedIndex={dataTmpSource(isFarenheit).indexOf(integer)}
                    onValueChange={ (value:number) => onScroll((value * 10) + decimal) }
                    renderItem={(data: number, index: number, isSelected: boolean) => {
                        return(
                                <Text style={[{textAlign: 'right' }, styles.temp, (isSelected? styles.tempSelected : {})]}>{data}</Text>
                        )
                    }}
                    wrapperColor={'transparent'}
                    highlightColor={'transparent'}
                    itemHeight={70}
                    wrapperHeight={210}
                />
            </View>
            <Text style={{marginTop: 20, marginRight: 20, marginLeft: 20 ,fontSize: 30, textAlign: 'center'}}>.</Text>
            <View>
                <ScrollPicker
                    dataSource={dateTmpDecimals}
                    selectedIndex={decimal}
                    onValueChange={ (value:number) => onScroll((integer * 10) + value) } 
                    renderItem={(data: number, index: number, isSelected: boolean) => {
                        return(
                                <Text style={[{textAlign: 'left'},styles.temp, (isSelected? styles.tempSelected : {})]}>{data}</Text>
                        )
                    }}
                    wrapperColor={'transparent'}
                    highlightColor={'transparent'}
                    itemHeight={70}
                    wrapperHeight={210}
                />
            </View>
            <Text style={{fontSize: 40, fontFamily: 'OpenSans-Light', marginLeft: 40, flex: 1}}>{ isFarenheit ? '°F': '°C'}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    temp: {
        fontSize: 60,
        padding: 0,
        textAlign: 'right', 
        fontFamily: 'OpenSans-Light',
        letterSpacing: 3.85,
        opacity: 0.3,
        color: 'rgb(64, 72, 82)',
    },
        tempSelected: {
        opacity: 1
    },
})