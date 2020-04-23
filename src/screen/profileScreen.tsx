import React, { useEffect, useState,useCallback, useRef, createRef } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../services/navigation/routeTypes";
import { RouteProp } from "@react-navigation/native";

import { Text, View, StyleSheet, ScrollView, FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CustomButton } from "../components/Button";
import CalendarIcon from "../assets/UI/Table.svg";
import EditIcon from "../assets/UI/Edit.svg";

import i18n from "../services/i18n";
import { db } from "../services/orm";
import { symptomsTypes, Symptom } from "../entities";

import moment from "moment";

import { formatSymptoms, DayRecord, SymptomsList, removeNull } from '../utils/formatSymptoms';
import { isToday } from '../utils/isToday';
import { CToFar } from '../utils/temperature';

const hasSymptoms = (dayRecord: DayRecord) => dayRecord.symptoms ? true : false;

const typeColor = {
	"4": "rgb(215, 38, 61)",
	"3": "rgb(248, 90, 62)",
	"2": "rgb(242, 175, 41)",
};

const typeLabel = {
	"4": "extreme",
	"3": "severe",
	"2": "mild",
};

type painCalification = "extreme" | "severe" | "mild";
type ProfileScreenNavigationProps = StackNavigationProp<RootStackParamList, "Profile">;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, "Profile">;

type Props = {
	navigation: ProfileScreenNavigationProps;
	route: ProfileScreenRouteProp;
};

export const ProfileScreen = ({ navigation, route }: Props) => {
	const [symptoms, setSymptoms] = useState<DayRecord[]>([]);
	
	const loadUserSymptoms = async () => {
		console.log('loading user symptom')
		const connection = await db;
		const userSymptoms = await connection.getRepository(Symptom).find({
			relations: ["user"],
			where: { user: route.params.user },
		});
		setSymptoms(
			formatSymptoms(
				userSymptoms.filter(removeNull)
			)
		);
	};

	const goToWizard = (record?: DayRecord) => {
		if (!record || !record.date) {
			navigation.navigate("Wizard", { user: route.params.user });
		} else {
			navigation.navigate("Wizard", { user: route.params.user, date: record.date.toString()});
		}
	};

	useEffect(() => {
		/* navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity style={{ marginRight: 10 }}>
					<CalendarIcon width={30} height={30} />
				</TouchableOpacity>
			),
		}); */
		navigation.addListener('focus', loadUserSymptoms);
		return () => {
			navigation.removeListener('focus', loadUserSymptoms)
		}
	}, []);

	return (
		<View style={{ width: "100%", flex: 1 }}>
			<View style={styles.container}>
				<FlatList
					style={{paddingHorizontal: 30}}
					inverted={true}
					data={symptoms}
					renderItem={({item}) => (
						<DailyRecord record={item} onEdit={goToWizard} celsius={route.params.user.celsius} />
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
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 100,
		width: "100%",
		flex: 1,
	},
});

type DailyRecordProps = {
	record: DayRecord;
	onEdit: (r: DayRecord) => void;
	celsius: boolean;
};

const DailyRecord = ({ celsius, record, onEdit }: DailyRecordProps) => {
	const { date, symptoms } = record;
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
				<TouchableOpacity onPress={() => onEdit(record)}>
					<EditIcon width={20} height={20} />
				</TouchableOpacity>
			</View>
			<View style={dayRecordStyle.records}>
				<View
					style={
						symptoms
							? dayRecordStyle.symptomsBox
							: dayRecordStyle.symptomsBoxEmpyt
					}
				>
					{symptoms ? <SymptomsBox symptoms={symptoms} celsius={celsius} /> : false}
				</View>
			</View>
		</View>
	);
};

type SymptomsBoxProps = {
	symptoms: SymptomsList;
	celsius: boolean
};
const SymptomsBox = ({ symptoms, celsius }: SymptomsBoxProps) => {
	const keys = Object.keys(symptoms) as symptomsTypes[];

	const tempToPain = (temp: number) => {
		if (temp < 370) return '1';
		if (temp < 375) return '2';
		if (temp < 385) return '3';
		return '4';
	}

	const formatTemp = (temp: number) => {
		if (celsius) return temp/10 + ' °C';
		return CToFar(temp) + ' °F';
	}

	return (
		<View>
			{keys.length === 0 ? (
				<Text style={{ textAlign: "center" }}>No symptoms</Text>
			) : (
					keys
						.map((symptom) => {
						const isTemperature = symptom.includes('temperature')
						if(isTemperature && Number(symptoms[symptom]) < 370) return false;
						const pain = isTemperature ? tempToPain(Number(symptoms[symptom])) : symptoms[symptom]?.toString() as painCalification;
						return (
							<View
								key={symptom}
								style={dayRecordStyle.symptomsListItem}
							>
								<View
									style={[dayRecordStyle.symptomsListCircle, { backgroundColor: typeColor[pain] }]}
								/>
								<View style={{ flexDirection: "row" }}>
									<Text>{i18n.t(isTemperature ? symptom+'Short' : symptom)} </Text>
									<Text style={{ fontStyle: "italic" }}>
										({ isTemperature ? formatTemp(Number(symptoms[symptom])) : i18n.t(typeLabel[pain])})
                					</Text>
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
		width: 20,
		height: 20,
		borderRadius: 6,
		backgroundColor: "rgb(69, 123, 157)",
		marginRight: 10,
	},
	date: {
		color: "rgba(5, 5, 5,0.66)",
		fontSize: 15,
		textTransform: "uppercase",
		flex: 1,
	},
	records: {
		display: "flex",
		flexDirection: "row",
		borderLeftColor: "rgb(169, 169, 169)",
		borderLeftWidth: 1,
		marginLeft: 10,
	},
	symptomsBox: {
		marginLeft: 20,
		marginVertical: 20,
		padding: 20,
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
		marginVertical: 5,
		alignItems: "center",
	},
	symptomsListCircle: {
		marginRight: 10,
		width: 12,
		height: 12,
		borderRadius: 12
	},
});
