import React, {useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Image } from 'react-native';
import i18n from '../services/i18n';
import { CustomButton } from '../components/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../services/navigation/routeTypes';
import moment, { Moment } from 'moment';
import { RouteProp } from '@react-navigation/native';
import { isToday } from '../utils/isToday';
import { DayRecord, SymptomsList, mergeSymptoms } from '../utils/formatSymptoms';
import { symptomsTypes, Symptom } from '../entities';
import { getConnection } from 'typeorm/browser';
import { fToCel } from '../utils/temperature';
import { TempScroll } from '../components/TemperatureScroll'; 
import { ScheduleScreen } from '../components/Schedule';

type WizardNavigationProps = StackNavigationProp<RootStackParamList, 'Wizard'>;
type WizardScreenRouteProp = RouteProp<RootStackParamList, 'Wizard'>;

type Props = {
  navigation: WizardNavigationProps,
  route: WizardScreenRouteProp
}

const symptomsList = [
  'cough',
  'soreThroat',
  'shortnessOfBreath',
  'runnyNose',
  'lossOfSmell',
  'headache',
  'abdominalPain',
  'vomiting',
  'bodyAches',
  'diarrhea',
  'temperatureMorning',
  'temperatureEvening'
];

const symptomsValues = [
  { type: 'none' , value: 1 },
  { type: 'mild' , value: 2 },
  { type: 'moderate' , value: 3 },
  { type: 'severe' , value: 4 }
];

