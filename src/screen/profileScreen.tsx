import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../services/navigation/routeTypes";
import { RouteProp } from "@react-navigation/native";

import { Text, View, StyleSheet, FlatList, ActivityIndicator, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CustomButton } from "../components/Button";
import CalendarIcon from "../assets/UI/Table.svg";
import EditIcon from "../assets/UI/Edit.svg";


import i18n from "../services/i18n";
import { db } from "../services/orm";
import { symptomsTypes, Symptom } from "../entities";

import moment from "moment";

import { formatSymptoms, DayRecord, SymptomsList, symptomsList } from '../utils/formatSymptoms';
import { isToday } from '../utils/isToday';
import { CToFar } from '../utils/temperature';

import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

import { Base64 } from '../utils/base64';
import Papa from 'papaparse';

const hasSymptoms = (dayRecord: DayRecord) => dayRecord.symptoms ? true : false;

const typeColor = {
	"4": "#9F1725",
	"3": "#E55934",
	"2": "#F7CA45",
};

const typeLabel = {
	"4": "severe",
	"3": "moderate",
	"2": "mild",
};

type painCalification = "severe" | "moderate" | "mild";
type ProfileScreenNavigationProps = StackNavigationProp<RootStackParamList, "Profile">;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, "Profile">;

const tempToPain = (temp: number) => {
	if (temp < 370) return '1';
	if (temp < 375) return '2';
	if (temp < 385) return '3';
	return '4';
}

const formatTemp = (temp: number, celsius: boolean) => {
	if (celsius) return temp/10 + ' °C';
	return (CToFar(temp)/10).toFixed(1) + ' °F';
}

type Props = {
	navigation: ProfileScreenNavigationProps;
	route: ProfileScreenRouteProp;
};

export const ProfileScreen = ({ navigation, route }: Props) => {
	const [symptoms, setSymptoms] = useState<DayRecord[]>([]);
	const [ isLoading, setLoading ] = useState(true);
	
	const loadUserSymptoms = async () => {
		setLoading(true);
		console.log('loading user symptom')
		const connection = await db;
		const userSymptoms = await connection.getRepository(Symptom).find({
			relations: ["user"],
			where: { user: route.params.user },
		});
		
		setSymptoms(
			formatSymptoms(
				userSymptoms
			)
		);
		setLoading(false);
	};

	const goToWizard = (record?: DayRecord, temp?: boolean) => {
		setLoading(true)
		if (!record || !record.date) {
			navigation.navigate("Wizard", { user: route.params.user });
		} else {
			if (!temp) {
				return navigation.navigate("Wizard", { user: route.params.user, date: record.date.toString()});
			}
			navigation.navigate("Wizard", { user: route.params.user, date: record.date.toString(), screen: 'temperatureEvening'});
		}
	};

	const editUser = () => {
		navigation.navigate("ProfileAdd", { user: route.params.user })
	}

	const exportCSV = async () => {
		const jsonData = symptoms.map(dRecord => ([
			moment(dRecord.date).format('YYYY-MM-DD'),
			...symptomsList.reduce((prev: string[], act) => {
				return [
					...prev,
					dRecord.symptoms && dRecord.symptoms[act]
						? act.includes('temperature')
							? formatTemp(dRecord.symptoms[act], route.params.user.celsius)
							: i18n.t(typeLabel[dRecord.symptoms[act]])
						: i18n.t('none') || 'none'
				]
			},[])
		]));

		const headers = [
			i18n.t('date'),
			...symptomsList.map(sym => i18n.t(sym))
		];
		const csvData = await Papa.unparse([headers, ...jsonData]);

		const data = Base64.btoa(csvData)
		const path = (FileSystem.documentDirectory || '') + route.params.user.name + '-' + moment().format('YYYY-MM-DD') + '-covid-data.csv';
		await FileSystem.writeAsStringAsync(path, data, {
			encoding: FileSystem.EncodingType.Base64
		})
		Sharing.shareAsync(path,{dialogTitle: i18n.t('shareCSVfile')})

	}

	useEffect(() => {

		navigation.setOptions({
			headerTitle: () => (
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<Text style={{lineHeight: 24, fontFamily: 'OpenSans-Bold', color: '#1D3557', opacity: 0.76, fontSize: 18}}>{route.params.user.name}</Text>
					<TouchableOpacity style={{ marginLeft: 10 }} onPress={editUser}>
						<EditIcon width={20} height={20} />
					</TouchableOpacity>
				</View>
			),
			headerRight: () => (
				<TouchableOpacity style={{ marginRight: 10 }} onPress={exportCSV}>
					<CalendarIcon width={30} height={30} />
				</TouchableOpacity>
			),
		})
		navigation.addListener('focus', loadUserSymptoms);
		return () => {
			navigation.removeListener('focus', loadUserSymptoms)
		}
	}, []);

	return isLoading
		? <ActivityIndicator style={{flex: 1}}/>
		: 
			symptoms.length > 0 
				? (
					<View style={{ width: "100%", flex: 1 }}>
						<View style={styles.container}>
							<FlatList
								style={{paddingHorizontal: 15}}
								inverted={true}
								data={symptoms}
								renderItem={({item}) => (
									<DailyRecord record={item} tempEdit={ r => goToWizard(r,true)} onEdit={goToWizard} celsius={route.params.user.celsius} />
								)}
								keyExtractor={item => String(item.id ? item.id : item.date)}
							/>
						</View>
						<CustomButton
							containerStyle={{ width: "100%", padding: 20 }}
							text={i18n.t("enter-symptoms")}
							onPress={goToWizard}
						/>
					</View>
				)
				: (
					<View style={styles.emptyBox}>
						<Text style={styles.text}>
							{ i18n.t('emptySymptomsList')}
						</Text>
						<Image source={require('../assets/diary-image.png')} style={styles.image} />
						<CustomButton
							containerStyle={{ width: "100%", padding: 20 }}
							text={i18n.t("enter-symptoms")}
							onPress={goToWizard}
						/>
					</View>
				)
};

