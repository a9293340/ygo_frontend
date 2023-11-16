import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import VueClientRecaptcha from 'vue-client-recaptcha';

import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';

import i18n from '@/i18n';
import VCalendar from 'v-calendar';

import 'default-passive-events';

import 'v-calendar/style.css';

import './style.css';

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(ElementPlus);
app.use(VCalendar, {});
app.component('VueClientRecaptcha', VueClientRecaptcha);

app.mount('#app');
