<template>
  <header class="header">
    <div v-if="showMenu" class="menu-icon" @click="$emit('toggle-sidebar')">
      <v-icon>mdi-menu</v-icon>
    </div>
    <h1 class="header-title">sbm-application</h1>
  </header>
</template>

<script>
export default {
  name: "Header",
  props: {
    showMenu: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style scoped>
.header {
  background-color: #00bfa5; /* ネオミント */
  height: 60px;
  display: flex;
  align-items: center;
  color: #ffffff;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-title {
  margin: 0;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 24px;
}

.menu-icon {
  margin-right: 20px;
  cursor: pointer;
}

.v-icon {
  color: #ffffff;
}

@media (max-width: 600px) {
  .header-title {
    font-size: 20px;
  }
}
</style>
