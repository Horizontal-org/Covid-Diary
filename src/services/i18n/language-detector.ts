import * as Localization from 'expo-localization';
import { Module, ThirdPartyModule } from 'i18next';
import { DeviceEventEmitter } from 'react-native';

type moduleTypes = 'languageDetector'
type IlanguageDetector = {
    type: moduleTypes
    async: boolean;
    detect: (callback: (locale: string) => void) => void;
    init: () => void;
    cacheUserLanguage: () => void;
}

export const languageDetector: IlanguageDetector = {
    type: 'languageDetector',
    async: true,
    detect: (callback: (locale:string)=>void) => {
        callback(Localization.locale.split('-')[0]);
    },
    init: () => { },
    cacheUserLanguage: () => { },
};