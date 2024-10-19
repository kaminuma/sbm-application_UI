<template>
    <div class="schedule-view">
      <h2>スケジュール一覧</h2>
      <table class="schedule-table">
        <thead>
          <tr>
            <th>日付</th>
            <th>イベント名</th>
            <th>詳細</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(event, index) in events" :key="index">
            <td>{{ event.date }}</td>
            <td>{{ event.name }}</td>
            <td>{{ event.details }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ScheduleView',
    data() {
      return {
        events: [
          { date: '2024-10-01', name: 'ミーティング', details: 'プロジェクトの進捗確認' },
          { date: '2024-10-05', name: 'ワークショップ', details: '新技術の勉強会' },
          // 他のイベントも追加できます
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .schedule-view {
    padding: 20px;
  }
  
  .schedule-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .schedule-table th, .schedule-table td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }
  
  .schedule-table th {
    background-color: #f2f2f2;
  }
  </style>