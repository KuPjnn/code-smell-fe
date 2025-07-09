<template>
  <el-form
      :inline="false"
      :model="post"
      :rules="rules"
      ref="formPost"
      @keydown.enter.prevent
      label-width="auto"
  >
    <el-form-item label="Thumbnail" prop="thumbnail">
      <div class="thumbnail-container">
        <el-image
            v-if="post.thumbnail"
            :src="post.thumbnail"
            class="thumbnail-preview"
            fit="cover"
            @click="showMinioForThumbnail = true"
        />
        <el-button @click="showMinioForThumbnail = true">
          <el-icon>
            <PictureFilled/>
          </el-icon>
          Select Thumbnail
        </el-button>
      </div>
    </el-form-item>

    <el-form-item label="Title" prop="title">
      <el-input v-model="post.title"/>
    </el-form-item>

    <el-form-item label="Slug" prop="slug">
      <el-input v-model="post.slug"/>
    </el-form-item>

    <el-form-item label="Category" prop="category">
      <el-select
          v-model="post.category"
          value-key="id"
          placeholder="Please select category"
          filterable
          clearable
      >
        <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="Tags" prop="tags">
      <el-select
          v-model="post.tags"
          value-key="id"
          :max-collapse-tags="5"
          placeholder="Please select tags"
          multiple
          clearable
          filterable
          collapse-tags
          collapse-tags-tooltip
      >
        <el-option
            v-for="item in tags"
            :key="item.id"
            :label="`#${item.name}`"
            :value="item"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="Content" prop="content">
      <MdEditor
          ref="mdEditor"
          language="en-US"
          v-model="post.content"
          @onUploadImg="onUploadFile"
          :toolbars="toolbars"
          :toolbarsExclude="['github', 'save']"
      >
        <template #defToolbars>
          <NormalToolbar title="Select from MinIO" @onClick="showMinioForMdEditor = true">
            <el-icon>
              <PictureFilled/>
            </el-icon>
          </NormalToolbar>
        </template>
      </MdEditor>
    </el-form-item>

    <div class="form-btn-action">
      <el-button type="info" @click="onSubmit('formPost', postStatus.DRAFT)">Daft</el-button>
      <el-button type="primary" @click="onSubmit('formPost', postStatus.PUBLISHED)">Published</el-button>
      <el-button type="danger" @click="onSubmit('formPost', postStatus.ARCHIVED)">Archived</el-button>
    </div>
  </el-form>

  <!-- Dialog show for MDEditor -->
  <el-dialog v-model="showMinioForMdEditor" width="80%">
    <Minio
        :selectable="true"
        @select="handleFileSelect"
        @cancel="showMinioForMdEditor = false"
    />
  </el-dialog>

  <!-- Dialog show for Thumbnail -->
  <el-dialog v-model="showMinioForThumbnail" width="80%">
    <Minio
        :selectable="true"
        @select="handleThumbnailSelect"
        @cancel="showMinioForThumbnail = false"
    />
  </el-dialog>
</template>

<script>
import {createPost, getPost, updatePost} from "@/api/post.js";
import {getCategories} from "@/api/category.js";
import {getTags} from "@/api/tag.js";
import {uploadFile} from "@/api/minio.js";
import {hideLoading, showLoading} from "@/utils/LoadingService.js";
import {postStatus} from "@/utils/PostStatus.js";
import {Constant} from "@/utils/Constant.js";
import {ElMessage} from "element-plus";
import {MdEditor, NormalToolbar} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import Minio from "@/components/Minio.vue";
import {PictureFilled, Search} from "@element-plus/icons-vue";

