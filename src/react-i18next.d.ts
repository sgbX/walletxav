
import en from '@/i18n/locales/en';
import zh from '@/i18n/locales/zh';

type I18nNamespace = typeof zh | typeof en;

// react-i18next versions higher than 11.11.0
declare module 'react-i18next' {
    // and extend them!
    interface CustomTypeOptions {
    // custom resources type
        resources: {
            zh : I18nNamespace
            en: I18nNamespace
        }
    }
}
