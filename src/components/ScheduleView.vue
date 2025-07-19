<template>
  <v-main>
    <div class="content-container">
      <div class="button-container">
        <div class="button-group">
          <h4 class="button-group-title">📝 記録</h4>
          <div class="button-group-content">
            <v-btn color="primary" @click="newCreate" class="btn-rounded">
              新規記録
            </v-btn>
            <v-btn
              color="success"
              @click="openMoodDialogForToday"
              class="btn-rounded ml-4"
            >
              気分を記録
            </v-btn>
          </div>
        </div>
        
        <div class="button-group">
          <h4 class="button-group-title">📊 分析</h4>
          <div class="button-group-content">
            <v-btn
              color="secondary"
              @click="showAnalysisToast"
              class="btn-rounded"
            >
              生活記録分析
            </v-btn>
          </div>
        </div>
      </div>

      <!-- 気分記録履歴セクション：最近の気分記録を表示 -->
      <div class="mood-history-section">
        <h3>最近の気分記録</h3>
        <!-- 気分記録がない場合の空状態表示 -->
        <div v-if="moodRecords.length === 0" class="empty-mood-state">
          <v-icon size="48" color="grey">mdi-emoticon-neutral</v-icon>
          <p>まだ気分記録がありません</p>
          <v-btn color="primary" @click="newCreate" class="btn-rounded">
            気分を記録
          </v-btn>
        </div>
        <!-- 気分記録がある場合の履歴リスト表示 -->
        <div v-else class="mood-history-list">
          <div
            v-for="mood in recentMoodRecords"
            :key="mood.date"
            class="mood-history-item"
          >
            <div class="mood-date">{{ formatDisplayDate(mood.date) }}</div>
            <div class="mood-display">
              <span class="mood-emoji-display">{{ getMoodEmoji(mood.mood) }}</span>
              <span class="mood-label-display">{{ getMoodLabel(mood.mood) }}</span>
            </div>
            <div v-if="mood.note" class="mood-note">{{ mood.note }}</div>
          </div>
        </div>
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
        @cell-click="handleCellClick"
      >
        <!-- カスタムセルテンプレート：カレンダーの各日付セルをカスタマイズ -->
        <template #cell="{ cell }">
          <div class="vuecal__cell-content">
            <!-- 日付番号の表示 -->
            <div class="vuecal__cell-date">{{ cell.date.getDate() }}</div>
            
            <!-- 気分記録がある場合のアイコン表示 -->
            <div v-if="getMoodForDate(formatDateForMood(cell.date))" class="mood-indicator">
              <span class="mood-emoji-small">
                {{ getMoodEmoji(getMoodForDate(formatDateForMood(cell.date)).mood) }}
              </span>
            </div>
          </div>
        </template>
      </vue-cal>

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
            <v-select
              v-model="selectedCategory"
              :items="categoryList"
              label="カテゴリ"
              :rules="[rules.required]"
              outlined
              class="input-rounded"
              required
            ></v-select>
            <v-text-field
              v-if="selectedCategory === 'その他'"
              v-model="selectedCategorySub"
              label="サブカテゴリ（必須）"
              :rules="[rules.required]"
              outlined
              class="input-rounded"
              required
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
            <v-select
              v-model="selectedCategory"
              :items="categoryList"
              label="カテゴリ"
              :rules="[rules.required]"
              outlined
              class="input-rounded"
              required
            ></v-select>
            <v-text-field
              v-if="selectedCategory === 'その他'"
              v-model="selectedCategorySub"
              label="サブカテゴリ（必須）"
              :rules="[rules.required]"
              outlined
              class="input-rounded"
              required
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

      <!-- 気分記録ダイアログ -->
      <v-dialog v-model="showMoodDialog" max-width="500" persistent>
        <v-card>
          <v-card-title class="headline">{{ selectedMoodDate }}の気分を記録</v-card-title>
          <v-card-text>
            <v-form ref="moodForm" v-model="moodFormValid">
              <!-- 日付表示 -->
              <div class="selected-date-display">
                <v-icon left>mdi-calendar</v-icon>
                <span>{{ formatDisplayDate(selectedMoodDate) }}</span>
              </div>

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
                placeholder="その日の気分についてメモを残しましょう"
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
    </div>
  </v-main>
</template>