const styles = StyleSheet.create({
	container: {
		marginTop: 70,
		width: "100%",
		flex: 1,
	},
	emptyBox: {
		marginTop: 80,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
		width: "100%",
		flex: 1,
	},
	text: {
		fontFamily: 'OpenSans-Regular',
		lineHeight: 24,
		fontSize: 15,
		color: '#050505',
		opacity: 0.76,
		textAlign: 'center',
		paddingVertical: 10,
	 },
	 image: {
		 width: 250,
		 height: 250,
		 maxWidth: '80%'
	 }
});

type DailyRecordProps = {
	record: DayRecord;
	onEdit: (r: DayRecord) => void;
	tempEdit: (r: DayRecord) => void;
	celsius: boolean;
};

const DailyRecord = ({ celsius, record, onEdit, tempEdit }: DailyRecordProps) => {
	const { date, symptoms, healthy } = record;
	return (
		<View
			style={[
				dayRecordStyle.container,
				!hasSymptoms(record) ? dayRecordStyle.translucent : {},
			]}
		>
			<View style={dayRecordStyle.header}>
				<View style={dayRecordStyle.blueBox}></View>
				<Text style={dayRecordStyle.date}>
					{isToday(date)
						? i18n.t("today")
						: moment(date).format("dddd, MMMM D YYYY")}
				</Text>
				{ isToday(date) 
					? (
						<TouchableOpacity onPress={() => onEdit(record)}>
							<EditIcon width={20} height={20} />
						</TouchableOpacity>
					)
					: null
				}
			</View>
			<View style={dayRecordStyle.records}>
				<View
					style={
						symptoms
							? dayRecordStyle.symptomsBox
							: dayRecordStyle.symptomsBoxEmpyt
					}
				>
					{symptoms ? <SymptomsBox healthy={healthy} isToday={isToday(date)} tempEdit={() => tempEdit(record)} symptoms={symptoms} celsius={celsius} /> : false}
				</View>
			</View>
		</View>
	);
};

