import React, { useEffect, useState } from 'react';
import i18n from '../services/i18n';
import { Text, View, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../services/navigation/routeTypes';
import { RouteProp } from '@react-navigation/native';
import CalendarIcon from '../assets/UI/Table.svg';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import { db } from '../services/orm';
import { symptomsTypes, Symptom } from '../entities';
import { CustomButton } from '../components/Button';
import EditIcon from '../assets/UI/Edit.svg';

type ProfileScreenNavigationProps = StackNavigationProp<RootStackParamList, "Profile">;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

type Props = {
    navigation: ProfileScreenNavigationProps;
    route: ProfileScreenRouteProp;
};

type painCalification = 'extreme' | 'severe' | 'mild';
const typeColor = {
    '4': 'rgb(215, 38, 61)',
    '3': 'rgb(248, 90, 62)',
    '2': 'rgb(242, 175, 41)'
}

const typeLabel = {
    '4': 'extreme',
    '3': 'severe',
    '2': 'mild'
}


type DayRecord = {
    date: Date;
    symptoms?: {
        cough?: number
        soreThroat?: number
        temperatureMorning?: number
        temperatureEvening?: number
        shortnessOfBreath?: number
        runnyNose?: number
        lossOfSmell?: number
        headache?: number
        abdominalPain?: number
        vomiting?: number
        bodyAches?: number
        diarrhea?: number
    }
}

export const ProfileScreen = ({ navigation, route }: Props) => {
    const [symptoms, setSymptoms] = useState<DayRecord[]>([]);

    const loadUserSymproms = async () => {
        const connection = await db;
        const userSymptoms = await connection.getRepository(Symptom).find({
            relations: ['user'],
            where: {
                user: route.params.user
            }
        });
        setSymptoms(
            userSymptoms
                .reduce((prev:DayRecord[], act): DayRecord[] => {
                    if (act.value === 1) return prev;
                    let day = prev.find(({ date }) => moment(date).isSame(act.date));
                    const type = act.type as symptomsTypes;
                    if (!day) {
                        const newDate: DayRecord = {
                            date: act.date,
                            symptoms: {
                                [type]: act.value
                            }
                        }
                        return [...prev, newDate];
                    }
                    return prev.map(dayRecord => {
                        if (dayRecord.date !== act.date) return dayRecord;
                        dayRecord.symptoms = {
                            ...dayRecord.symptoms,
                            [type]: act.value
                        }
                        return dayRecord
                    })
                }, [])
                //add empty days
                .reduce((prev: DayRecord[], act: DayRecord, index, original):DayRecord[] => {
                    if(original.length === index + 1) return [...prev, act];
                    if (moment(original[index + 1].date).subtract(1, 'days').isSame(act.date)) return [...prev,act];
                    const daysUntilNextRecord = moment(act.date).diff(original[index + 1].date, 'days')
                    let fillRecord: DayRecord[] = []
                    for (let i = 1; i <= daysUntilNextRecord; i++) {
                        fillRecord = [...fillRecord, { date: moment(act.date).subtract(i, 'days').toDate() }]      
                    }
                    return [...prev, act, ...fillRecord];
                }, [])
 
        )
    }

    useEffect(() => {
        loadUserSymproms();
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 10 }}>
                    <CalendarIcon width={30} height={30} />
                </TouchableOpacity>
            )
        })
        let fake = new Symptom();
        fake.date = moment().subtract(6,'days').startOf().toDate(),
        fake.user = route.params.user,
        fake.type = 'lossOfSmell',
        fake.value = 3
        //db.then(connection => connection.manager.save(fake)).then(loadUserSymproms)
    }, []);

    return (
    <View style={{width: '100%', flex: 1}}> 
        <View style={styles.container}>
            <ScrollView style={{paddingHorizontal: 30 }}>
                {
                    symptoms
                        .map(daysRecord => (
                            <View style={{opacity: daysRecord.symptoms? 1 : 0.3, width: '100%' }}>
                                <View style={{ display: "flex", flexDirection: "row", marginVertical: 2, width: '100%' }}>
                                    <View style={{ width: 20, height: 20, borderRadius: 6, backgroundColor: 'rgb(69, 123, 157)', marginRight: 10 }}></View>
                                    <View style={{ flex: 1 }}><Text style={{ color: 'rgba(5, 5, 5,0.66)', fontSize: 15, textTransform: 'uppercase'}}>{ !moment(daysRecord.date).isSame(new Date(), "day") ? moment(daysRecord.date).format('dddd, MMMM D YYYY') : i18n.t('today')}</Text></View>
                                    <TouchableOpacity>
                                        <EditIcon width={20} height={20} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ display: "flex", flexDirection: "row", borderLeftColor: 'rgb(169, 169, 169)', borderLeftWidth: 1, marginLeft: 10 }}>
                                    <View style={{ marginLeft: 20, marginVertical: daysRecord.symptoms ? 20 : 0, padding: daysRecord.symptoms ? 20 : 15, backgroundColor: daysRecord.symptoms ? 'rgb(236, 236, 236)': undefined, borderRadius: 10, flex: 1 }}>
                                        
                                        { daysRecord.symptoms
                                            ? Object.keys(daysRecord.symptoms).length === 0
                                                ? <Text style={{ textAlign: 'center' }}>No symptoms</Text>
                                                : Object.keys(daysRecord.symptoms).map(symptom => {
                                                    const pain: painCalification = daysRecord.symptoms ? daysRecord.symptoms[symptom] : '1';
                                                    return (
                                                        <View style={{ flexDirection: 'row', marginVertical: 5, alignItems: 'center' }}>
                                                            <View style={{ marginRight: 10, backgroundColor: typeColor[pain], width: 12, height: 12, borderRadius: 12 }} />
                                                            <View style={{ flexDirection: 'row'}}><Text>{i18n.t(symptom)} </Text><Text style={{fontStyle:'italic'}}>({ i18n.t(typeLabel[pain])})</Text></View>
                                                        </View>
                                                    );
                                                })
                                            : false
                                        }
                                    </View>
                                </View>
                            </View>
                        ))
                }
            </ScrollView>
        </View>
        <CustomButton containerStyle={{width: '100%', padding: 20}} text={i18n.t('enter-symptoms')} onPress={console.log} />
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 100,
        width: '100%',
        flex: 1
    },
});
