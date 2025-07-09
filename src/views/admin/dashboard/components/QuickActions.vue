<template>
  <el-card class="quick-actions">
    <template #header>
      <div class="card-header">
        <span>Quick Actions</span>
      </div>
    </template>
    <div class="actions-list">
      <el-button v-for="action in actions"
                 :key="action.text"
                 :type="action.type"
                 class="action-button">
        <el-icon>
          <component :is="action.icon"/>
        </el-icon>
        <span>{{ action.text }}</span>
      </el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      actions: [
        {text: 'New Post', icon: 'EditPen', type: 'primary'},
        {text: 'Upload Media', icon: 'Upload', type: 'success'},
        {text: 'Manage Users', icon: 'User', type: 'warning'},
        {text: 'Settings', icon: 'Setting', type: 'info'}
      ]
    }
  }
}
</script>

<style scoped>
.action-button {
  width: 100%;
  margin: 10px 0;
}
</style>