<template>
  <div class="mood-view">
    <div class="mood-header">
      <h2 class="mood-history-title">📝 気分記録</h2>
      <v-btn color="primary" @click="showMoodDialog = true" class="btn-rounded">
        気分を記録
      </v-btn>
    </div>

    <!-- 気分記録フォームダイアログ -->
    <v-dialog v-model="showMoodDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="headline">今日の気分を記録</v-card-title>
        <v-card-text>
          <v-form ref="moodForm" v-model="moodFormValid">
            <!-- 日付選択 -->
            <VueDatePicker
              v-model="selectedDate"
              placeholder="日付を選択"
              format="yyyy/MM/dd"
              model-type="yyyy-MM-dd"
              :enable-time-picker="false"
              :input-props="{ outlined: true, class: 'input-rounded' }"
              class="mb-4"
            />

            <!-- 気分評価 -->
            <div class="mood-rating-section">
              <label class="mood-label">気分評価</label>
              <div class="mood-emoji-container">
                <div
                  v-for="mood in moodOptions"
                  :key="mood.value"
                  class="mood-emoji-item"
                  :class="{ 'selected': selectedMood === mood.value }"
                  @click="selectedMood = mood.value"
                >
                  <div class="mood-emoji">{{ mood.emoji }}</div>
                  <div class="mood-text">{{ mood.label }}</div>
                </div>
              </div>
            </div>

            <!-- メモ -->
            <v-textarea
              v-model="moodNote"
              label="メモ（任意）"
              placeholder="今日の気分についてメモを残しましょう"
              rows="3"
              outlined
              class="input-rounded mt-4"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="closeMoodDialog" class="btn-rounded">
            キャンセル
          </v-btn>
          <v-btn
            color="primary"
            @click="saveMood"
            :disabled="!isMoodFormValid"
            class="btn-rounded"
          >
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 気分履歴と分析 -->
    <div v-if="loading" class="loading-container">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p>気分記録を読み込み中...</p>
    </div>
    
    <div v-else class="mood-content">
      <!-- 気分履歴 -->
      <div class="mood-history-section">
        <h3>最近の気分履歴</h3>
        <div v-if="recentMoods.length === 0" class="empty-state">
          <v-icon size="64" color="grey">mdi-emoticon-neutral</v-icon>
          <p>まだ気分記録がありません</p>
          <v-btn color="primary" @click="showMoodDialog = true" class="btn-rounded">
            最初の気分を記録
          </v-btn>
        </div>
        <div v-else class="mood-history-list">
          <div
            v-for="mood in recentMoods"
            :key="mood.date"
            class="mood-history-item"
          >
            <div class="mood-date">{{ formatDate(mood.date) }}</div>
            <div class="mood-display">
              <span class="mood-emoji-display">{{ getMoodEmoji(mood.mood) }}</span>
              <span class="mood-label-display">{{ getMoodLabel(mood.mood) }}</span>
            </div>
            <div v-if="mood.note" class="mood-note">{{ mood.note }}</div>
            <div class="mood-actions">
              <v-btn
                icon
                small
                @click="editMood(mood)"
                class="edit-btn"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                @click="deleteMood(mood)"
                class="delete-btn"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <!-- 気分分析 -->
      <div v-if="recentMoods.length > 0" class="mood-analysis-section">
        <h3>気分分析</h3>
        <div class="analysis-cards">
          <!-- 平均気分 -->
          <v-card class="analysis-card">
            <v-card-text>
              <div class="analysis-title">平均気分</div>
              <div class="analysis-value">
                <span class="average-mood">{{ averageMood }}</span>
                <span class="average-emoji">{{ getMoodEmoji(Math.round(averageMood)) }}</span>
              </div>
            </v-card-text>
          </v-card>

          <!-- 気分分布 -->
          <v-card class="analysis-card">
            <v-card-text>
              <div class="analysis-title">気分分布</div>
              <div class="mood-distribution">
                <div
                  v-for="dist in moodDistribution"
                  :key="dist.mood"
                  class="distribution-item"
                >
                  <span class="distribution-emoji">{{ getMoodEmoji(dist.mood) }}</span>
                  <span class="distribution-count">{{ dist.count }}回</span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </div>

    <!-- 週間気分グラフ -->
    <div v-if="recentMoods.length > 0" class="mood-chart-section">
      <div class="chart-header">
        <h3>気分推移</h3>
        <div class="date-range-selector">
          <VueDatePicker
            v-model="chartDateRange"
            range
            placeholder="期間を選択"
            format="yyyy/MM/dd"
            model-type="yyyy-MM-dd"
            :enable-time-picker="false"
            :input-props="{ outlined: true, class: 'date-input' }"
            class="date-picker"
            @update:model-value="onDateRangeChange"
          />
        </div>
      </div>
      <div class="chart-container">
        <v-chart class="chart" :option="chartOption" />
      </div>
    </div>
  </div>
