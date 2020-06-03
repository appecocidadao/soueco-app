import { Platform, NativeModules } from 'react-native';
import I18n from 'i18n-js';
import en from './en-US';
import pt from './pt-BR';
import es from './es-ES';
import fr from './fr-FR';

// const normalizeTranslate = {
//   'en_US': 'en_US',
//   'pt_BR': 'pt_BR',
//   'en': 'en_US',
//   'pt_US': 'pt_BR',
// };

const normalizeTranslate = (language) => {
  const lang = language.substring(0, 2);

  // alert(`${language}, ${lang}`);

  switch (lang) {
    case 'pt':
      return 'pt_BR';

    case 'es':
      return 'es_ES';

    case 'en':
      return 'en_US';

    case 'fr':
      return 'fr_FR';

    default:
      return 'en_US';
  }
};

const getLanguageByDevice = () => {
  if (Platform.OS === 'ios') {
    let locale = NativeModules.SettingsManager.settings.AppleLocale; // "fr_FR"
    if (locale === undefined) {
      // iOS 13 workaround, take first of AppleLanguages array  ["en", "en-NZ"]
      [locale] = NativeModules.SettingsManager.settings.AppleLanguages;

      if (locale === undefined) {
        locale = 'en'; // default language
      }
    }
    return locale;
  }
  return NativeModules.I18nManager.localeIdentifier;
};

I18n.translations = {
  en_US: en,
  pt_BR: pt,
  es_ES: es,
  fr_FR: fr,
};

const setLanguageToI18n = () => {
  const language = getLanguageByDevice();
  const translateNormalize = normalizeTranslate(language);
  const iHaveThisLanguage = I18n.translations.hasOwnProperty(
    translateNormalize
  );
  if (iHaveThisLanguage) {
    I18n.locale = translateNormalize;
  } else {
    I18n.defaultLocale = 'en_US';
  }
};

setLanguageToI18n();

export const translate = (key) => I18n.t(key);
