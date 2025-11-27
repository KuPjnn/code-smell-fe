<template>
  <el-menu
      class="el-menu-demo justify-end"
      mode="horizontal"
      :ellipsis="false"
      :router="true"
      @select="handleSelect"
  >
    <el-sub-menu index="/admin">
      <template #title>
        <el-avatar :src="user.picture"/>
        <span>{{ user.name }}</span>
      </template>
      <el-menu-item index="/" @click="logout">
        <span>Logout</span>
        <el-icon style="margin-left: auto">
          <ArrowRight/>
        </el-icon>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script>

import {logout} from "@/auth/auth";
import {ArrowRight} from "@element-plus/icons-vue";
import {Constant} from "../utils/Constant.js";
import {useAuthStore} from "@/store/index.js";

export default {
  data() {
    return {
      user: useAuthStore().currentUser,
    };
  },
  computed: {
    Constant() {
      return Constant
    }
  },
  components: {ArrowRight},
  methods: {
    async logout() {
      await logout();
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
  },
};
</script>

<style>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>