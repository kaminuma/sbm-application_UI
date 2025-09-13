<template>
    <v-select
      v-model="currentLocale"
      :items="[
        { value: 'ja', title: '日本語' },
        { value: 'en', title: 'English' }
      ]"
      @update:model-value="changeLanguage"
    />
  </template>
  
  <script>
  import { useI18n } from 'vue-i18n'
  export default {
    setup() {
      const { locale } = useI18n()
      const changeLanguage = (newLocale) => {
        locale.value = newLocale
        localStorage.setItem('user-locale', newLocale)
      }
      return { currentLocale: locale, changeLanguage }
    }
  }
  </script>