</template>

<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import apiFacade from "../services/apiFacade";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

export default {
  name: "MoodView",
  components: {
    VueDatePicker,
    VChart,
  },
  data() {
    return {
      // 気分記録ダイアログの状態管理
      showMoodDialog: false, // ダイアログの表示状態
      moodFormValid: false, // フォームのバリデーション状態
      selectedDate: new Date().toISOString().split("T")[0], // 選択された日付（デフォルト：今日）
      selectedMood: null, // 選択された気分値（1-5）
      moodNote: "", // 気分記録のメモ
      
      // 気分評価の選択肢（1-5段階）
      moodOptions: [
        { value: 1, emoji: "😢", label: "とても悪い" },
        { value: 2, emoji: "😕", label: "悪い" },
        { value: 3, emoji: "😐", label: "普通" },
        { value: 4, emoji: "🙂", label: "良い" },
        { value: 5, emoji: "😄", label: "とても良い" },
      ],

      // 気分記録データの管理
      recentMoods: [], // 取得した気分記録の配列
      loading: false, // データ読み込み中の状態
      
      // グラフ表示期間の選択
      chartDateRange: null, // 選択された日付範囲 [開始日, 終了日]
    };
  },
  computed: {
    isMoodFormValid() {
      return this.selectedDate && this.selectedMood !== null;
    },
    averageMood() {
      if (this.recentMoods.length === 0) return 0;
      const sum = this.recentMoods.reduce((acc, mood) => acc + mood.mood, 0);
      return (sum / this.recentMoods.length).toFixed(1);
    },
    moodDistribution() {
      const distribution = {};
      for (let i = 1; i <= 5; i++) {
        distribution[i] = 0;
      }
      
      this.recentMoods.forEach(mood => {
        distribution[mood.mood]++;
      });
      
      return Object.entries(distribution)
        .map(([mood, count]) => ({
          mood: parseInt(mood),
          count
        }))
        .sort((a, b) => b.mood - a.mood); // 降順（5→1）にソート
    },
    weeklyMoodData() {
      // 選択された期間の気分データを生成
      if (!this.chartDateRange || this.chartDateRange.length !== 2) {
        return [];
      }
      
      const [startDateStr, endDateStr] = this.chartDateRange;
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      const dayData = [];
      
      // 開始日から終了日までの各日を処理
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // その日の気分記録を探す
        const moodRecord = this.recentMoods.find(mood => mood.date === dateStr);
        const moodValue = moodRecord ? moodRecord.mood : null;
        
        dayData.push({
          date: dateStr,
          mood: moodValue,
          displayDate: currentDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
        });
        
        // 次の日へ
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return dayData;
    },
    chartOption() {
      const weekData = this.weeklyMoodData;
      const dates = weekData.map(item => item.displayDate);
      const moods = weekData.map(item => item.mood);
      
      return {
        title: {
          text: '週間気分推移',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            const data = params[0];
            if (data.value === null) {
              return `${data.axisValue}<br/>記録なし`;
            }
            const moodLabels = ['', 'とても悪い', '悪い', '普通', '良い', 'とても良い'];
            const moodEmojis = ['', '😢', '😕', '😐', '🙂', '😄'];
            return `${data.axisValue}<br/>気分: ${moodEmojis[data.value]} ${moodLabels[data.value]}`;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dates,
          axisLabel: {
            color: '#666'
          }
        },
        yAxis: {
          type: 'value',
          min: 1,
          max: 5,
          interval: 1,
          axisLabel: {
            color: '#666',
            fontSize: 20,
            formatter: function(value) {
              const emojis = ['', '😢', '😕', '😐', '🙂', '😄'];
              return emojis[value] || '';
            }
          }
        },
        series: [
          {
            name: '気分',
            type: 'line',
            data: moods,
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#2196f3'
            },
            lineStyle: {
              color: '#2196f3',
              width: 3
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(33, 150, 243, 0.3)' },
                  { offset: 1, color: 'rgba(33, 150, 243, 0.1)' }
                ]
              }
            },
            markPoint: {
              data: [
                { type: 'max', name: '最高気分' },
                { type: 'min', name: '最低気分' }
              ],
              itemStyle: {
                color: '#ff9800'
              }
            }
          }
        ]
      };
    },
  },
  async mounted() {
    await this.loadMoodRecords();
    this.setDefaultChartPeriod();
  },
  methods: {
    /**
     * 気分記録をAPIから取得する
     * 取得したデータはrecentMoodsに保存され、ローディング状態も管理する
     */
    async loadMoodRecords() {
      try {
        this.loading = true;
        const userId = this.$store.state.userId;
        const response = await apiFacade.getMoodRecords(userId);
        this.recentMoods = response.moodRecords || [];
      } catch (error) {
        console.error("気分記録の読み込みに失敗:", error);
        this.recentMoods = [];
      } finally {
        this.loading = false;
      }
    },
    /**
     * グラフのデフォルト表示期間を設定する
     * 今日から過去1週間（7日間）をデフォルトとする
     */
    setDefaultChartPeriod() {
      const today = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 6); // 6日前（今日含めて7日間）
      
      this.chartDateRange = [
        weekAgo.toISOString().split('T')[0], // 開始日
        today.toISOString().split('T')[0]    // 終了日
      ];
    },

    /**
     * 日付範囲が変更された時の処理
     * computedプロパティが自動的に再計算されるため、特別な処理は不要
     */
    onDateRangeChange() {
      // 日付範囲変更時の処理（必要に応じて追加）
    },
    getMoodEmoji(mood) {
      const moodOption = this.moodOptions.find(option => option.value === mood);
      return moodOption ? moodOption.emoji : "😐";
    },
    getMoodLabel(mood) {
      const moodOption = this.moodOptions.find(option => option.value === mood);
      return moodOption ? moodOption.label : "不明";
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("ja-JP", {
        month: "short",
        day: "numeric",
        weekday: "short"
      });
    },
    closeMoodDialog() {
      this.showMoodDialog = false;
      this.resetMoodForm();
    },
    resetMoodForm() {
      this.selectedDate = new Date().toISOString().split("T")[0];
      this.selectedMood = null;
      this.moodNote = "";
    },
    async saveMood() {
      if (!this.isMoodFormValid) return;

      const moodData = {
        date: this.selectedDate,
        mood: this.selectedMood,
        note: this.moodNote,
        userId: this.$store.state.userId,
      };

      try {
        // 既存の記録があるかチェック
        const existingIndex = this.recentMoods.findIndex(
          mood => mood.date === this.selectedDate
        );

        if (existingIndex !== -1) {
          // 更新
          await apiFacade.updateMoodRecord(moodData);
          this.recentMoods[existingIndex] = moodData;
        } else {
          // 新規追加
          await apiFacade.createMoodRecord(moodData);
          this.recentMoods.unshift(moodData);
        }

        this.closeMoodDialog();
        alert("気分記録を保存しました！");
      } catch (error) {
        console.error("気分記録の保存に失敗:", error);
        alert("気分記録の保存に失敗しました。");
      }
    },
    editMood(mood) {
      this.selectedDate = mood.date;
      this.selectedMood = mood.mood;
      this.moodNote = mood.note || "";
      this.showMoodDialog = true;
    },
    async deleteMood(mood) {
      if (confirm("この気分記録を削除しますか？")) {
        try {
          const userId = this.$store.state.userId;
          if (!userId) {
            console.error('ユーザーIDが取得できません。');
            alert('ユーザー情報が取得できません。再ログインしてください。');
            return;
          }
          
          console.log(`気分記録削除: date=${mood.date}, userId=${userId}`);
          await apiFacade.deleteMoodRecord(mood.date, userId);
          
          const index = this.recentMoods.findIndex(m => m.date === mood.date);
          if (index !== -1) {
            this.recentMoods.splice(index, 1);
          }
          
          alert("気分記録を削除しました。");
        } catch (error) {
          console.error("気分記録の削除に失敗:", error);
          alert(`気分記録の削除に失敗しました: ${error.message}`);
        }
      }
    },
  },
};
</script>