const defaultPost = {
  id: null,
  status: 'DRAFT',
  thumbnail: null,
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

const defaultRules = {
  thumbnail: [
    {required: true, message: 'Filed is required', trigger: 'blur'},
  ],
  title: [
    {required: true, message: 'Filed is required', trigger: 'blur'},
    {min: 2, max: 50, message: 'Length 3 to 50 characters', trigger: 'blur'}
  ],
  slug: [
    {required: true, message: 'Filed is required', trigger: 'blur'},
    {min: 2, max: 50, message: 'Length 3 to 50 characters', trigger: 'blur'}
  ],
  content: [
    {required: true, message: 'Filed is required', trigger: 'blur'},
    {min: 5, max: 5000, message: 'Length 5 to 5000 characters', trigger: 'blur'}
  ],
  category: [
    {required: true, message: 'Filed is required', trigger: 'blur'},
  ],
  tags: [
    {required: true, message: 'Filed is required', trigger: 'blur'},
  ],
}

const defaultCategories = []

const defaultTags = []

const defaultPageRequest = {
  pageNum: 1,
  pageSize: 100,
  sort: "DESC",
}

export default {
  props: {
    id: String,
  },
  components: {
    PictureFilled,
    Search,
    Minio,
    MdEditor,
    NormalToolbar
  },
  data() {
    return {
      post: Object.assign({}, defaultPost),
      rules: Object.assign({}, defaultRules),
      postStatus: Object.assign({}, postStatus),
      categories: Object.assign({}, defaultCategories),
      tags: Object.assign({}, defaultTags),
      pageRequest: Object.assign({}, defaultPageRequest),
      showMinioForMdEditor: false,
      showMinioForThumbnail: false,
      toolbars: Constant.TOOLBARS
    }
  },
  created() {
    if (this.id != null) {
      this.getPost(this.id);
    } else {
      this.post = Object.assign({}, defaultPost);
    }
    this.getCategories(this.pageRequest);
    this.getTags(this.pageRequest);
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
    onSubmit(formName, status) {
      showLoading();
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.post.status = status;
          if (this.post.id == null) {
            await createPost(this.post).then(result => {
              this.post = Object.assign({}, defaultPost);
              ElMessage.success(result.data.message);
            }).catch(error => {
              console.log(error);
              ElMessage.error("Oops!");
            });
          } else {
            await updatePost(this.post).then(result => {
              this.post = result.data.data;
              ElMessage.success(result.data.message);
            }).catch(error => {
              console.log(error);
              ElMessage.error("Oops!");
            });
          }
        }
      })
      hideLoading();
    },
    getCategories(pageRequest) {
      getCategories(pageRequest).then(result => {
        this.categories = result.data.data.content;
      }).catch(error => {
        console.log(error);
        ElMessage.error("Oops!");
      })
    },
    getTags(pageRequest) {
      getTags(pageRequest).then(result => {
        this.tags = result.data.data.content;
      }).catch(error => {
        console.log(error);
        ElMessage.error("Oops!");
      })
    },
    async onUploadFile(files, callback) {
      showLoading();
      const data = await Promise.all(files.map((file) => {
        return new Promise((resolve, reject) => {
          const form = new FormData();
          form.append('file', file);

          uploadFile(form).then(resp => {
            resolve(resp.data);
          }).catch(error => {
            reject(error);
          });
        });
      }));

      callback(
          data.map((item) => ({
            url: `${Constant.DOWNLOAD_FILE_URL}?path=${item.data.filePath}`,
            alt: item.data.fileName,
            title: item.data.fileName,
          }))
      );

      hideLoading();
    },
    handleFileSelect(file) {
      this.showMinioForMdEditor = false;
      const imageMarkdown = `![${file.name}](${file.url})`;
      this.$refs.mdEditor?.insert((text) => {
        return {
          targetValue: imageMarkdown,
          select: false,
          deviationStart: 0,
          deviationEnd: 0
        }
      });
    },
    handleThumbnailSelect(file) {
      this.showMinioForThumbnail = false;
      this.post.thumbnail = file.url;
    }
  },
}
</script>

<style scoped>
.form-btn-action {
  text-align: center;
}

::v-deep(.md-toolbar-item) {
  display: flex;
  align-items: center;
  padding: 0 8px;
}

::v-deep(.md-editor-toolbar .md-editor-toolbar-item svg) {
  width: 15px !important;
  height: 15px !important;
}

.thumbnail-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.thumbnail-preview {
  width: auto;
  height: 150px;
  border-radius: 8px;
  border: 2px solid #dcdfe6;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.thumbnail-preview:hover {
  border-color: #409eff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>
