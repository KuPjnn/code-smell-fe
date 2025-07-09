<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="auto">
        <AdminSideBar/>
      </el-aside>
      <el-container>
        <el-header>
          <AdminHeader/>
        </el-header>
        <el-main>
          <router-view/>
        </el-main>
        <el-footer>
          <AdminFooter/>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import AdminHeader from "@/components/AdminHeader.vue";
import AdminSideBar from "@/components/AdminSideBar.vue";
import AdminFooter from "@/components/AdminFooter.vue";

export default defineComponent({
  components: {AdminFooter, AdminSideBar, AdminHeader}
})
</script>

<style scoped>
.common-layout,
.el-container {
  height: 100vh;
}

.el-aside,
.el-main {
  height: 100%;
  min-height: 0;
  overflow: auto;
}
</style>