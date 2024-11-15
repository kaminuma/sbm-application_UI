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
          <v-card-title class="headline">{{
            isEdit ? "イベントを更新" : "新規イベントを登録"
          }}</v-card-title>
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
            <br />
            <v-manu>
              <VueDatePicker
                placeholder="日付"
                v-model="selectedDate"
                format="yyyy/MM/dd"
                model-type="yyyy-MM-dd"
                :enable-time-picker="false"
              />
            </v-manu>
            <br />
            <v-manu>
              <VueDatePicker
                time-picker
                disable-time-range-validation
                v-model="selectedEventStartTime"
                placeholder="開始時刻"
                type="time"
                format="HH:mm"
              />
            </v-manu>
            <br />
            <v-manu>
              <VueDatePicker
                time-picker
                disable-time-range-validation
                v-model="selectedEventEndTime"
                placeholder="終了時刻"
                type="time"
                format="HH:mm"
              />
            </v-manu>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="saveEvent">{{
              isEdit ? "更新" : "保存"
            }}</v-btn>
            <v-btn color="primary" text @click="dialog = false">閉じる</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import VueCal from "vue-cal";
import apiFacade from "../services/apiFacade";
import "vue-cal/dist/vuecal.css";
import "vuetify/dist/vuetify.min.css";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  components: {
    VueCal,
  },
  computed: {
    userId() {
      return this.$store.state.userId; // VuexストアからuserIdを取得
    },
  },
  data() {
    return {
      events: [],
      dialog: false,
      isEdit: false,
      selectedEventTitle: "",
      selectedEventContents: "",
      selectedEventStartTime: "",
      selectedEventEndTime: "",
      selectedDate: "",
      dataPicker: "",
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
        console.error("Error fetching activities:", error);
      }
    },
    handleDateClick(date) {
      const clickedDateTime = new Date(date);
      this.selectedDateTime = clickedDateTime;

      // clickedDateTimeを基にイベントを検索
      const clickedEvent = this.events.find((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return this.events; // イベントがあるかどうか
      });

      if (clickedEvent) {
        // クリックしたイベントの詳細を設定
        this.selectedEventTitle = clickedEvent.title;
        this.selectedEventContents = clickedEvent.contents; // 詳細を設定
        this.isEdit = true;
        this.selectedEventStartTime = new Date(
          clickedEvent.start
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        this.selectedEventEndTime = new Date(
          clickedEvent.end
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      } else {
        // 新規イベントのための初期化
        this.selectedEventTitle = "";
        this.selectedEventContents = "";
        this.selectedEventStartTime = ""; // 空に初期化
        this.selectedEventEndTime = ""; // 空に初期化
        this.isEdit = false;
      }
      // ダイアログを表示
      this.dialog = true;
    },
    newCreate(date) {
      this.selectedDate = "";
      this.selectedEventTitle = "";
      this.selectedEventContents = "";
      this.selectedEventStartTime = "";
      this.selectedEventEndTime = "";
      this.isEdit = false;
      this.dialog = true;
    },
    saveEvent() {
      if (this.isEdit) {
        const eventIndex = this.events.findIndex((event) => {
          const eventStart = new Date(event.start);
          return eventStart.getTime() === this.selectedDateTime.getTime();
        });

        if (eventIndex !== -1) {
          this.events[eventIndex].title = this.selectedEventTitle;
          this.events[eventIndex].details = this.selectedEventContents;
          this.events[eventIndex].start = new Date(
            `${this.selectedDateTime.toDateString()} ${this.selectedEventStartTime}`
          ).toISOString();
          this.events[eventIndex].end = new Date(
            `${this.selectedDateTime.toDateString()} ${this.selectedEventEndTime}`
          ).toISOString();
        }
      } else {
        this.formatTime(this.selectedEventStartTime, "start");
        this.formatTime(this.selectedEventEndTime, "end");
        const eventData = {
          userId: this.userId,
          date: this.selectedDate,
          start: this.selectedEventStartTime,
          end: this.selectedEventEndTime,
          title: this.selectedEventTitle,
          contents: this.selectedEventContents,
        };
        apiFacade
          .createActivity(eventData)
          .then(() => {
            return this.fetchActivities(); // 成功したら再取得して一覧を更新
          })
          .then(() => {
            this.dialog = false; // ダイアログを閉じる
          })
          .catch((error) => {
            console.error("Error adding event:", error); // エラーハンドリング
          });
      }
      this.dialog = false;
    },
    // 時間をHH:mm形式に変換して格納
    formatTime(timeObj, type) {
      if (timeObj && timeObj.hours !== undefined) {
        // HH:mm形式にフォーマット
        const hours = String(timeObj.hours).padStart(2, "0");
        const minutes = String(timeObj.minutes).padStart(2, "0");
        const formattedTime = `${hours}:${minutes}`;

        // API用に変換された時間を格納
        if (type === "start") {
          this.selectedEventStartTime = formattedTime;
        } else if (type === "end") {
          this.selectedEventEndTime = formattedTime;
        }
      }
    },
  },
};
</script>

<style scoped>
.v-calendar {
  height: 400px; /* カレンダーの高さ */
}
.custom-dialog .v-card {
  height: 80vh;
}
</style>
