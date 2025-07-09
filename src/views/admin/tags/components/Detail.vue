<template>
  <el-form
      :inline="true"
      :model="tag"
      :rules="rules"
      ref="formTag"
      @keydown.enter.prevent
  >
    <el-form-item label="Tag Name" prop="name">
      <el-input v-model="tag.name"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit('formTag')">Submit</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {ElMessage} from "element-plus";
import {createTag, getTag, updateTag} from "@/api/tag.js";

const defaultTag = {
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
      tag: Object.assign({}, defaultTag),
      rules: Object.assign({}, defaultRules),
    }
  },
  created() {
    if (this.id != null) {
      this.getTag(this.id);
    } else {
      this.tag = Object.assign({}, defaultTag);
    }
  },
  methods: {
    getTag(id) {
      getTag(id).then(result => {
        this.tag = result.data.data;
      }).catch(error => {
        console.log(error);
        ElMessage.error("Oops!");
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.tag.id == null) {
            await createTag(this.tag).then(result => {
              this.tag = Object.assign({}, defaultTag);
              ElMessage.success(result.data.message);
            }).catch(error => {
              console.log(error);
              ElMessage.error("Oops!");
            });
          } else {
            await updateTag(this.tag).then(result => {
              this.tag = result.data.data;
              ElMessage.success(result.data.message);
            }).catch(error => {
              console.log(error);
              ElMessage.error("Oops!");
            });
          }
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