type SymptomsBoxProps = {
	symptoms: SymptomsList;
	celsius: boolean;
	tempEdit: () => void;
	healthy?: boolean;
	isToday: boolean;
};
const SymptomsBox = ({ symptoms, celsius, tempEdit, isToday, healthy }: SymptomsBoxProps) => {
	const keys = Object.keys(symptoms) as symptomsTypes[];

	const sortSymptoms = (symptomList: symptomsTypes[]) => {
		return symptomList
			.map(symptom => ({type: symptom, value: symptoms[symptom] as number}))
			.sort((a, b) => b.value - a.value)
	}

	return (
		<View>
			{ healthy ? (
				<Text style={[dayRecordStyle.pain ,{ textAlign: "center" }]}>
					{i18n.t('feelingHealthy')}
				</Text>
			) : (
					sortSymptoms(keys)
						.map(({type, value}) => {
						const isTemperature = type.includes('temperature')
						if(isTemperature && (value < 370 && value !== 0)) return false;
						if(value === 0) {
							return isToday ? (
								<View
									key={type}
									style={dayRecordStyle.symptomsListItem}
								>
									<CustomButton 
										text={i18n.t('enterEveningTemperature')}
										onPress={tempEdit}
										containerStyle={{
											width: '100%',
											marginVertical: 5,
											paddingLeft: 20,
										}}
										style={{
											paddingVertical: 7,
											backgroundColor: '#F5A623',
											borderRadius: 2,
											color: '#3B3B3B',
											textTransform: 'uppercase',
											fontFamily: 'OpenSans-SemiBold',
											fontSize: 10
										}}
									/>
								</View>
							): false
						}
						const pain = isTemperature ? tempToPain(value) : value.toString() as painCalification;
						return (
							<View
								key={type}
								style={dayRecordStyle.symptomsListItem}
							>
								<View
									style={[dayRecordStyle.symptomsListCircle, { backgroundColor: typeColor[pain] }]}
								/>
								<View style={{ flexDirection: "row" }}>
									{ isTemperature
										?<Text style={dayRecordStyle.pain}>{i18n.t(type+'Short')}: {formatTemp(value, celsius)}</Text>
										:<Text style={dayRecordStyle.pain}>{i18n.t(type)}: {i18n.t(typeLabel[pain])} </Text>
									}
								</View>
							</View>
						);
					})
				)}
		</View>
	);
};

const dayRecordStyle = StyleSheet.create({
	container: {
		width: "100%",
	},
	translucent: {
		opacity: 0.3,
	},
	header: {
		display: "flex",
		flexDirection: "row",
		marginVertical: 2,
		width: "100%",
	},
	blueBox: {
		width: 16,
		height: 16,
		borderRadius: 5,
		backgroundColor: "#457B9D",
		marginRight: 10,
	},
	date: {
		fontFamily: 'OpenSans-SemiBold',
		color: "#050505",
		opacity: 0.66,
		letterSpacing: 1.02,
		fontSize: 12,
		textTransform: "uppercase",
		flex: 1,
	},
	records: {
		display: "flex",
		flexDirection: "row",
		borderLeftColor: "#A9A9A9",
		borderLeftWidth: 1,
		marginLeft: 7,
	},
	symptomsBox: {
		marginLeft: 20,
		marginVertical: 10,
		paddingHorizontal: 10,
		paddingVertical: 5,
		backgroundColor: "rgb(236, 236, 236)",
		borderRadius: 10,
		flex: 1,
	},
	symptomsBoxEmpyt: {
		marginLeft: 20,
		marginVertical: 0,
		padding: 15,
		borderRadius: 10,
		flex: 1,
	},
	symptomsListItem: {
		flexDirection: "row",
		marginVertical: 3,
		alignItems: "center",
	},
	symptomsListCircle: {
		marginRight: 10,
		width: 12,
		height: 12,
		borderRadius: 12
	},
	pain: {
		fontFamily: 'OpenSans-Regular',
		lineHeight: 19,
		fontSize: 12,
		color: '#050505',
		opacity: 0.76
	}
});
