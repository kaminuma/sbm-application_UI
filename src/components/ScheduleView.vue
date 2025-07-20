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
        :views="['day', 'week', 'month']"
        small
        :time-from="0 * 60"
        :time-to="24 * 60"
        :events="events"
        class="vuecal--custom-theme"
        :selected-date="selectedDate"
        hide-view-selector
        :transitions="false"
        @header-date-click="handleCellClick"
        @event-click="handleDateClick"
        @view-change="setupHeaderDateClicks"
        @click-on-date="onDateChanged"
        @ready="handleReady"
        @next="setupHeaderDateClicks"
        @previous="setupHeaderDateClicks"
        @today="setupHeaderDateClicks"
      >
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
              @click="saveEvent()"
              :disabled="!isFormValid()"
              class="btn-rounded"
            >
              更新
            </v-btn>
            <v-btn
              color="error"
              text
              @click="openDeleteConfirm()"
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
          <v-card-title class="headline">{{ formatDisplayDate(selectedMoodDate) }}の気分を記録</v-card-title>
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
import { scrollTo } from "vuetify/lib/composables/goto.mjs";

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
  mounted() {
    // Vue-Cal v5のヘッダー日付にクリックイベントを直接追加
    this.$nextTick(() => {
      this.setupHeaderDateClicks();
    });
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
        
        // Handle case where activities is undefined or not an array
        if (!activities || !Array.isArray(activities)) {
          console.warn("Activities is not an array or is undefined:", activities);
          this.events = [];
          return;
        }
        
        // Transform activities to vue-cal v5 event format
        const transformedEvents = activities.map(activity => {
          // Handle date conversion more robustly
          let startDate = activity.start;
          let endDate = activity.end;
          
          // 日付の文字列を整形
          // 日付形式が "YYYY-MM-DD HH:MM:SS" または "YYYY-MM-DD" のどちらかで扱う
          if (typeof startDate === 'string') {
            if (startDate.includes('T') || startDate.includes(' ')) {
              // ISO形式またはスペース区切りの日時文字列
              startDate = new Date(startDate);
            } else {
              // 日付のみの場合は時刻部分を追加
              const [dateStr, timeStr] = startDate.split(' ');
              if (!timeStr) {
                startDate = new Date(`${dateStr}T00:00:00`);
              } else {
                startDate = new Date(startDate);
              }
            }
          }
          
          if (typeof endDate === 'string') {
            if (endDate.includes('T') || endDate.includes(' ')) {
              // ISO形式またはスペース区切りの日時文字列
              endDate = new Date(endDate);
            } else {
              // 日付のみの場合は時刻部分を追加
              const [dateStr, timeStr] = endDate.split(' ');
              if (!timeStr) {
                endDate = new Date(`${dateStr}T00:00:00`);
              } else {
                endDate = new Date(endDate);
              }
            }
          }
          
          // Dateオブジェクトでなければ変換
          if (!(startDate instanceof Date)) startDate = new Date(startDate);
          if (!(endDate instanceof Date)) endDate = new Date(endDate);
          
          // 正しくDateオブジェクトに変換できたか確認
          if (isNaN(startDate.getTime())) {
            console.error(`Invalid start date for activity: ${activity.activityId}, date: ${activity.start}`);
            startDate = new Date(); // エラー時はデフォルト値を使用
          }
          if (isNaN(endDate.getTime())) {
            console.error(`Invalid end date for activity: ${activity.activityId}, date: ${activity.end}`);
            endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // エラー時はスタート+1時間
          }
          
          // 無効なデータのチェック: 終了時刻が開始時刻より前の場合
          if (endDate < startDate) {
            console.warn('無効なイベントデータを検出:', {
              activityId: activity.activityId,
              title: activity.title,
              start: activity.start,
              end: activity.end,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              reason: '終了時刻が開始時刻より前になっています'
            });
            // 無効なデータはnullを返す
            return null;
          }
          
          // カテゴリに基づく背景色の定義
          const categoryColors = {
            '運動': { bg: '#e0f7fa', text: '#01579b' },
            '仕事': { bg: '#e3f2fd', text: '#0d47a1' },
            '学習': { bg: '#f3e5f5', text: '#4a148c' },
            '趣味': { bg: '#fff3e0', text: '#e65100' },
            '食事': { bg: '#ffebee', text: '#b71c1c' },
            '睡眠': { bg: '#e8eaf6', text: '#1a237e' },
            '買い物': { bg: '#e0f2f1', text: '#004d40' },
            '娯楽': { bg: '#fce4ec', text: '#880e4f' },
            '休憩': { bg: '#f1f8e9', text: '#33691e' },
            '家事': { bg: '#efebe9', text: '#3e2723' },
            '通院': { bg: '#eceff1', text: '#263238' },
            '散歩': { bg: '#f9fbe7', text: '#827717' },
            'その他': { bg: '#f5f5f5', text: '#212121' }
          };
          
          // カテゴリに対応する色を取得
          const colorSet = categoryColors[activity.category] || { bg: '#f5f5f5', text: '#212121' };
          
          // Vue-Cal v5用のイベントオブジェクト
          const event = {
            // vue-cal v5 expects these specific properties
            start: startDate,
            end: endDate,
            title: activity.title,
            content: activity.contents, // Note: vue-cal uses 'content', API returns 'contents'
            
            // Keep original properties for our custom functionality
            activityId: activity.activityId,
            category: activity.category,
            categorySub: activity.categorySub || activity.category_sub || '',
            contents: activity.contents, // Keep for backward compatibility
            
            // 直接スタイルを適用 (Vue-Cal v5のdynamic colors機能)
            backgroundColor: colorSet.bg,
            color: colorSet.text,
            
            // カテゴリごとのサイドバー表示用にクラスを設定
            class: `category-${activity.category}`
          };
          return event;
        });
        
        // 無効なデータ（null）をフィルタリング
        const validEvents = transformedEvents.filter(event => event !== null);
        console.log(`全${activities.length}件中、有効なイベント: ${validEvents.length}件、無効なイベント: ${activities.length - validEvents.length}件`);
        
        this.events = validEvents;
      } catch (error) {
        console.error("Error fetching activities:", error);
        this.events = []; // Set empty array on error
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
    handleDateClick(eventData) {
      // Vue-Cal v5に対応：nullチェックを追加
      if (!eventData) {
        console.log('Event data is null or undefined');
        return;
      }

      // Vue-Cal v5では、eventDataはオブジェクトで、event（カレンダーイベントデータ）を含む
      // { e: DOMEvent, event: CalendarEvent, ... } の形式になっている
      try {
        const event = eventData.event || eventData; // Vue-Cal v5なら.eventから、それ以外はそのまま
        
        if (event) {
          console.log('Event clicked:', event); // デバッグ用
          this.selectedEventTitle = event.title;
          this.selectedEventContents = event.contents || event.content; // Vue-Cal v5ではcontentとして提供される場合がある
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
      } catch (error) {
        console.error('Error handling date click:', error);
        // エラーが発生しても処理を続行
      }
    },

    handleCellClick(cellData) {
      // ヘッダークリック時はDate型、セルクリック時はcellオブジェクト
      console.log('🎯 handleCellClick呼び出し:', cellData);
      let dateObj;

      if (cellData instanceof Date) {
        // ヘッダークリック
        dateObj = cellData;
        console.log('📅 ヘッダー日付がクリックされました:', {
          date: dateObj.toISOString().split('T')[0],
          year: dateObj.getFullYear(),
          month: dateObj.getMonth() + 1,
          day: dateObj.getDate(),
          weekday: ['日', '月', '火', '水', '木', '金', '土'][dateObj.getDay()]
        });
      } else if (cellData && cellData.cell && cellData.cell.date) {
        // セルクリック
        dateObj = cellData.cell.date;
        console.log('Cell clicked:', cellData.cell);
      } else {
        // 不正なデータ
        console.error('Invalid cell data:', cellData);
        return;
      }

      // 日付が有効かどうか確認
      if (isNaN(dateObj.getTime())) {
        console.error('Invalid date object:', dateObj);
        return;
      }

      // 現在のカレンダー表示状態に合わせて日付を補正
      // (既に修正済みなので、このまま使用)
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      console.log(`Converting date: ${dateObj} to string: ${dateStr}`);
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
      if (!date || !date.getFullYear) return '';
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
    
    /**
     * イベントの開始時間や終了時間を時刻表示用にフォーマットする
     * @param {Date} date - フォーマットする時間
     * @returns {string} - HH:MM形式の時間文字列
     */
    formatEventTime(date) {
      if (!date) return '';
      
      const dateObj = new Date(date);
      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      
      return `${hours}:${minutes}`;
    },
    
    /**
     * Vue-Cal v5のヘッダー日付要素にクリックイベントを追加する
     * カレンダーレンダリング後や表示変更時に呼び出される
     */
    // Vue-Cal v5 @readyイベントのハンドラ
    handleReady({ view }) {
      // 現在の時刻にスクロール
      if (view && typeof view.scrollToCurrentTime === 'function') {
        view.scrollToCurrentTime();
      } else {
        console.warn('scrollToCurrentTime is not available');
      }
      
      // ヘッダー日付クリックの設定も行う
      this.setupHeaderDateClicks();
    },
    
    setupHeaderDateClicks() {
      // DOM更新を待つために少し遅延させる
      setTimeout(() => {
        try {
          console.log('Setting up header date clicks');
          
          // ヘッダー要素を取得（複数のセレクタを試す）
          let weekdayElements = document.querySelectorAll('.vuecal--custom-theme .vuecal__weekday');
          
          // もし見つからない場合は別のセレクタを試す
          if (weekdayElements.length === 0) {
            weekdayElements = document.querySelectorAll('.vuecal--week-view .vuecal__heading');
          }
          
          // それでも見つからない場合は他のセレクタを試す
          if (weekdayElements.length === 0) {
            weekdayElements = document.querySelectorAll('.vuecal__flex .vuecal__heading');
          }
          
          if (weekdayElements.length === 0) {
            console.warn('Vue-Cal weekday headers not found');
            return;
          }
          
          console.log('Vue-Cal weekday headers found:', weekdayElements.length);
          
          // 各ヘッダー日付要素にクリックイベントを追加
          weekdayElements.forEach((element, index) => {
            // イベントリスナーをクリアするために要素をクローン
            const newElement = element.cloneNode(true);
            if (element.parentNode) {
              element.parentNode.replaceChild(newElement, element);
            }
            
            // クリックイベントリスナーを追加
            newElement.addEventListener('click', (e) => {
              try {
                console.log(`🖱️ ヘッダー要素 ${index} がクリックされました`);
                
                // カレンダー要素から直接日付を取得
                const vuecalInstance = document.querySelector('.vuecal')?.__vue__;
                let clickDate;
                
                if (vuecalInstance && vuecalInstance.view && vuecalInstance.view.startDate) {
                  // Vue-Calインスタンスから週の開始日を取得
                  const weekStart = new Date(vuecalInstance.view.startDate);
                
                  // インデックスに基づいて日付を計算
                  clickDate = new Date(weekStart);
                  clickDate.setDate(weekStart.getDate() + index);
                  console.log(`Using Vue-Cal instance: weekStart=${weekStart}, index=${index}, clickDate=${clickDate}`);
                } else {
                  // 要素から日付テキストを取得（フォールバック）
                  const dateText = newElement.querySelector('.vuecal__weekday-date')?.innerText || '';
                  
                  if (dateText && !isNaN(parseInt(dateText))) {
                    const dayOfMonth = parseInt(dateText);
                    
                    // 現在のカレンダー情報を取得
                    const calendarInfo = this.getCurrentCalendarInfo();
                    
                    // 現在のカレンダー情報を詳細に出力
                    console.log('🔍 取得したカレンダー情報:', {
                      year: calendarInfo.year,
                      month: calendarInfo.month + 1,
                      startDate: calendarInfo.startDate?.toISOString(),
                      hasWeekDates: !!calendarInfo.weekDates,
                      weekDatesLength: calendarInfo.weekDates?.length || 0
                    });
                    
                    // 週の日付情報が利用可能な場合はそれを使用
                    if (calendarInfo.weekDates && calendarInfo.weekDates.length > 0) {
                      // 週の表示形式に応じてインデックスを調整
                      const adjustedIndex = index % 7; // 7で割った余りを使用（週の中での相対位置）
                      
                      console.log(`🔢 インデックス調整: 元のindex=${index}, 調整後index=${adjustedIndex}, ヘッダーテキスト=${dateText}`);
                      
                      if (adjustedIndex < calendarInfo.weekDates.length) {
                        // 調整したインデックスに対応する週の日付を使用
                        clickDate = new Date(calendarInfo.weekDates[adjustedIndex]);
                        console.log(`✅ 週の日付配列を使用: adjustedIndex=${adjustedIndex}, clickDate=${clickDate.toISOString().split('T')[0]}`);
                      } else {
                        // インデックスが範囲外の場合のフォールバック
                        console.log(`⚠️ 調整後インデックス ${adjustedIndex} が週の日付配列の範囲外です`);
                        const currentYear = calendarInfo.year;
                        const currentMonth = calendarInfo.month;
                        clickDate = new Date(currentYear, currentMonth, dayOfMonth);
                      }
                    } else {
                      // 週の日付情報がない場合の従来のフォールバック
                      const currentYear = calendarInfo.year;
                      const currentMonth = calendarInfo.month;
                      
                      // 日付オブジェクトを作成
                      clickDate = new Date(currentYear, currentMonth, dayOfMonth);
                      console.log(`⚠️ 従来のフォールバック: year=${currentYear}, month=${currentMonth+1}, day=${dayOfMonth}, clickDate=${clickDate.toISOString().split('T')[0]}`);
                    }
                  } else {
                    // どうしても取得できない場合は今日の日付を使用
                    clickDate = new Date();
                    console.warn('Failed to get date from element, using current date:', clickDate);
                  }
                }
                
                console.log('✅ 最終的なヘッダー日付クリック:', {
                  date: clickDate.toISOString().split('T')[0],
                  year: clickDate.getFullYear(),
                  month: clickDate.getMonth() + 1,
                  day: clickDate.getDate(),
                  weekday: ['日', '月', '火', '水', '木', '金', '土'][clickDate.getDay()]
                });
                this.handleCellClick(clickDate);
              } catch (error) {
                console.error('Error in weekday click handler:', error);
                // エラーが発生した場合は今日の日付を使用
                const today = new Date();
                this.handleCellClick(today);
              }
              
              // イベントの伝播を止める
              e.stopPropagation();
            }, { capture: true });
          });
        } catch (error) {
          console.error('Error setting up header date clicks:', error);
        }
      });
    },
    
    /**
     * 現在のカレンダーの週情報を取得する
     * 週表示で月をまたぐ場合にも正確な日付を返す
     */
    getCurrentCalendarInfo() {
      console.log('🔍 getCurrentCalendarInfo: カレンダー情報の取得を開始');
      
      // 基本的にはVue-Calのインスタンスから週の開始日を取得
      const vuecalInstance = document.querySelector('.vuecal')?.__vue__;
      if (vuecalInstance && vuecalInstance.view && vuecalInstance.view.startDate) {
        // 週の開始日を取得
        const weekStart = new Date(vuecalInstance.view.startDate);
        console.log('📅 Vue-Calから週の開始日を取得:', weekStart);
        console.log('🔎 現在のビュー:', vuecalInstance.currentView);
        
        // 現在のビューに関する追加情報
        if (vuecalInstance.cells && vuecalInstance.cells.length > 0) {
          console.log('📊 セル情報:', 
            vuecalInstance.cells.map(cell => ({
              date: cell.date, 
              content: cell.content,
              events: cell.events?.length || 0
            }))
          );
        }
        
        // 現在の日付から取得（週の最初の日の情報を使用）
        const weekDates = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + i);
          return date;
        });
        
        console.log('📆 計算された週の日付:', 
          weekDates.map(date => date.toISOString().split('T')[0])
        );
        
        return {
          year: weekStart.getFullYear(),
          month: weekStart.getMonth(),
          startDate: weekStart,
          weekDates: weekDates
        };
      }
      
      // フォールバック: Vue-Calから情報を取得できない場合
      console.log('⚠️ Vue-Calインスタンスから情報を取得できないためフォールバック');
      
      let currentDate = new Date();
      const calendarHeaderEl = document.querySelector('.vuecal--custom-theme .vuecal__title');
      
      if (calendarHeaderEl) {
        // カレンダーのタイトルから情報を抽出（フォールバック）
        const titleText = calendarHeaderEl.textContent || '';
        console.log('📝 カレンダータイトルのテキスト:', titleText);
        
        // "Jul 28 - Aug 3, 2025" のような形式も処理（月をまたぐ週の場合）
        const crossMonthMatch = titleText.match(/([A-Za-z]+)\s+(\d+)\s+-\s+([A-Za-z]+)\s+(\d+),\s+(\d{4})/);
        if (crossMonthMatch && crossMonthMatch.length >= 6) {
          console.log('🔄 月をまたぐ週のフォーマットを検出:', crossMonthMatch);
          
          const startMonth = this.getMonthNumberFromName(crossMonthMatch[1]);
          const startDay = parseInt(crossMonthMatch[2], 10);
          const endMonth = this.getMonthNumberFromName(crossMonthMatch[3]);
          const endDay = parseInt(crossMonthMatch[4], 10);
          const year = parseInt(crossMonthMatch[5], 10);
          
          console.log(`🗓️ 解析結果: 開始=${startMonth+1}月${startDay}日, 終了=${endMonth+1}月${endDay}日, 年=${year}`);
          
          if (!isNaN(startMonth) && !isNaN(startDay) && !isNaN(endMonth) && !isNaN(endDay) && !isNaN(year)) {
            // 実際の週の開始日を決定する（日曜日または月曜日から始まる週）
            const firstDisplayedDay = new Date(year, startMonth, startDay);
            let weekStart;
            
            // ヘッダーに表示されている最初の日の曜日を取得
            const firstDayOfWeek = firstDisplayedDay.getDay(); // 0=日曜, 1=月曜, ...
            
            if (firstDayOfWeek === 0) {
              // 日曜日から始まる週の場合、そのまま使用
              weekStart = new Date(firstDisplayedDay);
            } else if (firstDayOfWeek === 1) {
              // 月曜日から始まる週の場合、そのまま使用
              weekStart = new Date(firstDisplayedDay);
            } else {
              // それ以外の場合、表示されている週の日曜日を計算
              weekStart = new Date(firstDisplayedDay);
              weekStart.setDate(startDay - firstDayOfWeek);
            }
            
            console.log('📅 実際の週の開始日:', weekStart);
            
            const weekDates = Array.from({ length: 7 }, (_, i) => {
              const date = new Date(weekStart);
              date.setDate(weekStart.getDate() + i);
              return date;
            });
            
            console.log('📆 月をまたぐ週の日付:', 
              weekDates.map(date => date.toISOString().split('T')[0])
            );
            
            return {
              year: weekStart.getFullYear(),
              month: weekStart.getMonth(),
              startDate: weekStart,
              weekDates: weekDates,
              hasWeekDates: true,
              weekDatesLength: weekDates.length
            };
          }
        }
        
        // 単一月の週の形式 "August 11-17, 2025" の処理
        const singleMonthMatch = titleText.match(/([A-Za-z]+)\s+(\d+)-(\d+),\s+(\d{4})/);
        if (singleMonthMatch && singleMonthMatch.length >= 5) {
          console.log('🔄 単一月の週のフォーマットを検出:', singleMonthMatch);
          
          const month = this.getMonthNumberFromName(singleMonthMatch[1]);
          const startDay = parseInt(singleMonthMatch[2], 10);
          const endDay = parseInt(singleMonthMatch[3], 10);
          const year = parseInt(singleMonthMatch[4], 10);
          
          console.log(`🗓️ 解析結果: 月=${month+1}, 開始日=${startDay}, 終了日=${endDay}, 年=${year}`);
          
          if (!isNaN(month) && !isNaN(startDay) && !isNaN(endDay) && !isNaN(year)) {
            // 実際の週の開始日を決定する
            const firstDisplayedDay = new Date(year, month, startDay);
            let weekStart;
            
            // ヘッダーに表示されている最初の日の曜日を取得
            const firstDayOfWeek = firstDisplayedDay.getDay(); // 0=日曜, 1=月曜, ...
            
            if (firstDayOfWeek === 0) {
              // 日曜日から始まる週の場合、そのまま使用
              weekStart = new Date(firstDisplayedDay);
            } else if (firstDayOfWeek === 1) {
              // 月曜日から始まる週の場合、そのまま使用
              weekStart = new Date(firstDisplayedDay);
            } else {
              // それ以外の場合、表示されている週の日曜日を計算
              weekStart = new Date(firstDisplayedDay);
              weekStart.setDate(startDay - firstDayOfWeek);
            }
            
            console.log('📅 単一月の週の開始日:', weekStart);
            
            const weekDates = Array.from({ length: 7 }, (_, i) => {
              const date = new Date(weekStart);
              date.setDate(weekStart.getDate() + i);
              return date;
            });
            
            console.log('📆 単一月の週の日付:', 
              weekDates.map(date => date.toISOString().split('T')[0])
            );
            
            return {
              year: weekStart.getFullYear(),
              month: month,
              startDate: weekStart,
              weekDates: weekDates,
              hasWeekDates: true,
              weekDatesLength: weekDates.length
            };
          }
        }
        
        // 標準的な形式 "2025年7月" の処理
        const standardMatch = titleText.match(/(\d{4})年(\d{1,2})月/);
        if (standardMatch && standardMatch.length >= 3) {
          console.log('📅 標準的な年月フォーマットを検出:', standardMatch);
          
          const year = parseInt(standardMatch[1], 10);
          const month = parseInt(standardMatch[2], 10) - 1; // JavaScriptの月は0始まり
          
          if (!isNaN(year) && !isNaN(month)) {
            currentDate = new Date(year, month, 1);
            console.log('📆 標準フォーマットから取得した年月:', year, '年', month + 1, '月');
          }
        }
      } else {
        console.log('⚠️ カレンダータイトル要素が見つかりません');
      }
      
      // どの方法でも情報が取得できなかった場合は現在の日付を使用
      console.log('🔄 フォールバック: 現在の日付を使用します:', currentDate);
      
      return {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth(),
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        weekDates: null, // 週の日付が特定できない場合はnull
        hasWeekDates: false,
        weekDatesLength: 0
      };
    },
    
    /**
     * 月名から月番号を取得する (0-based)
     * @param {string} monthName - 月の名前 (Jan, February など)
     * @returns {number} 月の番号 (0-11)、不明な場合は -1
     */
    getMonthNumberFromName(monthName) {
      if (!monthName) return -1;
      
      const monthNames = {
        jan: 0, january: 0,
        feb: 1, february: 1,
        mar: 2, march: 2,
        apr: 3, april: 3,
        may: 4,
        jun: 5, june: 5,
        jul: 6, july: 6,
        aug: 7, august: 7,
        sep: 8, september: 8,
        oct: 9, october: 9,
        nov: 10, november: 10,
        dec: 11, december: 11
      };
      
      const normalizedName = monthName.toLowerCase().trim();
      const result = monthNames[normalizedName] !== undefined ? monthNames[normalizedName] : -1;
      console.log(`🗓️ 月名 "${monthName}" を月番号 ${result} に変換`);
      return result;
    },
    
    /**
     * 日付変更時に呼び出される
     * ヘッダークリックイベントを再設定する
     */
    onDateChanged() {
      console.log('Date changed, resetting header clicks');
      // DOM更新を待ってからヘッダークリックイベントを設定
      this.$nextTick(() => {
        this.setupHeaderDateClicks();
      });
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
.vuecal--custom-theme .vuecal__weekday-date {
  cursor: pointer !important;
  display: inline-block !important;
  padding: 6px 12px !important;
  background: #eef !important;
  border-radius: 4px !important;
  transition: background 0.2s !important;
  pointer-events: auto !important;
}

.vuecal--custom-theme .vuecal__weekday-date:hover {
  background: #c7d2fe !important;
}
/* ヘッダーセル全体をクリック可能に見せる */
.vuecal--custom-theme .vuecal__weekday {
  cursor: pointer !important;
  pointer-events: auto !important;
  transition: background 0.2s !important;
  border-radius: 6px !important;
}
/* 選択状態のセルのデフォルト背景色を無効化 */
.vuecal__cell--selected,
.vuecal__weekday--selected {
  background: none !important;
  box-shadow: none !important;
  /* 必要に応じてborderやcolorもリセット */
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

/* カレンダーイベントの基本スタイル */
.vuecal__event {
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

/* Vue-Cal カスタムテーマの追加調整 */
.vuecal--custom-theme .vuecal__event:hover {
  filter: brightness(0.95);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
