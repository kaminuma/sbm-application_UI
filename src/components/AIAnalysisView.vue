<template>
  <div class="ai-analysis-container">
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="page-header">
            <h1 class="page-title">
              <v-icon class="title-icon" color="primary">mdi-robot</v-icon>
              AI分析
            </h1>
            <p class="page-description">
              あなたの活動データと気分記録をAIが分析し、生活パターンや改善提案を提供します
            </p>
          </div>
        </v-col>
      </v-row>

      <!-- AI利用状況 -->
      <v-row>
        <v-col cols="12">
          <v-card class="usage-card" elevation="2">
            <v-card-title>
              <v-icon class="mr-2">mdi-chart-line</v-icon>
              本日のAI分析利用状況
            </v-card-title>
            <v-card-text>
              <div v-if="aiUsageInfo">
                <v-progress-linear
                  :model-value="(aiUsageInfo.dailyUsed / aiUsageInfo.dailyLimit) * 100"
                  color="primary"
                  height="8"
                  rounded
                  class="mb-2"
                ></v-progress-linear>
                <div class="usage-text">
                  {{ aiUsageInfo.dailyUsed }} / {{ aiUsageInfo.dailyLimit }} 回使用
                  <span v-if="aiUsageInfo.remainingToday > 0" class="remaining-text">
                    （本日あと {{ aiUsageInfo.remainingToday }} 回利用可能）
                  </span>
                  <span v-else class="limit-reached-text">
                    （本日の利用上限に達しました）
                  </span>
                </div>
              </div>
              <div v-else class="loading-skeleton">
                <v-skeleton-loader type="text, text"></v-skeleton-loader>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 分析設定 -->
      <v-row>
        <v-col cols="12">
          <v-card class="config-card" elevation="2">
            <v-card-title>
              <v-icon class="mr-2">mdi-cog</v-icon>
              分析設定
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="analysisConfig.startDate"
                    label="開始日"
                    type="date"
                    variant="outlined"
                    density="comfortable"
                    :max="today"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="analysisConfig.endDate"
                    label="終了日"
                    type="date"
                    variant="outlined"
                    density="comfortable"
                    :max="today"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="analysisConfig.analysisFocus"
                    :items="analysisFocusOptions"
                    label="分析焦点"
                    variant="outlined"
                    density="comfortable"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="analysisConfig.detailLevel"
                    :items="detailLevelOptions"
                    label="詳細レベル"
                    variant="outlined"
                    density="comfortable"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="analysisConfig.responseStyle"
                    :items="responseStyleOptions"
                    label="応答スタイル"
                    variant="outlined"
                    density="comfortable"
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 分析ボタン -->
      <v-row>
        <v-col cols="12" class="text-center">
          <v-btn
            @click="generateAIAnalysis"
            :loading="isAnalyzing"
            :disabled="!canAnalyze"
            color="primary"
            size="large"
            variant="elevated"
            class="analysis-btn"
          >
            <v-icon class="mr-2">mdi-auto-fix</v-icon>
            AI分析を実行
          </v-btn>
          <div v-if="!canAnalyze" class="mt-2 text-caption text-disabled">
            {{ disableReason }}
          </div>
        </v-col>
      </v-row>

      <!-- 分析結果 -->
      <v-row v-if="analysisResult || analysisError">
        <v-col cols="12">
          <v-card v-if="analysisError" class="error-card" elevation="2">
            <v-card-title class="error-title">
              <v-icon class="mr-2" color="error">mdi-alert-circle</v-icon>
              分析エラー
            </v-card-title>
            <v-card-text>
              <div class="error-text">{{ analysisError }}</div>
            </v-card-text>
          </v-card>

          <v-card v-else-if="analysisResult" class="result-card" elevation="2">
            <v-card-title class="result-title">
              <v-icon class="mr-2" color="success">mdi-lightbulb</v-icon>
              AI分析結果
            </v-card-title>
            <v-card-text>
              <div class="analysis-content">
                <!-- 全体サマリー -->
                <div class="insight-section">
                  <h3 class="insight-title">
                    <v-icon class="mr-2" size="small">mdi-chart-timeline-variant</v-icon>
                    全体的な分析
                  </h3>
                  <p class="insight-text">{{ analysisResult.overall_summary }}</p>
                </div>

                <!-- 気分に関する洞察 -->
                <div class="insight-section">
                  <h3 class="insight-title">
                    <v-icon class="mr-2" size="small">mdi-emoticon-happy</v-icon>
                    気分・メンタル面
                  </h3>
                  <p class="insight-text">{{ analysisResult.mood_insights }}</p>
                </div>

                <!-- 活動に関する洞察 -->
                <div class="insight-section">
                  <h3 class="insight-title">
                    <v-icon class="mr-2" size="small">mdi-run</v-icon>
                    活動パターン
                  </h3>
                  <p class="insight-text">{{ analysisResult.activity_insights }}</p>
                </div>

                <!-- 改善提案 -->
                <div class="insight-section recommendations">
                  <h3 class="insight-title">
                    <v-icon class="mr-2" size="small">mdi-lightbulb-outline</v-icon>
                    改善提案
                  </h3>
                  <p class="insight-text">{{ analysisResult.recommendations }}</p>
                </div>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="clearResult" variant="text" color="primary">
                結果をクリア
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- 利用制限ダイアログ -->
      <v-dialog v-model="showRateLimitDialog" max-width="400">
        <v-card>
          <v-card-title class="text-error">
            <v-icon class="mr-2">mdi-alert-circle</v-icon>
            利用制限に達しました
          </v-card-title>
          <v-card-text>
            <p>本日のAI分析利用回数が上限に達しました。</p>
            <p>明日再度お試しください。</p>
            <div v-if="aiUsageInfo" class="mt-3">
              <div class="text-caption">利用状況:</div>
              <div>{{ aiUsageInfo.dailyUsed }} / {{ aiUsageInfo.dailyLimit }} 回使用済み</div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="showRateLimitDialog = false" color="primary">
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import apiFacade from '../services/apiFacade'

