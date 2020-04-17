import { User, Symptom,  } from '../../entities';
import { createConnection } from 'typeorm/browser';
import * as SQLite from 'expo-sqlite';

export const db = createConnection({
    database: "covid",
    driver: SQLite,
    entities: [
        User,
        Symptom
    ],
    synchronize: true,
    type: "expo",
});
