<template>
  <v-app>
    <v-main>
      <vue-cal :events="events"></vue-cal>
    </v-main>
  </v-app>
</template>

<script>
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css'; // CSSをインポート

export default {
  components: {
    VueCal,
  },
  data() {
    return {
      events: [
        {
          start: '2024-10-19',
          end: '2024-10-19',
          title: 'Event 1',
        },
        {
          start: '2024-10-21',
          end: '2024-10-22',
          title: 'Event 2',
        },
      ],
     dialog: false, // ダイアログの表示状態
     selectedEventTitle: '', // 選択されたイベントのタイトル
    };
  },
  methods: { 
    handleDateClick(date) {
      const clickedDate = date.toISOString().substr(0, 10);
      // クリックされた日付のイベントを検索
      const clickedEvent = this.events.find(event => {
      const eventStartDate = new Date(event.start).toISOString().substr(0, 10);
      const eventEndDate = new Date(event.end).toISOString().substr(0, 10);
      return clickedDate >= eventStartDate && clickedDate <= eventEndDate; // 日付が一致するイベントを探す
    });
      this.selectedEventTitle = clickedEvent.title; // タイトルを設定
      this.dialog = true; // ダイアログを表示
    }
  },
};
</script>

<style scoped>
.v-calendar {
  height: 600px;
}
</style>