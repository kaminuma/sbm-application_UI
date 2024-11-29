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
  methods: {
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
