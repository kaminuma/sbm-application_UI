<template>
  <div class="analyze-container">
    <!-- ヘッダーセクション -->
    <div class="analyze-header">
      <h2>📊 生活記録分析</h2>
    </div>
    
    <div v-if="loading" class="loading-screen">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>データを分析中です...</p>
      </div>
    </div>
    <div v-else>
      <!-- カテゴリ説明 -->
      <div class="category-banner">
        <p>
          現在のカテゴリ一覧:
          <span
            v-for="(category, index) in categories"
            :key="index"
            class="category-item"
          >
            {{ category }}<span v-if="index !== categories.length - 1">, </span>
          </span>
        </p>
      </div>
      <div class="filter-section">
        <div class="date-pickers">
          <label>開始日：</label>
          <VueDatePicker v-model="startDate" :format="'yyyy-MM-dd'" />
          <label>終了日：</label>
          <VueDatePicker v-model="endDate" :format="'yyyy-MM-dd'" />
        </div>
        <button @click="fetchData" class="fetch-button">分析更新</button>
      </div>

      <div class="analysis-result">
        <div class="chart-section">
          <h2>カテゴリー別合計時間</h2>
          <DoughnutChart
            v-if="chartData"
            :chartData="chartData"
            :chartOptions="chartOptions"
          />
        </div>

        <div class="activities-section">
          <h2>活動一覧</h2>
          <table class="activity-table">
            <thead>
              <tr>
                <th>日付</th>
                <th>カテゴリー</th>
                <th>名称</th>
                <th>詳細</th>
                <th>期間</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(activity, index) in activities" :key="index">
                <td>{{ formatDate(activity.date) }}</td>
                <td>{{ activity.category }}</td>
                <td>{{ activity.name }}</td>
                <td>
                  <div class="activity-contents">{{ activity.contents }}</div>
                </td>
                <td>{{ convertToHoursMinutes(activity.duration_seconds) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useStore } from "vuex";
import DoughnutChart from "./DoughnutChart.vue";
import apiFacade from "../services/apiFacade";

export default {
  name: "AnalyzeView",
  components: {
    VueDatePicker,
    DoughnutChart,
  },
  data() {
    const store = useStore();
    return {
      userId: store.getters.getUserId,
      startDate: new Date(),
      endDate: new Date(),
      dateFormat: "yyyy-MM-dd",
      activities: [],
      totalTimePerCategory: [],
      loading: false, // ローディング状態の管理
      categories: [
        "運動",
        "仕事",
        "学習",
        "趣味",
        "食事",
        "睡眠",
        "買い物",
        "娯楽",
        "休憩",
        "家事",
      ],
    };
  },
  computed: {
    chartData() {
      if (
        !this.totalTimePerCategory ||
        this.totalTimePerCategory.length === 0
      ) {
        console.warn("No data for chart.");
        return null;
      }

      const categories = this.totalTimePerCategory.map((item) => item.category);
      const times = this.totalTimePerCategory.map((item) => {
        const match = item.total_time.match(/(\d+)時間/);
        return match ? parseInt(match[1], 10) : 0;
      });

      if (categories.length === 0 || times.length === 0) {
        console.warn("Invalid data for chart.");
        return null;
      }

      return {
        labels: categories,
        datasets: [
          {
            data: times,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
            ],
          },
        ],
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              generateLabels: (chart) => {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const dataset = data.datasets[0];
                    const value = dataset.data[i];
                    const meta = chart.getDatasetMeta(0);
                    const style = meta.controller.getStyle(i);
                    return {
                      text: `${label}: ${value}時間`,
                      fillStyle: style.backgroundColor,
                      hidden: isNaN(dataset.data[i]) || meta.data[i].hidden,
                      lineCap: style.borderCapStyle,
                      lineDash: style.borderDash,
                      lineDashOffset: style.borderDashOffset,
                      lineJoin: style.borderJoinStyle,
                      lineWidth: style.borderWidth,
                      strokeStyle: style.borderColor,
                      pointStyle: style.pointStyle,
                      rotation: style.rotation,
                    };
                  });
                }
                return [];
              },
            },
          },
          title: {
            display: false,
          },
        },
      };
    },
  },
  methods: {
    async fetchData() {
      if (!this.userId) return;

      this.loading = true; // ローディング開始
      const start = this.formatToISODate(this.startDate);
      const end = this.formatToISODate(this.endDate);

      try {
        const data = await apiFacade.getAnalysisData({
          userId: this.userId,
          startDate: start,
          endDate: end,
        });
        this.activities = data.activities;
        this.totalTimePerCategory = data.total_time_per_category;
      } catch (error) {
        console.error("Error fetching analysis data:", error);
      } finally {
        this.loading = false; // ローディング終了
      }
    },
    formatToISODate(date) {
      if (!(date instanceof Date)) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
    },
    convertToHoursMinutes(seconds) {
      if (!seconds) return "";
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}時間${minutes}分`;
    },
  },
};
</script>

<style scoped>
.analyze-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.analyze-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--theme-border);
}

.analyze-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--theme-text-primary);
  font-family: "Poppins", sans-serif;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap; /* 横幅が狭い場合に自動で改行 */
}

.date-pickers {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: nowrap; /* 横並びを保つ */
}

.date-pickers label {
  white-space: nowrap; /* ラベルの改行を防止 */
}

.fetch-button {
  padding: 8px 16px;
  background: var(--theme-accent-blue);
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.fetch-button:hover {
  background: #2a84c9;
}

.analysis-result {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.chart-section {
  width: 100%;
  max-width: 500px;
  height: 300px;
  margin: 0 auto;
  position: relative;
}

.activities-section {
  width: 100%;
}

.activity-table {
  width: 100%;
  border-collapse: collapse;
}

.activity-table th,
.activity-table td {
  border: 1px solid var(--theme-outline-strong);
  padding: 8px;
  text-align: left;
  color: var(--theme-text-primary);
}

.activity-table tbody tr td {
  color: var(--theme-text-secondary);
}

.activity-table th {
  background: var(--theme-bg-secondary);
}

.activity-contents {
  white-space: pre-wrap;
  line-height: 1.4;
}

/* ローディング画面のスタイル */
.v-theme--light .loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.v-theme--dark .loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.v-theme--light .loading-content {
  text-align: center;
  font-family: Arial, sans-serif;
  color: #333;
}

.v-theme--dark .loading-content {
  text-align: center;
  font-family: Arial, sans-serif;
  color: #ffffff;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid var(--theme-accent-blue);
  border-top: 5px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 10px auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.category-banner {
  background: var(--theme-bg-secondary);
  padding: 10px 15px;
  margin-bottom: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.category-banner p {
  margin: 0;
  font-size: 14px;
  color: var(--theme-text-primary);
}

.category-item {
  font-weight: bold;
  color: var(--theme-accent-blue);
}

.v-theme--dark .category-item {
  font-weight: bold;
  color: #4fc3f7;
}
</style>