export default {
  name: 'AIAnalysisView',
  data() {
    return {
      // AI利用状況
      aiUsageInfo: null,
      isLoadingUsage: false,
      
      // 分析設定
      analysisConfig: {
        startDate: this.getDefaultStartDate(),
        endDate: this.getDefaultEndDate(),
        analysisFocus: 'BALANCED',
        detailLevel: 'STANDARD',
        responseStyle: 'FRIENDLY'
      },
      
      // 分析状態
      isAnalyzing: false,
      analysisResult: null,
      analysisError: null,
      
      // ダイアログ
      showRateLimitDialog: false,
      
      // オプション
      analysisFocusOptions: [
        { title: 'バランス重視', value: 'BALANCED' },
        { title: '気分・メンタル重視', value: 'MOOD_FOCUSED' },
        { title: '活動パターン重視', value: 'ACTIVITY_FOCUSED' },
        { title: '健康・ウェルビーイング重視', value: 'WELLNESS_FOCUSED' }
      ],
      detailLevelOptions: [
        { title: '簡潔', value: 'CONCISE' },
        { title: '標準', value: 'STANDARD' },
        { title: '詳細', value: 'DETAILED' }
      ],
      responseStyleOptions: [
        { title: 'フレンドリー', value: 'FRIENDLY' },
        { title: 'プロフェッショナル', value: 'PROFESSIONAL' },
        { title: '励まし系', value: 'ENCOURAGING' },
        { title: 'カジュアル', value: 'CASUAL' }
      ]
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    today() {
      return new Date().toISOString().slice(0, 10)
    },
    canAnalyze() {
      return this.isAuthenticated && 
             this.aiUsageInfo && 
             this.aiUsageInfo.remainingToday > 0 &&
             this.analysisConfig.startDate &&
             this.analysisConfig.endDate &&
             !this.isAnalyzing
    },
    disableReason() {
      if (!this.isAuthenticated) return 'ログインが必要です'
      if (!this.aiUsageInfo) return '利用状況を読み込み中...'
      if (this.aiUsageInfo.remainingToday <= 0) return '本日の利用上限に達しました'
      if (!this.analysisConfig.startDate || !this.analysisConfig.endDate) return '期間を設定してください'
      if (this.isAnalyzing) return '分析実行中...'
      return ''
    }
  },
  async mounted() {
    await this.loadAIUsageInfo()
  },
  methods: {
    getDefaultStartDate() {
      const date = new Date()
      date.setDate(date.getDate() - 7) // 1週間前
      return date.toISOString().slice(0, 10)
    },
    getDefaultEndDate() {
      return new Date().toISOString().slice(0, 10)
    },
    async loadAIUsageInfo() {
      this.isLoadingUsage = true
      try {
        const response = await apiFacade.getAIUsage()
        if (response.success) {
          // APIからのレスポンスのフィールド名に合わせる（キャメルケース）
          const dailyUsed = response.data.dailyUsed || response.data.daily_usage || 0
          const dailyLimit = response.data.dailyLimit || response.data.daily_limit || 5
          // remainingUsageがない場合は、limitからusedを引いて計算
          const remaining = response.data.remainingUsage || response.data.remaining_usage || 
                           (dailyLimit - dailyUsed)
          
          this.aiUsageInfo = {
            dailyUsed: dailyUsed,
            dailyLimit: dailyLimit,
            remainingToday: remaining,
            canUseToday: remaining > 0
          }
        }
      } catch (error) {
        console.error('AI利用状況の取得に失敗:', error)
        // エラーでもデフォルト値で継続
        this.aiUsageInfo = {
          dailyUsed: 0,
          dailyLimit: 5,
          remainingToday: 5,
          canUseToday: true
        }
      } finally {
        this.isLoadingUsage = false
      }
    },
    async generateAIAnalysis() {
      if (!this.canAnalyze) return
      
      this.isAnalyzing = true
      this.analysisResult = null
      this.analysisError = null
      
      try {
        const response = await apiFacade.generateAIAnalysis(this.analysisConfig)
        
        if (response.success && response.data) {
          this.analysisResult = response.data
          // 利用状況を更新
          if (response.usage_info) {
            this.updateUsageInfo(response.usage_info)
          } else {
            // レスポンスに利用状況がない場合は再取得
            await this.loadAIUsageInfo()
          }
        } else {
          this.analysisError = response.error || 'AI分析に失敗しました'
        }
      } catch (error) {
        console.error('AI分析エラー:', error)
        if (error.response?.status === 429) {
          this.showRateLimitDialog = true
          if (error.response.data?.usage_info) {
            this.updateUsageInfo(error.response.data.usage_info)
          }
        } else {
          this.analysisError = error.response?.data?.error || 'AI分析中にエラーが発生しました'
        }
      } finally {
        this.isAnalyzing = false
      }
    },
    updateUsageInfo(usageInfo) {
      if (usageInfo) {
        // APIからのレスポンスのフィールド名に合わせる（両方のパターンに対応）
        const dailyUsed = usageInfo.dailyUsed || usageInfo.daily_usage || 0
        const dailyLimit = usageInfo.dailyLimit || usageInfo.daily_limit || 5
        // remainingUsageがない場合は、limitからusedを引いて計算
        const remaining = usageInfo.remainingUsage || usageInfo.remaining_usage || 
                         (dailyLimit - dailyUsed)
        
        this.aiUsageInfo = {
          dailyUsed: dailyUsed,
          dailyLimit: dailyLimit,
          remainingToday: remaining,
          canUseToday: remaining > 0
        }
      }
    },
    clearResult() {
      this.analysisResult = null
      this.analysisError = null
    }
  }
}
</script>

<style scoped>
.ai-analysis-container {
  padding: 16px 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-icon {
  font-size: 2.2rem !important;
}

.page-description {
  color: #5a6c7d;
  font-size: 1.1rem;
  line-height: 1.5;
  margin: 0;
}

.usage-card,
.config-card,
.result-card,
.error-card {
  margin-bottom: 20px;
  border-radius: 12px !important;
}

.usage-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.remaining-text {
  color: #4caf50;
  font-size: 0.9rem;
}

.limit-reached-text {
  color: #f44336;
  font-size: 0.9rem;
}

.loading-skeleton {
  opacity: 0.6;
}

.analysis-btn {
  padding: 12px 32px !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
}

.result-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.result-title {
  color: white !important;
  font-weight: 600 !important;
}

.analysis-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.insight-section {
  margin-bottom: 24px;
}

.insight-section:last-child {
  margin-bottom: 0;
}

.insight-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.insight-text {
  color: #34495e;
  line-height: 1.6;
  font-size: 1rem;
  margin: 0;
  white-space: pre-wrap;
}

.recommendations {
  background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 0;
}

.recommendations .insight-title {
  color: #d63031;
}

.recommendations .insight-text {
  color: #2d3436;
  font-weight: 500;
}

.error-card {
  background: linear-gradient(135deg, #ff7675 0%, #d63031 100%) !important;
}

.error-title {
  color: white !important;
  font-weight: 600 !important;
}

.error-text {
  background: white;
  border-radius: 8px;
  padding: 16px;
  color: #e74c3c;
  font-weight: 500;
}

@media (max-width: 600px) {
  .page-title {
    font-size: 1.5rem;
    flex-direction: column;
    gap: 8px;
  }
  
  .title-icon {
    font-size: 1.8rem !important;
  }
  
  .analysis-btn {
    width: 100%;
    padding: 12px !important;
  }
  
  .insight-title {
    font-size: 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>