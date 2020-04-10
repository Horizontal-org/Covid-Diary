export const fallback = "en";

export type TLocale = 'es' | 'en';

export const supportedLocales = {
    en: {
        name: "English",
        translationFileLoader: () => require('../lang/en.json'),
        momentLocaleLoader: () => Promise.resolve(),
    },
    es: {
        name: "Español",
        translationFileLoader: () => require('../lang/es.json'),
        momentLocaleLoader: () => Promise.resolve(require('moment/locale/es')),
    },
};
 
export const defaultNamespace = "common";
 
export const namespaces = [
    "common"
];