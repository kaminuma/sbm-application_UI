<template>
  <v-row align="center">
    <v-col cols="8">
      <div class="theme-info">
        <div class="info-icon-wrapper">
          <v-icon :color="themeIconColor">{{ themeIcon }}</v-icon>
        </div>
        <div class="info-content">
          <div class="info-label">現在のテーマ</div>
          <div class="info-value">{{ themeName }}</div>
        </div>
      </div>
    </v-col>
    <v-col cols="4">
      <div class="theme-control">
        <span class="mode-label">{{ isDark ? 'ダーク' : 'ライト' }}モード</span>
        <v-icon class="theme-icon sun-icon">mdi-weather-sunny</v-icon>
        <v-switch
          v-model="isDarkModel"
          color="primary"
          hide-details
          class="theme-switch"
        />
        <v-icon class="theme-icon moon-icon">mdi-weather-night</v-icon>
      </div>
    </v-col>
  </v-row>
  
</template>

<script>
import { useTheme } from '../composables/useTheme'
import { computed } from 'vue'

export default {
  name: 'ThemeToggle',
  emits: ['theme-changed'],
  
  setup(props, { emit }) {
    const { 
      currentTheme, 
      isDark, 
      themeName, 
      toggleTheme 
    } = useTheme()
    
    // v-switchのv-model用
    const isDarkModel = computed({
      get() {
        return isDark.value
      },
      set(value) {
        const success = toggleTheme()
        if (success) {
          emit('theme-changed', {
            theme: currentTheme.value,
            themeName: themeName.value,
            isDark: isDark.value
          })
        }
      }
    })
    
    // テーマアイコン
    const themeIcon = computed(() => {
      return isDark.value ? 'mdi-weather-night' : 'mdi-weather-sunny'
    })
    
    // テーマアイコンの色
    const themeIconColor = computed(() => {
      return isDark.value ? 'purple' : 'orange'
    })
    
    return {
      currentTheme,
      isDark,
      themeName,
      isDarkModel,
      themeIcon,
      themeIconColor
    }
  }
}
</script>

<style scoped>
.theme-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--theme-text-secondary);
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--theme-text-primary);
  line-height: 1.2;
}

.theme-control {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
}

.mode-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--theme-text-primary);
  margin-right: 4px;
}

.theme-icon {
  font-size: 18px;
  opacity: 0.8;
}

.sun-icon {
  color: #ff9800; /* 太陽アイコンの色（オレンジ） */
}

.moon-icon {
  color: #673ab7; /* 月アイコンの色（パープル） */
}

.theme-switch {
  flex-shrink: 0;
}
</style>