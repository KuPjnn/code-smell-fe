<template>
  <el-card class="posts-card">
    <template #header>
      <div class="card-header">
        <span>Recent Posts</span>
        <el-button type="primary" size="small">View All</el-button>
      </div>
    </template>
    <el-table :data="posts" style="width: 100%" size="large">
      <el-table-column prop="title" label="Title" min-width="200"/>
      <el-table-column prop="author" label="Author" width="120"/>
      <el-table-column prop="status" label="Status" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="Date" width="120"/>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      posts: [
        {title: 'Getting Started with Vue 3', author: 'John Doe', status: 'published', date: '2024-02-20'},
        {title: 'Best Practices in Web Design', author: 'Jane Smith', status: 'draft', date: '2024-02-19'},
        {title: 'Modern CSS Techniques', author: 'Mike Johnson', status: 'pending', date: '2024-02-18'},
        {title: 'JavaScript Tips and Tricks', author: 'Sarah Wilson', status: 'published', date: '2024-02-17'}
      ]
    }
  },
  methods: {
    getStatusType(status) {
      const types = {
        published: 'success',
        draft: 'info',
        pending: 'warning'
      }
      return types[status] || 'info'
    }
  }
}
</script>