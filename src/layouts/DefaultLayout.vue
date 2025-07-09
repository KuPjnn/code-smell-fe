<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <DefaultHeader/>
      </el-header>
      <el-container>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import DefaultHeader from "@/components/DefaultHeader.vue";

export default defineComponent({
  components: {DefaultHeader}
})
</script>

<style scoped>

</style>