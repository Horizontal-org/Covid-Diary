import { User, Symptom, Configuration } from '../../entities';
import { createConnection } from 'typeorm/browser';
import * as SQLite from 'expo-sqlite';

export const db = createConnection({
    database: "covid",
    driver: SQLite,
    entities: [
        User,
        Symptom,
        Configuration,
    ],
    synchronize: true,
    type: "expo",
});
