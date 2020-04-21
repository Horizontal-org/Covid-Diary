import { User } from '../../entities';

export type RootStackParamList = {
    Home: undefined;
    Welcome: undefined;
    About: undefined;
    Resources: undefined;
    ProfileAdd: undefined;
    Profile: { user: User };
    Wizard: { user: User, date?: string }
};