export const WizardScreen = ({ navigation, route }: Props) => {
  const [ record, setRecord ] = useState<DayRecord | undefined>();
  const [ screen, setScreen ] = useState<number>(0);
  const [ oldRercords, setOldRecords ] = useState<Symptom[]>([]);
  const [ ready, setReady] = useState<boolean | undefined>();
  const [ isLoading, setLoading ] = useState(true);

  const setTitle = (date: Moment) => {
    navigation.setOptions({ 
      headerTitle: isToday(date.toDate()) ? i18n.t('today') : date.format('dddd')
    });
  }

  useEffect(() => {
    if ( route.params.date ) {
      const date = moment(route.params.date)
      loadSymptoms(date);
      if (route.params.screen) {
        setScreen(symptomsList.indexOf(route.params.screen) || 0)
      }
      return;
    }
    setLoading(false)
  }, []);

  const loadSymptoms = async (date: Moment) => {
    setTitle(date)
    setLoading(true);
    const symptoms = await getConnection()
      .getRepository(Symptom)
      .find({ 
        relations: ['user'],
        where: {
        user: route.params.user,
        date: date.format('YYYY-MM-DD')
      }})
    setOldRecords(symptoms)
    setRecord({
      date: date.toDate(),
      symptoms: {},
      ...(symptoms.length > 0 ? symptoms.reduce(mergeSymptoms, [])[0] : {})
    })
    setLoading(false);
  }

  const formatTemperature = (temp:number) => {
    if (route.params.user.celsius) return temp;
    return fToCel(temp)
  }

  const deleteSymptom = (symptom: string) => {
    if (record) {
      const newSymptoms = {...record.symptoms};
      delete(newSymptoms[symptom])
      setRecord({
        ...record,
        symptoms: newSymptoms
      });
    }
  }

  const setSymptom = (symptom: SymptomsList) => {
    if (symptom.temperatureEvening && symptom.temperatureEvening !== 0) { symptom.temperatureEvening = formatTemperature(symptom.temperatureEvening) }
    if (symptom.temperatureMorning && symptom.temperatureMorning !== 0) { symptom.temperatureMorning = formatTemperature(symptom.temperatureMorning) }
    if (record) {
      setRecord({
        ...record,
        symptoms: {
          ...record.symptoms,
          ...symptom
        }
      });
      return
    }
    setRecord({
      date: moment().startOf().toDate(),
      symptoms: {
        ...symptom
      }
    })
  }

  const nextScreen = async () => {
    if (screen + 1 === symptomsList.length) {
      navigation.setOptions({ headerShown: false }); 
      setReady(true);
    }
    setScreen(screen + 1)
    return;
  }  

  const save = async () => {
    setLoading(true)
    if ( !record || !record.symptoms ) return;
    const conn = await getConnection()
    const symptoms = record.symptoms || {};
    const keys = Object.keys(record.symptoms) as symptomsTypes[];

    await Promise.all(
      keys.map(async (symptom) => { 
        const oldSym = oldRercords.find(old => old.type === symptom);
        if (oldSym) {
          if (oldSym.value === symptoms[symptom]) return;
          oldSym.value = symptoms[symptom] as number
          return conn.manager.save(oldSym)
        }
        const sym = new Symptom();
        sym.date = record.date;
        sym.user = route.params.user;
        sym.type = symptom;
        sym.value = symptoms[symptom] as number;
        return conn.getRepository(Symptom).insert(sym)
      })
    );
    navigation.pop(1);
  }

  const isUnselected = (symptBtn: {type: string, value: number}) => {
    const acutalSymptom = symptomsList[screen];
    if (!record || !record.symptoms) return undefined;
    if (!record.symptoms[acutalSymptom]) return undefined;
    if (record.symptoms[acutalSymptom] !== symptBtn.value) return true;
    return false
  }

  const getActualTemp = () => {
    const acutalSymptom = symptomsList[screen];
    if (!record || !record.symptoms) return;
    if (!record.symptoms[acutalSymptom]) return;
    return record.symptoms[acutalSymptom]
  }

  return !isLoading 
    ? !ready 
      ? record 
        ? (
          <View style={styles.container}>      
              <View style={styles.options}>
                <Text style={styles.text}>{i18n.t(symptomsList[screen])}</Text>
                { 
                  !symptomsList[screen].includes('temperature')
                    ? symptomsValues.map(symptBtn => (
                        <CustomButton key={symptBtn.value} containerStyle={[styles.button]}  style={[btnStyles[symptBtn.type], isUnselected(symptBtn) === undefined ? {} : isUnselected(symptBtn) ? btnStyles.unselected : btnStyles.selected]} text={i18n.t(symptBtn.type)} onPress={()=> {
                          setSymptom({ [symptomsList[screen]]: symptBtn.value })
                        }} />
                      )
                    )
                    : (<>
                          <View style={{height: 235, display: "flex", flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <TempScroll 
                              key={symptomsList[screen]}
                              onChange={(temp) => setSymptom({ [symptomsList[screen]]: temp })}
                              defaultValue={getActualTemp()}
                              isFarenheit={!route.params.user.celsius}
                            />
                          </View>
                          { 
                            symptomsList[screen].includes('temperatureMorning') || getActualTemp()
                              ? (
                                <CustomButton style={btnStyles.tmpBtn} onPress={()=>{
                                  deleteSymptom(symptomsList[screen]);
                                  nextScreen()
                                }} text={i18n.t('skip')} />
                              )
                              : (
                                <CustomButton style={btnStyles.tmpBtn} onPress={()=>{
                                  setSymptom({ [symptomsList[screen]] : 0 });
                                  nextScreen()
                                }} text={i18n.t('enterLater')} />
                              )
                          }
                        </>
                    )
                }
              </View>
              <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <CustomButton
                style={styles.buttonTabText}
                containerStyle={styles.buttonTab}
                onPress={() => setScreen( screen - 1)}
                text={i18n.t("previous")}
                hide={screen === 0 }
              />
              <Text style={{color: 'rgb(150,150,150)', padding: 15}}>
                {(screen+1)+ '/' +symptomsList.length}
              </Text>
              <CustomButton
                style={styles.buttonTabText}
                containerStyle={styles.buttonTab}
                onPress={nextScreen}
                text={i18n.t("next")}
              />
            </View>
          </View>
        )
        : <ScheduleScreen user={route.params.user} onChange={setTitle} onSubmit={loadSymptoms} />
      : (
        <View style={styles.container}>
          <View style={{flex: 1, justifyContent: 'center', marginTop: 30 }}>
            <Image
              source={require("../assets/save-image.png")}
              style={{ width: 250, height: 250, maxWidth: "100%" }}
            />
            <Text style={saveStyle.title}>{i18n.t('saveThatsAll')}</Text>
            <Text style={saveStyle.subTitle}>{i18n.t('saveMessage')}</Text>  
          </View>
          <CustomButton
            containerStyle={{width: '100%', padding: 20}}
            onPress={save}
            text={i18n.t('saveSymptoms')}
          />
        </View>
      )
    : (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  options: {
    flex: 1,
    marginTop: 80,
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 30,
    
  },
  text: {
    color: '#404852',
    fontSize: 30,
    fontFamily: 'OpenSans-Bold',
    letterSpacing: 0.36,
    marginBottom: 30,
  },
  button: {
    width: '100%', marginBottom: 16
  },
  modalButton: {
    width: 180
  },
  modalTitle: {
    padding: 10,
    fontSize: 20,
    fontFamily: 'OpenSans-SemiBold'
  },
  modalText: {
    marginTop: 10,
    lineHeight: 25,
    marginBottom: 20,
    fontSize: 15
  },
  buttonTab: {
    flex: 1,
    marginBottom: 10,
  },
  buttonTabText: {
    backgroundColor: "rgba(255,255,255,0)",
    color: "rgb(62, 121, 161)",
    fontWeight: "300",
    textTransform: "uppercase",
    fontSize: 14,
  }
});


const btnStyles = StyleSheet.create({
  none: {
    borderColor: 'rgb(150,150,150)',
    borderWidth: 3,
    backgroundColor: 'transparent',
    color: 'rgb(50,50,50)'
  },
  mild: {
    backgroundColor: '#F7CA45',
    borderColor: '#F7CA45',
    borderWidth: 3,
    color: 'rgb(50,50,50)'
  },
  moderate: {
    backgroundColor: '#E55934',
    borderColor: '#E55934',
    borderWidth: 3,
    color: '#fff'
  },
  severe: {
    backgroundColor: '#9F1725',
    borderColor: '#9F1725',
    borderWidth: 3,
    color: '#fff'
  },
  unselected: {
    opacity: 0.4
  },
  selected: {
    borderColor: '#404852'
  },
  tmpBtn:{
    backgroundColor: 'transparent',
    color: '#70C1B3',
    letterSpacing: 0.7,
    fontSize: 24,
    fontFamily: 'OpenSans-SemiBold'
  }
})

const saveStyle = StyleSheet.create({
  title: {
    color: "#70C1B3",
    fontSize: 24,
    letterSpacing: 0.7,
    fontFamily: 'OpenSans-SemiBold',
    textAlign: 'center'
  },
  subTitle: {
    paddingTop: 10,
    width:220,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'OpenSans-Regular',
    lineHeight: 24,
    color: '#050505',
    opacity: 0.76
  }
});