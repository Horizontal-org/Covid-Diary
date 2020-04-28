import { Symptom, symptomsTypes } from '../entities';
import moment from 'moment';
import { isToday } from './isToday';

export type SymptomsList = {
    cough?: number;
    soreThroat?: number;
    temperatureMorning?: number;
    temperatureEvening?: number;
    shortnessOfBreath?: number;
    runnyNose?: number;
    lossOfSmell?: number;
    headache?: number;
    abdominalPain?: number;
    vomiting?: number;
    bodyAches?: number;
    diarrhea?: number;
};
  
export type DayRecord = {
    date: Date;
    symptoms?: SymptomsList;
    id?: number;
    healthy?: boolean;
};
const isHealtier = (act: Symptom, date?: Date) => act.value === 1 || (!isToday(date || act.date) && act.value === 0);

export const mergeSymptoms = (prev: DayRecord[], act: Symptom): DayRecord[] => {
  let day = prev.find(({ date }) => moment(date).isSame(act.date));
  const type = act.type as symptomsTypes;

  if (!day) {
    const newDate: DayRecord = {
      id: act.id ? act.id : Date.now(),
      date: act.date,
      healthy: act.value === 1 || isHealtier(act),
      symptoms: {
        ...(act.value !== 1 ? {[type]: act.value}: {})
      },
    };
    return [...prev, newDate];
  }
  return prev.map((dayRecord) => {
    if (dayRecord.date !== act.date) return dayRecord;
    dayRecord.healthy = !dayRecord.healthy? false : isHealtier(act, dayRecord.date),
    dayRecord.symptoms = {
      ...dayRecord.symptoms,
      ...(act.value !== 1 ? {[type]: act.value}: {})
    };
    return dayRecord;
  });
}

const addEmptyDays = (prev: DayRecord[], act: DayRecord, index: number, original:DayRecord[]): DayRecord[] => {
  if (original.length === index + 1) return [...prev, act];
  if (
    moment(original[index + 1].date)
      .subtract(1, "days")
      .isSame(act.date)
  ) return [...prev, act];
  const daysUntilNextRecord = moment(act.date).diff(
    original[index + 1].date,
    "days"
  );
  let fillRecord: DayRecord[] = [];
  for (let i = 1; i < daysUntilNextRecord; i++) {
    fillRecord = [
      ...fillRecord,
      { id: 0, date: moment(act.date).subtract(i, "days").toDate() },
    ];
  }
  fillRecord = fillRecord.map((record, index) => {
    record.id = (act.id ? act.id : 999)  * 1000 + index;
    return record;
  });
  return [...prev, act, ...fillRecord];
};

const sortByDate = (a: Symptom, b: Symptom) => moment(b.date).diff(a.date, "days");

export const removeNull = (a: Symptom) => a.value !== 1;

export const formatSymptoms = (userSymtoms: Symptom[]) => {
    return userSymtoms
      .sort(sortByDate)
      .reduce(mergeSymptoms, [])
      .reduce(addEmptyDays, []);
      
}