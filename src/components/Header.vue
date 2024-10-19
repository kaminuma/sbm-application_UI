<template>
  <header>
    <h1>{{ title }}</h1>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: {
      type: String,
      default: 'sbm-application',
    },
  },
};
</script>

<style scoped>
header {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 1rem;
}
</style>