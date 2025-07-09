<template>
  <el-form
      :inline="true"
      :model="category"
      :rules="rules"
      ref="formCategory"
      @keydown.enter.prevent
  >
    <el-form-item label="Category Name" prop="name">
      <el-input v-model="category.name"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit('formCategory')">Submit</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {createCategory, getCategory, updateCategory} from "@/api/category.js";
import {ElMessage} from "element-plus";
import {hideLoading, showLoading} from "@/utils/LoadingService.js";

const defaultCategory = {
  id: null,
  name: null,
}

const defaultRules = {
  name: [
    {required: true, message: 'Filed is required', trigger: 'blur'},
    {min: 2, max: 50, message: 'Length 3 to 50 characters', trigger: 'blur'}
  ],
}

export default {
  props: {
    id: String,
  },
  data() {
    return {
      category: Object.assign({}, defaultCategory),
      rules: Object.assign({}, defaultRules),
    }
  },
  created() {
    if (this.id != null) {
      this.getCategory(this.id);
    } else {
      this.category = Object.assign({}, defaultCategory);
    }
  },
  methods: {
    getCategory(id) {
      getCategory(id).then(result => {
        this.category = result.data.data;
      }).catch(error => {
        console.log(error);
        ElMessage.error("Oops!");
      })
    },
    onSubmit(formName) {
      showLoading();
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.category.id == null) {
            await createCategory(this.category).then(result => {
              this.category = Object.assign({}, defaultCategory);
              ElMessage.success(result.data.message);
            }).catch(error => {
              console.log(error);
              ElMessage.error("Oops!");
            });
          } else {
            await updateCategory(this.category).then(result => {
              this.category = result.data.data;
              ElMessage.success(result.data.message);
            }).catch(error => {
              console.log(error);
              ElMessage.error("Oops!");
            });
          }
        }
      })
      hideLoading();
    }
  }
}
</script>

<style scoped>
</style>
