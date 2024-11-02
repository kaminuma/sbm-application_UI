<template>
  <v-app>
    <v-main>
      <vue-cal
        :disable-views="['years', 'year', 'month']"
        :time-from="7 * 60"
        :time-to="24 * 60"
        :special-hours="specialHours"
        :events="events"
        class="vuecal--blue-theme vuecal--date-picker demo"
        xsmall
        :selected-date="selectedDate"
        hide-view-selector
        :transitions="false"
        @cell-click="handleDateClick"
      ></vue-cal>
      <v-dialog v-model="dialog" max-width="290">
        <v-card>
          <v-card-title class="headline">{{ selectedEventTitle }}</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import VueCal from 'vue-cal';
import apiFacade from '../services/apiFacade';
import 'vue-cal/dist/vuecal.css'; // CSSをインポート

export default {
  components: {
    VueCal,
  },
  data() {
    return {
      events: [], // カレンダーに表示するイベント
      userId: 9999,  // ユーザーIDのサンプル値（必要に応じて変更）
      dialog: false, // ダイアログの表示状態
      selectedEventTitle: '', // 選択されたイベントのタイトル
      selectedDate: new Date(), // 選択された日付の初期値
    };
  },
  created() {
    this.fetchActivities();
  },
  methods: {
    async fetchActivities() {     
      try {
        const activities = await apiFacade.getActivities(this.userId); 

        // 活動をカレンダー用の形式に変換
        this.events = activities;
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    },

    handleDateClick(date) {
      const clickedDate = date.toISOString().substr(0, 10);
      // クリックされた日付のイベントを検索
      const clickedEvent = this.events.find(event => {
        const eventStartDate = new Date(event.start).toISOString().substr(0, 10);
        const eventEndDate = new Date(event.end).toISOString().substr(0, 10);
        return clickedDate >= eventStartDate && clickedDate <= eventEndDate; // 日付が一致するイベントを探す
      });

      if (clickedEvent) { // イベントが見つかった場合
        this.selectedEventTitle = clickedEvent.title; // タイトルを設定
        this.dialog = true; // ダイアログを表示
      }
    }
  },
};
</script>

<style scoped>
.v-calendar {
  height: 600px;
}
</style>
