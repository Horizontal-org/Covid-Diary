import i18next from 'i18next';
import { I18nManager as RNI18nManager } from 'react-native';

import * as config from '../../config/i18n';

import { formatDate, initDate } from './date';
import { languageDetector } from './language-detector';
import { translationLoader } from './translation-loader';

const i18n = {
    /**
     * @returns {Promise}
     */
    init: (): Promise<any> => {
        return new Promise((resolve, reject) => {
            i18next
                .use(languageDetector)
                .use(translationLoader)
                .init({
                    fallbackLng: config.fallback,
                    ns: config.namespaces,
                    defaultNS: config.defaultNamespace,
                    interpolation: {
                        escapeValue: false,
                        format(value, format) {
                            if (value instanceof Date) {
                                return formatDate(value, format);
                            }
                            return value.toString();
                        }
                    },
                }, (error) => {
                    if (error) { return reject(error); }

                    initDate(i18next.language as config.TLocale)
                        .then(resolve)
                        .catch(error => reject(error));
                });
        });
    },

    t: (key: string, options?: object): string => i18next.t(key, options),

    get locale(): string { return i18next.language; },

    /**
     * @returns {'LTR' | 'RTL'}
     */
    get dir(): 'LTR' | 'RTL' {
        return i18next.dir().toUpperCase() === 'LTR' ? 'LTR' : 'RTL';
    },

    /**
     * @returns {boolean}
     */
    get isRTL(): boolean {
        return RNI18nManager.isRTL;
    },

    select(map: { [s: string]: string; }): string {
        const key = this.isRTL ? 'rtl' : 'ltr';
        return map[key];
    }
};

export const t = i18n.t;

export default i18n;