<style scoped>
.mood-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.mood-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.mood-header h2 {
  margin: 0;
  color: #333;
  font-size: 2rem;
  font-weight: 600;
}

.mood-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.mood-history-section,
.mood-analysis-section {
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* ライトモード */
.v-theme--light .mood-history-section,
.v-theme--light .mood-analysis-section {
  background: white;
}

/* ダークモード */
.v-theme--dark .mood-history-section,
.v-theme--dark .mood-analysis-section {
  background: rgb(var(--v-theme-surface));
}

/* ライトモード - テキスト */
.v-theme--light .mood-history-section h3, h2,
.v-theme--light .mood-analysis-section h3, h2{
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

/* ダークモード - テキスト */
.v-theme--dark .mood-history-section h3,
.v-theme--dark .mood-analysis-section h3,
.v-theme--dark .mood-history-section h2,
.v-theme--dark .mood-analysis-section h2 {
  margin: 0 0 20px 0;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
}

.v-theme--dark .mood-label-display {
  font-weight: 500;
  color: #ffffff;
}

.v-theme--dark .mood-note {
  flex: 2;
  color: #cccccc;
  font-size: 0.9rem;
}

.v-theme--dark .mood-date {
  min-width: 120px;
  font-weight: 600;
  color: #ffffff;
  font-size: 0.9rem;
}

.v-theme--dark .mood-history-title,
.v-theme--dark .mood-header h2 {
  color: #ffffff;
}

.v-theme--dark .empty-mood-state p {
  margin: 15px 0;
  color: #cccccc;
  font-size: 1.1rem;
}

/* 気分評価セクション */
.mood-rating-section {
  margin-bottom: 20px;
}

.mood-label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #333;
}

.v-theme--dark .mood-label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #ffffff;
}

