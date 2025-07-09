<template>
  <el-row :gutter="20" class="stats-overview">
    <el-col :span="6" v-for="(stat, key) in stats" :key="key">
      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon class="stat-icon">
            <component :is="stat.icon"/>
          </el-icon>
          <div class="stat-info">
            <div class="stat-count">{{ stat.count }}</div>
            <div class="stat-label">{{ key }}</div>
            <div class="stat-trend" :class="{'trend-up': stat.trend.includes('+')}">
              {{ stat.trend }}
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    stats: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.stats-overview {
  margin-bottom: 20px;
}

.stat-card {
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  font-size: 48px;
  color: #409EFF;
  margin-right: 16px;
}

.stat-count {
  font-size: 24px;
  font-weight: bold;
}

.stat-label {
  color: #909399;
  text-transform: capitalize;
}

.stat-trend {
  font-size: 14px;
  margin-top: 4px;
}

.trend-up {
  color: #67C23A;
}
</style>