import VueI18n from 'vue-i18n';
import Vue from 'vue';

import zh from './zh.json';
// #ifndef MP-WEIXIN
import en from './en.json';
// #endif

let i18nConfig = {
    locale: uni.getLocale(),
    fallbackLocale: 'zh',
    silentTranslationWarn: true,
    silentFallbackWarn: true,
    messages: {
        "zh": zh,
        // #ifndef MP-WEIXIN
        "en": en
        // #endif
    }
}
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)
Vue.prototype._i18n = i18n
export default i18n
