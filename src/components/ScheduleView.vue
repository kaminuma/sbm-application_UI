<template>
  <v-main>
    <div class="content-container">
      <div class="button-container">
        <v-btn color="primary" @click="newCreate" class="btn-rounded">
          新規記録
        </v-btn>
        <v-btn
          color="secondary"
          @click="showAnalysisToast"
          class="btn-rounded ml-4"
        >
          生活記録分析
        </v-btn>
      </div>
      <vue-cal
        :disable-views="['years', 'year', 'month']"
        small
        :time-from="0 * 60"
        :time-to="24 * 60"
        :events="events"
        class="vuecal--custom-theme"
        :selected-date="selectedDate"
        hide-view-selector
        :transitions="false"
        @event-click="handleDateClick"
      ></vue-cal>

      <!-- /* スナックバーの実装（本実装したら削除）ここから */-->
      <v-snackbar
        v-model="snackbar"
        :timeout="3000"
        top
        right
        color="purple-accent-1"
        dark
        transition="slide-down-transition"
      >
        <v-icon left color="white">mdi-information</v-icon>
        <span class="snackbar-message">
          この機能は今後実装予定です！
          <span class="coming-soon">Coming Soon</span>
        </span>
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
            閉じる
          </v-btn>
        </template>
      </v-snackbar>
      <!-- /* スナックバーの実装（本実装したら削除）ここまで */-->

      <!-- 新規イベント作成ダイアログ -->
      <v-dialog
        v-model="createDialog"
        max-width="500"
        class="custom-dialog"
        persistent
        disable-autofocus
        ref="createDialogRef"
      >
        <v-card>
          <v-card-title class="headline">新規イベントを登録</v-card-title>
          <v-card-text>
            <v-text-field
              ref="selectedEventTitle"
              v-model="selectedEventTitle"
              :rules="[rules.required]"
              label="イベントタイトル"
              placeholder="タイトルを入力"
              outlined
              class="input-rounded"
            ></v-text-field>
            <v-textarea
              v-model="selectedEventContents"
              label="イベント詳細"
              placeholder="詳細を入力"
              rows="3"
              outlined
              class="input-rounded"
            ></v-textarea>
            <br />
            <!-- 「日時」タイトルの追加 -->
            <div class="datetime-label">
              <span>日時</span>
            </div>
            <div class="date-time-picker">
              <VueDatePicker
                placeholder="日付を選択"
                v-model="selectedDate"
                format="yyyy/MM/dd"
                model-type="yyyy-MM-dd"
                :rules="[rules.required]"
                :enable-time-picker="false"
                :input-props="{ outlined: true, class: 'input-rounded' }"
                teleport-center
              />
              <VueDatePicker
                time-picker
                disable-time-range-validation
                v-model="selectedEventStartTime"
                placeholder="開始時刻を選択"
                type="time"
                format="HH:mm"
                :rules="[rules.required]"
                :input-props="{ outlined: true, class: 'input-rounded' }"
                teleport-center
              />
              <VueDatePicker
                time-picker
                disable-time-range-validation
                v-model="selectedEventEndTime"
                placeholder="終了時刻を選択"
                type="time"
                format="HH:mm"
                :rules="[rules.required]"
                :input-props="{ outlined: true, class: 'input-rounded' }"
                teleport-center
              />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="saveEvent"
              :disabled="!isFormValid()"
              class="btn-rounded"
            >
              保存
            </v-btn>
            <v-btn
              color="grey"
              text
              @click="createDialog = false"
              class="btn-rounded"
            >
              閉じる
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- イベント編集ダイアログ -->
      <v-dialog
        v-model="editDialog"
        max-width="500"
        class="custom-dialog"
        persistent
        disable-autofocus
        ref="editDialogRef"
      >
        <v-card>
          <v-card-title class="headline">イベントを更新</v-card-title>
          <v-card-text>
            <v-text-field
              ref="selectedEventTitle"
              v-model="selectedEventTitle"
              label="イベントタイトル"
              :rules="[rules.required]"
              placeholder="タイトルを入力"
              outlined
              class="input-rounded"
            ></v-text-field>
            <v-textarea
              v-model="selectedEventContents"
              label="イベント詳細"
              placeholder="詳細を入力"
              rows="3"
              outlined
              class="input-rounded"
            ></v-textarea>
            <br />
            <!-- 「日時」タイトルの追加 -->
            <div class="datetime-label">
              <span>日時</span>
            </div>
            <div class="date-time-picker">
              <VueDatePicker
                placeholder="日付を選択"
                v-model="selectedDate"
                format="yyyy/MM/dd"
                model-type="yyyy-MM-dd"
                :rules="[rules.required]"
                :enable-time-picker="false"
                :input-props="{ outlined: true, class: 'input-rounded' }"
                teleport-center
              />
              <VueDatePicker
                time-picker
                disable-time-range-validation
                v-model="selectedEventStartTime"
                placeholder="開始時刻を選択"
                type="time"
                model-type="HH:mm"
                format="HH:mm"
                :rules="[rules.required]"
                :input-props="{ outlined: true, class: 'input-rounded' }"
                teleport-center
              />
              <VueDatePicker
                time-picker
                disable-time-range-validation
                v-model="selectedEventEndTime"
                placeholder="終了時刻を選択"
                type="time"
                model-type="HH:mm"
                format="HH:mm"
                :rules="[rules.required]"
                :input-props="{ outlined: true, class: 'input-rounded' }"
                teleport-center
              />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="saveEvent(event)"
              :disabled="!isFormValid()"
              class="btn-rounded"
            >
              更新
            </v-btn>
            <v-btn
              color="error"
              text
              @click="openDeleteConfirm(event)"
              class="btn-rounded"
            >
              削除
            </v-btn>
            <v-btn
              color="grey"
              text
              @click="editDialog = false"
              class="btn-rounded"
            >
              閉じる
            </v-btn>
          </v-card-actions>
        </v-card>
        <!-- 削除確認ダイアログ -->
        <v-dialog v-model="showDeleteConfirm" max-width="400">
          <v-card>
            <v-card-title class="headline"
              >本当に削除してよろしいですか？</v-card-title
            >
            <v-card-text>
              「{{
                this.selectedEventTitle
              }}」の記録を本当に削除してよろしいですか？
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" text @click="cancelDelete">キャンセル</v-btn>
              <v-btn color="red" text @click="deleteEvent(selectedEventId)"
                >削除</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-dialog>
    </div>
  </v-main>
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
      return this.$store.state.userId;
    },
  },
  data() {
    return {
      events: [],
      createDialog: false,
      editDialog: false,
      isEdit: false,
      selectedEventTitle: "",
      selectedEventContents: "",
      selectedEventStartTime: "",
      selectedEventEndTime: "",
      selectedAddEventStartTime: "",
      selectedAddEventEndTime: "",
      selectedDate: "",
      dataPicker: "",
      selectedEventId: null,
      snackbar: false,
      showDeleteConfirm: false, // 確認ダイアログの表示状態
      eventToDelete: null, // 削除対象のイベント情報
      rules: {
        required: (value) => !!value || "必須項目です。",
      },
    };
  },
  created() {
    this.fetchActivities();
  },
  methods: {
    isFormValid() {
      if (
        (this.selectedEventTitle?.length || 0) > 0 &&
        !!this.selectedDate &&
        !!this.selectedEventStartTime &&
        !!this.selectedEventEndTime
      ) {
        let startTime = this.selectedEventStartTime;
        let endTime = this.selectedEventEndTime;

        // オブジェクト比較になるので以下のように変換
        // もし { hours: number, minutes: number } の形式で来る場合
        if (typeof startTime === "object" && startTime.hours !== undefined) {
          startTime = `${String(startTime.hours).padStart(2, "0")}:${String(
            startTime.minutes
          ).padStart(2, "0")}`;
        }
        if (typeof endTime === "object" && endTime.hours !== undefined) {
          endTime = `${String(endTime.hours).padStart(2, "0")}:${String(
            endTime.minutes
          ).padStart(2, "0")}`;
        }

        // "HH:mm"形式の文字列同士なら文字列比較で問題ない
        if (endTime <= startTime) {
          return false;
        }
        return true;
      }
      return false;
    },
    async fetchActivities() {
      try {
        const activities = await apiFacade.getActivities(this.userId);
        this.events = activities;
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    },
    newCreate() {
      this.selectedEventTitle = "";
      this.selectedEventContents = "";
      this.selectedEventStartTime = "";
      this.selectedEventEndTime = "";
      this.selectedDate = new Date().toISOString().split("T")[0];
      this.isEdit = false;
      this.createDialog = true;
    },
    handleDateClick(event) {
      if (event) {
        this.selectedEventTitle = event.title;
        this.selectedEventContents = event.contents;
        this.selectedEventId = event.activityId;

        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        const year = eventStart.getFullYear();
        const month = String(eventStart.getMonth() + 1).padStart(2, "0");
        const day = String(eventStart.getDate()).padStart(2, "0");

        const startDateStr = `${year}-${month}-${day}`;

        this.selectedDate = startDateStr;

        const eventFormatTime = (date) => {
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          return `${hours}:${minutes}`;
        };

        this.selectedEventStartTime = eventFormatTime(eventStart);
        this.selectedEventEndTime = eventFormatTime(eventEnd);

        this.isEdit = true;
        this.editDialog = true;
      } else {
        this.selectedEventTitle = "";
        this.selectedEventContents = "";
        this.selectedDate = "";
        this.selectedEventStartTime = "";
        this.selectedEventEndTime = "";
        this.isEdit = false;
        this.createDialog = true;
      }
    },
    saveEvent(event) {
      if (this.isEdit) {
        const eventIndex = this.events.findIndex(
          (event) => event.activityId === this.selectedEventId
        );

        if (eventIndex !== -1) {
          const updatedEvent = {
            activityId: this.selectedEventId,
            userId: this.userId,
            date: this.selectedDate,
            start: this.selectedEventStartTime,
            end: this.selectedEventEndTime,
            title: this.selectedEventTitle,
            contents: this.selectedEventContents,
          };

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
        this.formatTime(this.selectedEventStartTime, "start");
        this.formatTime(this.selectedEventEndTime, "end");
        const eventData = {
          userId: this.userId,
          date: this.selectedDate,
          start: this.selectedAddEventStartTime,
          end: this.selectedAddEventEndTime,
          title: this.selectedEventTitle,
          contents: this.selectedEventContents,
        };
        apiFacade
          .createActivity(eventData)
          .then(() => {
            return this.fetchActivities();
          })
          .then(() => {
            this.createDialog = false;
          })
          .catch((error) => {
            console.error("Error adding event:", error);
          });
      }
    },
    async deleteEvent(selectedEventId) {
      const eventId = this.selectedEventId;

      await apiFacade
        .deleteActivity(eventId)
        .then(() => {
          return this.fetchActivities();
        })
        .then(() => {
          this.showDeleteConfirm = false;
          this.editDialog = false;
        })
        .catch((error) => {
          console.error("イベントの削除中にエラーが発生しました", error);
          alert("イベントの削除に失敗しました。");
        });
    },
    formatTime(timeObj, type) {
      if (timeObj && timeObj.hours !== undefined) {
        const hours = String(timeObj.hours).padStart(2, "0");
        const minutes = String(timeObj.minutes).padStart(2, "0");
        const formattedTime = `${hours}:${minutes}`;

        if (type === "start") {
          this.selectedAddEventStartTime = formattedTime;
        } else if (type === "end") {
          this.selectedAddEventEndTime = formattedTime;
        }
      }
    },
    /**
     * 削除確認ダイアログを開く
     */
    openDeleteConfirm(event) {
      this.showDeleteConfirm = true; // ダイアログを表示
    },

    /**
     * 削除をキャンセルする
     */
    cancelDelete() {
      this.showDeleteConfirm = false; // ダイアログを非表示
      this.eventToDelete = null; // 削除対象のイベントをリセット
    },
    /* スナックバーの実装（本実装したら削除）ここから */
    showAnalysisToast() {
      this.snackbar = true;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");

body {
  background-color: #f0f4f8;
  font-family: "Poppins", sans-serif;
}

.v-application {
  background-color: #f0f4f8;
}

.content-container {
  padding: 20px;
}

.button-container {
  margin-bottom: 20px;
  text-align: center;
}

.btn-rounded {
  border-radius: 24px;
  font-weight: 600;
}

.input-rounded .v-input__control {
  border-radius: 8px;
}

.custom-dialog .v-card {
  height: auto;
  max-height: auto;
  border-radius: 16px;
  overflow-y: auto;
}

.datetime-label {
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.date-time-picker {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.vuecal--custom-theme {
  --vuecal-color-primary: #00bfa5;
  --vuecal-color-secondary: #a7ffeb;
  --vuecal-background: #f0f4f8;
  --vuecal-border-radius: 8px;
  --vuecal-event-border-radius: 8px;
  --vuecal-font-family: "Poppins", sans-serif;
}

.vuecal--custom-theme .vuecal__header {
  background-color: #a7ffeb;
  color: #00695c;
}

.vuecal--custom-theme .vuecal__event {
  border-radius: 8px;
}

.vuecal--custom-theme .vuecal__event-title {
  color: #00695c;
}

.vuecal--custom-theme .vuecal__time {
  color: #00695c;
}

/* PC向けのスタイルを追加 */
@media (min-width: 1024px) {
  /* ブレークポイントは必要に応じて調整 */
  .custom-dialog .v-card {
    max-height: auto; /* PC用にmax-heightを増やす */
  }

  /* オプション: PC向けにパディングを増やす */
  .content-container {
    padding: 40px;
  }

  /* ポップアップのz-indexを調整 */
  .vue-datepicker-popper {
    position: absolute !important; /* ダイアログ内に表示 */
    z-index: 10000;
    max-height: auto; /* 高さをautoに*/
    overflow: auto !important;
    width: 90vw !important;
  }
}

/* スマートフォン向けのポップアップ調整 */
@media (max-width: 600px) {
  .vue-datepicker-popper {
    width: 100% !important; /* 幅を100%に設定 */
    max-height: auto !important; /* 高さをautoに */
    overflow: auto !important; /* スクロール可能に */
    box-sizing: border-box; /* パディングやボーダーを含めたサイズ計算 */
    left: 0 !important; /* 左寄せ */
    right: 0 !important; /* 右寄せ */
    top: auto !important; /* 上寄せを無効化 */
    bottom: 0 !important; /* 下寄せ */
    position: absolute !important; /* 絶対位置に設定 */
  }

  /* ダイアログ内のポップアップを下部に固定し、高さを広く設定 */
  .custom-dialog .v-card {
    display: flex;
    flex-direction: column;
    height: 80vh; /* スマホ用に高さを増やす */
    max-height: 80vh; /* スマホ用に最大高さを増やす */
  }
}

/* 既存のスタイルはそのまま維持 */
/* スナックバーの実装（本実装したら削除）ここから */

.snackbar-message {
  margin-left: 12px; /* アイコンとの間隔を広げる */
  font-weight: 550;
  font-size: 16px;
  display: flex;
  align-items: center;
}

/* 「Coming Soon」メッセージのスタイルとアニメーション */
.coming-soon {
  margin-left: 8px;
  color: #2608be; /* ポップな色に変更 */
  opacity: 0;
  animation: slide-in 1s forwards;
}

@keyframes slide-in {
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* カスタムトランジションの定義 */
@keyframes slide-down {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-down-transition-enter-active {
  animation: slide-down 0.5s forwards;
}

.slide-down-transition-leave-active {
  animation: slide-down 0.5s reverse forwards;
}
/* スナックバーの実装（本実装したら削除）ここまで */
</style>
