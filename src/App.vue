<template>
  <v-app>
    <Header :showMenu="showMenu" @toggle-sidebar="toggleSidebar" />
    <Sidebar
      v-if="showMenu"
      :isOpen="isSidebarOpen"
      @close-sidebar="toggleSidebar"
    />
    <v-main>
      <router-view @update:showMenu="updateShowMenu" />
    </v-main>
  </v-app>
</template>

<script>
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";
import { mapActions } from "vuex";
import { setAuthToken } from "./services/authUtils";

export default {
  components: {
    Header,
    Sidebar,
  },
  data() {
    return {
      isSidebarOpen: false,
      showMenu: true,
    };
  },
  created() {
    const token = localStorage.getItem("token");
    if (token) {
      this.setAuthentication(true); // Vuexに認証状態を設定
      setAuthToken(); // Axiosにトークンを設定
    }
  },
  methods: {
    ...mapActions(["setAuthentication"]),

    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    updateShowMenu(value) {
      this.showMenu = value;
      if (!value) {
        this.isSidebarOpen = false;
      }
    },
  },
};
</script>

<style>
body {
  font-family: "Poppins", sans-serif;
  background-color: #f0f4f8;
}
</style>
