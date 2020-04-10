import moment from 'moment';
 
import { supportedLocales, TLocale } from '../../config/i18n';

export const initDate = (locale: TLocale) => new Promise((resolve, reject) => {
    const locales = Object.keys(supportedLocales);
    if (locales.includes(locale)) {
        supportedLocales[locale]
            .momentLocaleLoader()
            .then(() => {
                moment.locale(locale);
                return resolve();
            })
            .catch( err => reject(err));
        return;
    }
    resolve()
})

export const formatDate = (date: Date, format: string | undefined) => moment(date).format(format);
