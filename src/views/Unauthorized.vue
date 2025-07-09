<template>
  <div class="greetings">
    <p class="green">{{ msg }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: '403 forbidden — You don\'t have permission to access this resource'
    }
  }
}
</script>

<style scoped>
</style>
