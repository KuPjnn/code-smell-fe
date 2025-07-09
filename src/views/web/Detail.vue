<template>
  <div class="common-layout">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="2" :lg="4" :xl="4"/>
      <el-col :xs="24" :sm="24" :md="20" :lg="16" :xl="16" class="shadow shadow-blue-100">
        <h3 class="header">{{ post.title }}</h3>
        <div class="container-content">
          <MdPreview id="preview"
                     language="en-US"
                     :modelValue="post.content"
          />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="2" :lg="4" :xl="4"/>
    </el-row>
  </div>

  <div>
    <el-button
        type="info"
        class="fixed bottom-10 -left-2 z-50"
        @click="isShowCatalog = !isShowCatalog"
    >
      ☰
    </el-button>
    <div
        v-if="isShowCatalog"
        @click="isShowCatalog = false"
        class="fixed inset-0 bg-blue-50 bg-opacity-30 z-30"
    />
    <div
        class="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transition-transform duration-300"
        :class="isShowCatalog ? 'translate-x-0' : '-translate-x-full'"
    >
      <MdCatalog editorId="preview" :scrollElement="scrollElement"/>
    </div>
  </div>

</template>

<script>
import {getPost} from "@/api/post.js";
import {ElMessage} from "element-plus";
import {MdCatalog, MdPreview} from "md-editor-v3";
import 'md-editor-v3/lib/style.css';
import {List} from "@element-plus/icons-vue";

const defaultPost = {
  id: null,
  status: 'DRAFT',
  title: null,
  slug: null,
  content: '',
  category: null,
  tags: [],
  files: [],
  createdBy: null,
  updatedBy: null,
  createdDate: null,
  updatedDate: null,
}

export default {
  props: {
    id: String,
    slug: Array,
  },
  components: {
    List,
    MdPreview,
    MdCatalog
  },
  created() {
    if (this.id != null) {
      this.getPost(this.id);
    } else {
      this.post = Object.assign({}, defaultPost);
    }
  },
  data() {
    return {
      post: Object.assign({}, defaultPost),
      scrollElement: document.documentElement,
      isShowCatalog: false,
    }
  },
  methods: {
    getPost(id) {
      getPost(id).then(result => {
        this.post = result.data.data;
      }).catch(error => {
        console.log(error);
        ElMessage.error("Oops!");
      })
    },
  }
}
</script>

<style scoped>
.header {
  font-size: 24px;
  font-weight: bold;
  padding: 20px;
  border-bottom: black dotted thin;
}
</style>
