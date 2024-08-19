import i18next from 'i18next'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import { Resource } from 'i18next/typescript/options'
import { Translate, Translations } from './translation'

function loadTranslation(translations: Translate[]): Resource {
  const resources: Resource = {}

  if (!translations || translations.length === 0) {
    return resources
  }

  const keys: string[] = Object.keys(translations[0]) as string[]

  for (const key of keys) {
    if (key === 'token') {
      continue
    }

    resources[key] = {
      translation: {}
    }
  }

  for (const translation of translations) {
    for (const key of keys) {
      if (key === 'token') {
        continue
      }
      resources[key].translation[translation.token] = translation[key]
    }
  }
  return resources
}
const resources = loadTranslation(Translations)

i18next
  // 检测用户当前使用的语言
  // 文档: https://github.com/i18next/i18next-browser-languageDetector
  .use(I18nextBrowserLanguageDetector)
  // 注入 react-i18next 实例
  .use(initReactI18next)
  // 初始化 i18next
  // 配置参数的文档: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false
    },
    resources: resources
  })
  .then(() => {})

export default i18next
