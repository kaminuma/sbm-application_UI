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
    };
  },
};
</script>

<style scoped>
.v-calendar {
  height: 600px;
}
</style>