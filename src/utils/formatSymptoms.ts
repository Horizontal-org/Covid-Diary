import { Symptom, symptomsTypes } from '../entities';
import moment from 'moment';

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
    id: number;
};


export const formatSymptoms = (userSymtoms: Symptom[]) => {
    return userSymtoms.sort((a, b) => moment(b.date).diff(a.date, "days"))
    .reduce((prev: DayRecord[], act): DayRecord[] => {
      if (act.value === 1) return prev;
      let day = prev.find(({ date }) => moment(date).isSame(act.date));
      const type = act.type as symptomsTypes;
      if (!day) {
        const newDate: DayRecord = {
          id: act.id ? act.id : Date.now(),
          date: act.date,
          symptoms: {
            [type]: act.value,
          },
        };
        return [...prev, newDate];
      }
      return prev.map((dayRecord) => {
        if (dayRecord.date !== act.date) return dayRecord;
        dayRecord.symptoms = {
          ...dayRecord.symptoms,
          [type]: act.value,
        };
        return dayRecord;
      });
    }, [])
    //add empty days
    .reduce(
      (prev: DayRecord[], act: DayRecord, index, original): DayRecord[] => {
        if (original.length === index + 1) return [...prev, act];
        if (
          moment(original[index + 1].date)
            .subtract(1, "days")
            .isSame(act.date)
        )
          return [...prev, act];
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
          record.id = act.id * 1000 + index;
          return record;
        });
        return [...prev, act, ...fillRecord];
      },
      []
    )
}