<script>
import { VueCal } from "vue-cal";
import apiFacade from "../services/apiFacade";
import "vue-cal/style.css";
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
    isMoodFormValid() {
      return this.selectedMood !== null;
    },
    recentMoodRecords() {
      // 最新5件の気分記録を返す
      return this.moodRecords
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
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
      showDeleteConfirm: false, // 確認ダイアログの表示状態
      eventToDelete: null, // 削除対象のイベント情報
      rules: {
        required: (value) => !!value || "必須項目です。",
      },
      // 気分記録関連の状態管理
      showMoodDialog: false, // 気分記録ダイアログの表示状態
      moodFormValid: false, // 気分記録フォームのバリデーション状態
      selectedMood: null, // 選択された気分値（1-5）
      moodNote: "", // 気分記録のメモ
      selectedMoodDate: "", // 選択された日付
      moodRecords: [], // 全気分記録の配列
      moodOptions: [
        { value: 1, emoji: "😢", label: "とても悪い" },
        { value: 2, emoji: "😕", label: "悪い" },
        { value: 3, emoji: "😐", label: "普通" },
        { value: 4, emoji: "🙂", label: "良い" },
        { value: 5, emoji: "😄", label: "とても良い" },
      ],
      selectedCategory: '',
      selectedCategorySub: '',
      categoryList: [
        '運動',
        '仕事',
        '学習',
        '趣味',
        '食事',
        '睡眠',
        '買い物',
        '娯楽',
        '休憩',
        '家事',
        '通院',
        '散歩',
        'その他',
      ],
    };
  },
  created() {
    this.fetchActivities();
    this.fetchMoodRecords();
  },
  methods: {
    isFormValid() {
      if (
        (this.selectedEventTitle?.length || 0) > 0 &&
        !!this.selectedDate &&
        !!this.selectedEventStartTime &&
        !!this.selectedEventEndTime &&
        !!this.selectedCategory &&
        (this.selectedCategory !== 'その他' || (this.selectedCategory === 'その他' && !!this.selectedCategorySub))
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
    /**
     * 気分記録をAPIから取得する
     * 取得したデータはmoodRecordsに保存される
     */
    async fetchMoodRecords() {
      try {
        const response = await apiFacade.getMoodRecords(this.userId);
        this.moodRecords = response.moodRecords || [];
      } catch (error) {
        console.error("Error fetching mood records:", error);
        this.moodRecords = [];
      }
    },
    newCreate() {
      this.selectedEventTitle = "";
      this.selectedEventContents = "";
      this.selectedEventStartTime = "";
      this.selectedEventEndTime = "";
      this.selectedDate = new Date().toISOString().split("T")[0];
      this.selectedCategory = "";
      this.selectedCategorySub = "";
      this.isEdit = false;
      this.createDialog = true;
    },
    handleDateClick(event) {
      if (event) {
        this.selectedEventTitle = event.title;
        this.selectedEventContents = event.contents;
        this.selectedEventId = event.activityId;
        this.selectedCategory = event.category;
        this.selectedCategorySub = event.categorySub || event.category_sub || '';
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
      }
    },

    handleCellClick(cell) {
      // 日付セルをクリックした時の処理
      const clickedDate = cell.date;
      const year = clickedDate.getFullYear();
      const month = String(clickedDate.getMonth() + 1).padStart(2, "0");
      const day = String(clickedDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      
      this.selectedMoodDate = dateStr;
      this.openMoodDialog(dateStr);
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
            category: this.selectedCategory,
            categorySub: this.selectedCategory === 'その他' ? this.selectedCategorySub : '',
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
        // 編集時はカテゴリ・サブカテゴリをリセットしない
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
          category: this.selectedCategory,
          categorySub: this.selectedCategory === 'その他' ? this.selectedCategorySub : '',
        };
        apiFacade
          .createActivity(eventData)
          .then(() => {
            return this.fetchActivities();
          })
          .then(() => {
            this.createDialog = false;
            // 新規作成時のみカテゴリ・サブカテゴリをリセット
            this.selectedCategory = '';
            this.selectedCategorySub = '';
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
    showAnalysisToast() {
      this.$router.push('/analyze');
    },

    // 気分記録関連のメソッド
    /**
     * 気分記録ダイアログを開く
     * 指定された日付の既存記録があれば編集モード、なければ新規作成モード
     * @param {string} dateStr - YYYY-MM-DD形式の日付文字列
     */
    async openMoodDialog(dateStr) {
      this.selectedMoodDate = dateStr;
      
      try {
        // 既存の気分記録を取得して、指定日付の記録を検索
        const userId = this.$store.state.userId;
        const response = await apiFacade.getMoodRecords(userId);
        const moodRecords = response.moodRecords || [];
        const existingMood = moodRecords.find(mood => mood.date === dateStr);
        
        if (existingMood) {
          // 既存の記録がある場合は編集モードでフォームを初期化
          this.selectedMood = existingMood.mood;
          this.moodNote = existingMood.note || "";
        } else {
          // 新規記録モードでフォームをリセット
          this.selectedMood = null;
          this.moodNote = "";
        }
        
        this.showMoodDialog = true;
      } catch (error) {
        console.error("気分記録の読み込みに失敗:", error);
        alert("気分記録の読み込みに失敗しました。");
      }
    },
    /**
     * 今日の日付で気分記録ダイアログを開く
     * ボタンクリック時に呼び出される
     */
    openMoodDialogForToday() {
      // 今日の日付をYYYY-MM-DD形式で取得
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const todayStr = `${year}-${month}-${day}`;
      
      // 今日の日付で気分記録ダイアログを開く
      this.openMoodDialog(todayStr);
    },

    /**
     * 気分値に対応する絵文字を取得する
     * @param {number} mood - 気分値（1-5）
     * @returns {string} 対応する絵文字
     */
    getMoodEmoji(mood) {
      const moodOption = this.moodOptions.find(option => option.value === mood);
      return moodOption ? moodOption.emoji : "😐";
    },

    /**
     * 気分値に対応するラベルを取得する
     * @param {number} mood - 気分値（1-5）
     * @returns {string} 対応するラベル
     */
    getMoodLabel(mood) {
      const moodOption = this.moodOptions.find(option => option.value === mood);
      return moodOption ? moodOption.label : "不明";
    },

    /**
     * 指定された日付の気分記録を取得する
     * @param {string} dateStr - YYYY-MM-DD形式の日付文字列
     * @returns {Object|null} 気分記録オブジェクト、見つからない場合はnull
     */
    getMoodForDate(dateStr) {
      return this.moodRecords.find(mood => mood.date === dateStr);
    },

    /**
     * DateオブジェクトをYYYY-MM-DD形式の文字列に変換する
     * @param {Date} date - 変換するDateオブジェクト
     * @returns {string} YYYY-MM-DD形式の日付文字列
     */
    formatDateForMood(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    /**
     * 日付文字列を日本語形式で表示用にフォーマットする
     * @param {string} dateStr - YYYY-MM-DD形式の日付文字列
     * @returns {string} 日本語形式の日付文字列
     */
    formatDisplayDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long"
      });
    },

    /**
     * 気分記録ダイアログを閉じる
     * フォームをリセットしてダイアログを非表示にする
     */
    closeMoodDialog() {
      this.showMoodDialog = false;
      this.resetMoodForm();
    },

    /**
     * 気分記録フォームをリセットする
     * 選択された気分とメモをクリアする
     */
    resetMoodForm() {
      this.selectedMood = null;
      this.moodNote = "";
    },

    /**
     * 気分記録を保存する
     * 既存の記録がある場合は更新、ない場合は新規作成
     */
    async saveMood() {
      if (!this.selectedMood) return;

      const moodData = {
        date: this.selectedMoodDate,
        mood: this.selectedMood,
        note: this.moodNote,
        userId: this.$store.state.userId,
      };

      try {
        // 既存の記録があるかチェックして、更新か新規作成かを決定
        const userId = this.$store.state.userId;
        const response = await apiFacade.getMoodRecords(userId);
        const moodRecords = response.moodRecords || [];
        const existingMood = moodRecords.find(mood => mood.date === this.selectedMoodDate);

        if (existingMood) {
          // 既存の記録がある場合は更新
          await apiFacade.updateMoodRecord(moodData);
        } else {
          // 既存の記録がない場合は新規作成
          await apiFacade.createMoodRecord(moodData);
        }

        this.closeMoodDialog();
        await this.fetchMoodRecords(); // 気分記録を再取得して表示を更新
        alert("気分記録を保存しました！");
      } catch (error) {
        console.error("気分記録の保存に失敗:", error);
        alert("気分記録の保存に失敗しました。");
      }
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
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.button-group-title {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.button-group-content {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
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

/* 気分記録ダイアログのスタイル */
.selected-date-display {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
}

/* 気分記録ダイアログのスタイル */
.mood-rating-section {
  margin-bottom: 20px;
}

.mood-label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #333;
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

/* カレンダーセル内の気分記録アイコン */
.vuecal__cell-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 5px;
}

.vuecal__cell-date {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.mood-indicator {
  position: absolute;
  top: 2px;
  right: 2px;
  z-index: 10;
}

.mood-emoji-small {
  font-size: 0.8rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 2px;
  display: block;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* レスポンシブデザイン */
@media (max-width: 768px) {
  .mood-emoji-container {
    flex-wrap: wrap;
  }
  
  .mood-emoji-item {
    flex: 1 1 calc(50% - 5px);
  }
  
  .mood-emoji-small {
    font-size: 0.7rem;
  }
}

/* 気分記録履歴セクション */
.mood-history-section {
  margin-top: 30px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mood-history-section h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.empty-mood-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-mood-state p {
  margin: 15px 0;
  color: #666;
  font-size: 1.1rem;
}

.mood-history-list {
  max-height: 300px;
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
  min-width: 120px;
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.mood-display {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.mood-emoji-display {
  font-size: 1.2rem;
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

/* レスポンシブ対応 */
@media (max-width: 768px) {
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
}
</style>
