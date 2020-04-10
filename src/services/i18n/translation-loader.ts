import { TLocale, supportedLocales } from '../../config/i18n';
 

type moduleTypes = 'languageDetector' | 'backend'
type ItranslationLoader = {
    type: moduleTypes
    async?: boolean;
    detect?: (callback: (locale: string) => void) => void;
    init: () => void;
    cacheUserLanguage?: () => void;
    read?: (language: TLocale, namespace: string, callback: (e: any, r: any) => void) => void
}


export const translationLoader: ItranslationLoader = {
    type: 'backend',
    init: () => {},
    read: function(language: TLocale, namespace: string, callback: (e:any, r:any) => void) {
        let resource, error = null;
        try {
            resource = supportedLocales[language]
                .translationFileLoader()[namespace];
        } catch (_error) { error = _error; }
 
        callback(error, resource);
    },
};
