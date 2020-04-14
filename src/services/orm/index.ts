import { User } from '../../entities';
import { createConnection } from 'typeorm/browser';

export const db = createConnection({
    database: "covid",
    driver: require('expo-sqlite'),
    entities: [
        User
    ],
    synchronize: true,
    type: "expo",
});
