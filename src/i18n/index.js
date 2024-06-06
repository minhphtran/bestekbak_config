import { createI18n } from 'vue-i18n/dist/vue-i18n.cjs'
import en from './en.json'
import nl from './nl.json'

const locale = window.navigator.language ? window.navigator.language.substring(0, 2) : "en";

export function create_i18n () {
  return createI18n({
    locale: locale,
    fallbackLocale: 'nl',
    messages: {
      'en': en,
      'nl': nl
    }
  })
}
