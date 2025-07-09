<template>
  <el-card class="activities-card">
    <template #header>
      <div class="card-header">
        <span>Recent Activities</span>
      </div>
    </template>
    <el-timeline>
      <el-timeline-item
          v-for="activity in activities"
          :key="activity.id"
          :type="activity.type"
          :timestamp="activity.time">
        <div class="activity-content">
          <strong>{{ activity.user }}</strong>
          {{ activity.action }}
        </div>
      </el-timeline-item>
    </el-timeline>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      activities: [
        {id: 1, user: 'John Doe', action: 'published a new post', time: '10 minutes ago', type: 'primary'},
        {id: 2, user: 'Jane Smith', action: 'updated site settings', time: '2 hours ago', type: 'success'},
        {id: 3, user: 'Mike Johnson', action: 'added new comment', time: '5 hours ago', type: 'info'},
        {id: 4, user: 'Sarah Wilson', action: 'uploaded new media', time: 'yesterday', type: 'warning'}
      ]
    }
  }
}
</script>

<style scoped>
.activities-card {
  height: 400px;
  overflow-y: auto;
}

.activity-content {
  font-size: 14px;
  line-height: 1.4;
}
</style>