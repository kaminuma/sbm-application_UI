<template>
  <v-app>
    <v-main>
      <div>
        <v-btn color="primary" @click="newCreate">新規記録</v-btn>
      </div>
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
        @event-click="handleDateClick"
      ></vue-cal>
      <v-dialog v-model="dialog" max-width="400" class="custom-dialog">
        <v-card>
          <v-card-title class="headline">{{ isEdit ? 'イベントを更新' : '新規イベントを登録' }}</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="selectedEventTitle"
              label="イベントタイトル"
              placeholder="タイトルを入力"
            ></v-text-field>
            <v-textarea
              v-model="selectedEventContents"
              label="イベント詳細"
              placeholder="詳細を入力"
              rows="3"
            ></v-textarea>
            <v-menu
            v-model="datePicker"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="selectedDate"
                label="日付"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="on"
              ></v-text-field>
              <VueDatePicker v-model="selectedDate"
              format="yyyy/MM/dd"
              model-type="yyyy-MM-dd"/>
            </template>
          </v-menu>
            <v-text-field
              v-model="selectedEventStartTime"
              label="開始時間"
              placeholder="HH:mm形式で入力"
            ></v-text-field>
            <v-text-field
              v-model="selectedEventEndTime"
              label="終了時間"
              placeholder="HH:mm形式で入力"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="saveEvent">{{ isEdit ? '更新' : '保存' }}</v-btn>
            <v-btn color="primary" text @click="dialog = false">閉じる</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import VueCal from 'vue-cal';
import apiFacade from '../services/apiFacade';
import 'vue-cal/dist/vuecal.css';
import 'vuetify/dist/vuetify.min.css';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
  components: {
    VueCal,
  },
  data() {
    return {
      events: [],
      userId: 9999,
      dialog: false,
      isEdit: false,
      selectedEventTitle: '',
      selectedEventContents: '',
      selectedEventStartTime: '',
      selectedEventEndTime: '',
      selectedDateTime: null,
      dataPicker: '',
    };
  },
  created() {
    this.fetchActivities();
  },
  methods: {
    async fetchActivities() {
      try {
        const activities = await apiFacade.getActivities(this.userId);
        this.events = activities;
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    },
    handleDateClick(date) {
      const clickedDateTime = new Date(date);
      this.selectedDateTime = clickedDateTime;

      // clickedDateTimeを基にイベントを検索
      const clickedEvent = this.events.find(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
        return this.events; // イベントがあるかどうか
      });

      if (clickedEvent) {
      // クリックしたイベントの詳細を設定
        this.selectedEventTitle = clickedEvent.title;
        this.selectedEventContents = clickedEvent.contents; // 詳細を設定
        this.isEdit = true;
        this.selectedEventStartTime = new Date(clickedEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.selectedEventEndTime = new Date(clickedEvent.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
      // 新規イベントのための初期化
        this.selectedEventTitle = '';
        this.selectedEventContents = '';
        this.selectedEventStartTime = ''; // 空に初期化
        this.selectedEventEndTime = ''; // 空に初期化
        this.isEdit = false;
      }
      // ダイアログを表示
     this.dialog = true;
    },
    newCreate(date) {
      this.selectedDateTime = new Date(date);
      this.selectedEventTitle = '';
      this.selectedEventContents = '';
      this.selectedEventStartTime = '';
      this.selectedEventEndTime = '';
      this.isEdit = false;
      this.dialog = true;
    },
    saveEvent() {
      if (this.isEdit) {
        const eventIndex = this.events.findIndex(event => {
          const eventStart = new Date(event.start);
          return eventStart.getTime() === this.selectedDateTime.getTime();
        });

        if (eventIndex !== -1) {
          this.events[eventIndex].title = this.selectedEventTitle;
          this.events[eventIndex].details = this.selectedEventContents;
          this.events[eventIndex].start = new Date(`${this.selectedDateTime.toDateString()} ${this.selectedEventStartTime}`).toISOString();
          this.events[eventIndex].end = new Date(`${this.selectedDateTime.toDateString()} ${this.selectedEventEndTime}`).toISOString();
        }
      } else {
        const eventData = {
          userId: this.userId,
          date: this.selectedDate,
          start: this.selectedEventStartTime,
          end: this.selectedEventEndTime,
          title: this.selectedEventTitle,
          contents: this.selectedEventContents,
        };
        apiFacade.createActivity(eventData) 
          .then(() => {
              return this.fetchActivities(); // 成功したら再取得して一覧を更新
          })
          .then(() => {
              this.dialog = false; // ダイアログを閉じる
          })
          .catch(error => {
              console.error('Error adding event:', error); // エラーハンドリング
          });
      }
      this.dialog = false;
    },
  }
}
</script>

<style scoped>
.v-calendar {
  height: 400px; /* カレンダーの高さ */
}
.custom-dialog .v-card {
  height: 80vh;
}
</style>
