import { createI18n } from 'vue-i18n';
import * as zh from './zh-TW.json';
import * as en from './en-US.json';

type MessageSchema = typeof en;

const i18n = createI18n<[MessageSchema], 'zh-TW' | 'en-US'>({
  legacy: false,
  globalInjection: true,
  locale: 'zh-TW',
  messages: {
    'zh-TW': zh,
    'en-US': en,
  },
  fallbackLocale: 'zh-TW',
});

export default i18n;
