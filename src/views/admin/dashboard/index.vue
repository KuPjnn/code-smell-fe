<template>
  <div class="dashboard">
    <!-- Statistics Cards -->
    <stats-overview :stats="statistics"/>

    <!-- Main Content Grid -->
    <el-row :gutter="20" class="dashboard-grid">
      <!-- Charts Section -->
      <el-col :span="16">
        <recent-posts class="dashboard-card"/>
      </el-col>

      <!-- Side Widgets -->
      <el-col :span="8">
        <quick-actions class="dashboard-card"/>
        <recent-activities class="dashboard-card"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import StatsOverview from './components/StatsOverview.vue'
import RecentPosts from './components/RecentPosts.vue'
import QuickActions from './components/QuickActions.vue'
import RecentActivities from './components/RecentActivities.vue'


export default {
  components: {
    StatsOverview,
    RecentPosts,
    QuickActions,
    RecentActivities
  },
  data() {
    return {
      statistics: {
        posts: {count: 150, trend: '+12%', icon: 'Document'},
        users: {count: 1234, trend: '+5%', icon: 'User'},
        comments: {count: 856, trend: '+18%', icon: 'ChatDotRound'},
        views: {count: '25.6K', trend: '+25%', icon: 'View'}
      }
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.dashboard-grid {
  margin-top: 20px;
}

.dashboard-card {
  margin-bottom: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}
</style>