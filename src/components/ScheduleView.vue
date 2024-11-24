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

      <!-- 新規イベント作成ダイアログ -->
      <v-dialog v-model="createDialog" max-width="400" class="custom-dialog">
        <v-card>
          <v-card-title class="headline">新規イベントを登録</v-card-title>
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
            <div>
              <VueDatePicker
                placeholder="日付"
                v-model="selectedDate"
                format="yyyy/MM/dd"
                model-type="yyyy-MM-dd"
                :enable-time-picker="false"
              />
            </div>
            <br />
            <div>
              <VueDatePicker
                time-picker
                disable-time-range-validation
                v-model="selectedEventStartTime"
                placeholder="開始時刻"
                type="time"
                format="HH:mm"
              />
            </div>
            <br />
            <div>
              <VueDatePicker
                time-picker
                disable-time-range-validation
                v-model="selectedEventEndTime"
                placeholder="終了時刻"
                type="time"
                format="HH:mm"
              />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="saveEvent">保存</v-btn>
            <v-btn color="primary" text @click="createDialog = false"
              >閉じる</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- イベント編集ダイアログ -->
      <v-dialog v-model="editDialog" max-width="400" class="custom-dialog">
        <v-card>
          <v-card-title class="headline">イベントを更新</v-card-title>
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
            <div>
              <VueDatePicker
                placeholder="日付"
                v-model="selectedDate"
                format="yyyy/MM/dd"
                model-type="yyyy-MM-dd"
                :enable-time-picker="false"
              />
            </div>
            <br />
            <div>
              <VueDatePicker
                time-picker
                disable-time-range-validation
                v-model="selectedEventStartTime"
                placeholder="開始時刻"
                type="time"
                model-type="HH:mm"
                format="HH:mm"
              />
            </div>
            <br />
            <div>
              <VueDatePicker
                time-picker
                disable-time-range-validation
                v-model="selectedEventEndTime"
                placeholder="終了時刻"
                type="time"
                model-type="HH:mm"
                format="HH:mm"
              />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="saveEvent(event)">更新</v-btn>
            <v-btn color="error" text @click="deleteEvent(selectedEventId)"
              >削除</v-btn
            >
            <v-btn color="primary" text @click="editDialog = false"
              >閉じる</v-btn
            >
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
    VueDatePicker,
  },
  computed: {
    userId() {
      return this.$store.state.userId; // VuexストアからuserIdを取得
    },
  },
  data() {
    return {
      events: [],
      createDialog: false,
      editDialog: false,
      isEdit: false, // このフラグは削除しても良いですが、元のコードを維持するため残しています
      selectedEventTitle: "",
      selectedEventContents: "",
      selectedEventStartTime: "",
      selectedEventEndTime: "",
      selectedDate: "",
      dataPicker: "",
      selectedEventId: null, // 編集時にイベントのIDを保持
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
    newCreate() {
      // 新規作成用フィールドの初期化
      this.selectedEventTitle = "";
      this.selectedEventContents = "";
      this.selectedEventStartTime = "";
      this.selectedEventEndTime = "";
      this.selectedDate = "";
      this.isEdit = false;
      this.createDialog = true;
    },
    handleDateClick(event) {
      if (event) {
        // タイトルと詳細を設定
        this.selectedEventTitle = event.title;
        this.selectedEventContents = event.contents;
        this.selectedEventId = event.activityId; // イベントのIDを保存

        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        // 年・月・日を取得
        const year = eventStart.getFullYear();
        const month = String(eventStart.getMonth() + 1).padStart(2, "0"); // 月は0始まりなので+1
        const day = String(eventStart.getDate()).padStart(2, "0");

        // yyyy-MM-dd 形式
        const startDateStr = `${year}-${month}-${day}`;

        this.selectedDate = startDateStr;

        const eventFormatTime = (date) => {
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          return `${hours}:${minutes}`;
        };

        const startTimeStr = eventFormatTime(eventStart); // 開始時間
        const endTimeStr = eventFormatTime(eventEnd); // 終了時間

        this.selectedEventStartTime = startTimeStr;
        this.selectedEventEndTime = endTimeStr;

        this.isEdit = true;
        this.editDialog = true; // 編集ダイアログを表示
      } else {
        // 新規イベントの初期化
        this.selectedEventTitle = "";
        this.selectedEventContents = "";
        this.selectedDate = "";
        this.selectedDate = "";
        this.selectedEventTitle = "";
        this.selectedEventContents = "";
        this.selectedDate = "";
        this.selectedEventTitle = "";
        this.selectedEventContents = "";
        this.selectedEventStartTime = "";
        this.selectedEventEndTime = "";
        this.isEdit = false;
        this.createDialog = true; // 新規作成ダイアログを表示
      }
    },
    saveEvent(event) {
      if (this.isEdit) {
        console.log("isEdit:", this.isEdit); // 確認ポイント
        // 更新処理
        const eventIndex = this.events.findIndex(
          (event) => event.activityId === this.selectedEventId
        );

        if (eventIndex !== -1) {
          // 必要なデータを直接構築
          const updatedEvent = {
            activityId: this.selectedEventId, // ここで正しいIDを使用
            userId: this.userId,
            date: this.selectedDate,
            start: this.selectedEventStartTime,
            end: this.selectedEventEndTime,
            title: this.selectedEventTitle,
            contents: this.selectedEventContents,
          };

          console.log("Updated Event Data:", updatedEvent); // デバッグログ

          apiFacade
            .updateActivity(updatedEvent)
            .then(() => {
              this.fetchActivities();
            })
            .catch((error) => {
              console.error("Error updating event:", error);
            });
        }
        this.editDialog = false;
      } else {
        // 登録処理
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
            this.createDialog = false; // ダイアログを閉じる
          })
          .catch((error) => {
            console.error("Error adding event:", error); // エラーハンドリング
          });
      }
    },
    async deleteEvent(selectedEventId) {
      try {
        const eventId = this.selectedEventId;
        console.log(eventId);

        // API呼び出しでイベントを削除
        await apiFacade.deleteActivity(eventId);

        // 一覧を再取得して画面を更新
        await this.fetchActivities();

        console.log("イベントを削除しました。");

        // ダイアログを閉じる
        this.editDialog = false;
      } catch (error) {
        console.error("イベントの削除中にエラーが発生しました:", error);
        alert("イベントの削除に失敗しました。");
      }
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
