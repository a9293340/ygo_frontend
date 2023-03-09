import { createI18n } from "vue-i18n";
import zh from "./zh.json";
import en from "./en.json";

type MessageSchema = typeof zh;

const i18n = createI18n<[MessageSchema], "zh-TW" | "en-US">({
  legacy: false,
  globalInjection: true,
  locale: "zh-TW",
  messages: {
    "zh-TW": zh,
    "en-US": en,
  },
  fallbackLocale: "zh-TW",
});

export default i18n;