.mood-emoji-container {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.mood-emoji-item {
  flex: 1;
  text-align: center;
  padding: 15px 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mood-emoji-item:hover {
  border-color: #2196f3;
  background-color: #f5f5f5;
}

.mood-emoji-item.selected {
  border-color: #2196f3;
  background-color: #e3f2fd;
}

.mood-emoji {
  font-size: 2rem;
  margin-bottom: 5px;
}

.mood-text {
  font-size: 0.9rem;
  color: #666;
}

/* 気分履歴 */
.mood-history-list {
  max-height: 400px;
  overflow-y: auto;
}

.mood-history-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  gap: 15px;
}

.mood-history-item:last-child {
  border-bottom: none;
}

.mood-date {
  min-width: 80px;
  font-weight: 600;
  color: #666;
}

.mood-display {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.mood-emoji-display {
  font-size: 1.5rem;
}

.mood-label-display {
  font-weight: 500;
  color: #333;
}

.mood-note {
  flex: 2;
  color: #666;
  font-size: 0.9rem;
}

.mood-actions {
  display: flex;
  gap: 5px;
}

.edit-btn,
.delete-btn {
  color: #666;
}

.delete-btn:hover {
  color: #f44336;
}

/* 分析セクション */
.analysis-cards {
  display: grid;
  gap: 20px;
}

.analysis-card {
  border-radius: 8px;
}

.analysis-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.v-theme--dark .analysis-title {
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 10px;
}

.analysis-value {
  display: flex;
  align-items: center;
  gap: 10px;
}

.average-mood {
  font-size: 2rem;
  font-weight: 700;
  color: #2196f3;
}

.average-emoji {
  font-size: 2rem;
}

.mood-distribution {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.distribution-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.distribution-item:last-child {
  border-bottom: none;
}

.distribution-emoji {
  font-size: 1.2rem;
}

.distribution-count {
  font-weight: 600;
  color: #333;
}

.v-theme--dark .distribution-count {
  font-weight: 600;
  color: #ffffff;
}

/* ローディング状態 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-container p {
  margin-top: 20px;
  color: #666;
  font-size: 1.1rem;
}

/* 空の状態 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-state p {
  margin: 20px 0;
  color: #666;
  font-size: 1.1rem;
}

/* レスポンシブデザイン */
@media (max-width: 768px) {
  .mood-content {
    grid-template-columns: 1fr;
  }
  
  .mood-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .mood-emoji-container {
    flex-wrap: wrap;
  }
  
  .mood-emoji-item {
    flex: 1 1 calc(50% - 5px);
  }
  
  .mood-history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .mood-display {
    width: 100%;
  }
  
  .mood-note {
    width: 100%;
  }
  
  .mood-actions {
    align-self: flex-end;
  }
}

/* ボタンスタイル */
.btn-rounded {
  border-radius: 24px;
  font-weight: 600;
}

.input-rounded {
  border-radius: 8px;
}

/* 気分グラフセクション */
.mood-chart-section {
  margin-top: 30px;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* ライトモード - チャートセクション */
.v-theme--light .mood-chart-section {
  background: white;
}

/* ダークモード - チャートセクション */
.v-theme--dark .mood-chart-section {
  background: rgb(var(--v-theme-surface));
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.chart-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.v-theme--dark .chart-header h3 {
  margin: 0;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
}

.date-range-selector {
  display: flex;
  align-items: center;
}

.date-picker {
  width: 200px;
}

.date-input {
  font-size: 0.9rem;
}

.chart-container {
  width: 100%;
  height: 400px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style> 