import { User, symptomsTypes } from '../../entities';

export type RootStackParamList = {
    Home: undefined;
    Welcome: undefined;
    About: undefined;
    Resources: undefined;
    ProfileAdd: { user?: User};
    Profile: { user: User };
    Wizard: { user: User, date?: string, edit?: boolean, screen?: symptomsTypes }
};