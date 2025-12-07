<template>
  <div class="admin-sidebar d-flex flex-column">
    <el-menu
        ref="menu"
        class="sidebar-menu flex-grow-1"
        :collapse="isCollapse"
        :router="true"
        :default-active="$route.path"
        background-color="#f5f7f9"
        text-color="#333"
        active-text-color="#0052d9"
    >
      <el-menu-item index="/" route="/">
        <img style="width: 30px" src="@/assets/logo.svg" alt="Element logo"/>
      </el-menu-item>

      <template v-for="item in menuItems" :key="item.index">
        <!-- For items without children -->
        <el-menu-item v-if="!item.children" :index="item.index" :route="item.index" v-role="item.roles">
          <el-icon>
            <component :is="item.icon"/>
          </el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>

        <!-- For items with children -->
        <el-sub-menu v-else :index="item.index" v-role="item.roles">
          <template #title>
            <el-icon>
              <component :is="item.icon"/>
            </el-icon>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
              v-for="child in item.children"
              :key="child.index"
              :index="child.index"
          >
            {{ child.title }}
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>

    <el-menu
        class="collapse-menu"
        :collapse="isCollapse"
        background-color="#f5f7f9"
        text-color="#333"
    >
      <el-menu-item id="collapse-button" @click="toggleCollapse">
        <el-icon>
          <component :is="isCollapse ? 'DArrowRight' : 'DArrowLeft'"/>
        </el-icon>
        <template #title>{{ isCollapse ? 'Expand' : 'Collapse' }}</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import {ref, watch, onMounted} from 'vue'
import {useRoute} from 'vue-router'

const route = useRoute()
const menu = ref(null)
const isCollapse = ref(false)

const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

const menuItems = [
  {
    index: '/admin',
    title: 'Dashboard',
    icon: 'DataLine',
    roles: ['user']
  },
  {
    index: '/admin/categories',
    title: 'Categories',
    icon: 'Location',
    roles: ['admin'],
    children: [
      {index: '/admin/categories', title: 'List'},
      {index: '/admin/categories/create', title: 'Add'}
    ]
  },
  {
    index: '/admin/tags',
    title: 'Tags',
    icon: 'CollectionTag',
    roles: ['admin'],
    children: [
      {index: '/admin/tags', title: 'List'},
      {index: '/admin/tags/create', title: 'Add'}
    ]
  },
  {
    index: '/admin/posts',
    title: 'Posts',
    icon: 'Document',
    roles: ['admin'],
    children: [
      {index: '/admin/posts', title: 'List'},
      {index: '/admin/posts/create', title: 'Add'}
    ]
  },
  {
    index: '/admin/wedding',
    title: 'My Wedding',
    icon: 'GobletSquareFull',
    roles: ['wedding'],
    children: [
      {index: '/admin/wedding', title: 'Invite'},
      {index: '/admin/wedding/images', title: 'Images'}
    ]
  },
  {
    index: '/admin/files',
    title: 'Files',
    icon: 'Files',
    roles: ['user'],
  }
]

watch(() => route.path, (newPath) => {
  if (menu.value) {
    menu.value.defaultActive = newPath
  }
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

onMounted(() => {
  isCollapse.value = isMobileDevice()
})
</script>

<style scoped>
.admin-sidebar {
  height: 100vh;
  border-right: 1px solid #e6e6e6;
  background-color: #f5f7f9;
  display: flex;
  flex-direction: column;
}

.sidebar-menu {
  border-right: none !important;
  flex: 1;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 220px;
}

.collapse-menu {
  border-top: 1px solid #e6e6e6;
  margin-top: auto;
}

:deep(.el-menu-item.is-active) {
  background-color: #e6f4ff !important;
  color: #0052d9 !important;
  border-right: 2px solid #0052d9;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: #e6e6e6 !important;
}

:deep(.el-sub-menu.is-active .el-sub-menu__title) {
  color: #0052d9 !important;
}
</style>