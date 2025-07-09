<template>
  <el-menu
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      :router="true"
      @select="handleSelect"
  >
    <el-menu-item index="/" route="/">
      <img
          style="width: 30px"
          src="@/assets/logo.svg"
          alt="Element logo"
      />
      <h3>Code Smell</h3>
    </el-menu-item>
    <el-menu-item index="/explore" route="/explore">
      <el-icon>
        <Search/>
      </el-icon>
      <span>Explore</span>
    </el-menu-item>
    <el-menu-item index="/" v-if="!isLogin" @click="login">
      <el-icon>
        <User/>
      </el-icon>
      <span>Login</span>
    </el-menu-item>
    <el-sub-menu index="/" v-if="isLogin">
      <template #title>
        <el-avatar
            :src="Constant.DOWNLOAD_FILE_URL+`?path=avatar/avatar.jpg`"
        />
      </template>
      <el-menu-item index="/admin" route="/admin">
        Admin
        <el-icon style="margin-left: auto">
          <Tools/>
        </el-icon>
      </el-menu-item>
      <el-menu-item index="/" @click="logout">
        Logout
        <el-icon style="margin-left: auto">
          <ArrowRight/>
        </el-icon>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script>
import {getKeycloakAuthUrl, isAuthenticated, logout} from "@/auth/auth";
import {ArrowRight, Search, Tools, User} from "@element-plus/icons-vue";
import {Constant} from "@/utils/Constant.js";

export default {
  computed: {
    Constant() {
      return Constant
    }
  },
  components: {Search, ArrowRight, Tools, User},
  async created() {
    this.isLogin = await isAuthenticated();
  },
  data() {
    return {
      isLogin: false
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    login() {
      window.location.href = getKeycloakAuthUrl();
    },
    logout() {
      logout();
    },
  }
}
</script>

<style>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>