<template>
  <el-container class="minio-container">
    <div class="collapse-button" @click="toggleCollapse">
      <el-icon>
        <Expand v-if="isCollapse"/>
        <Fold v-else/>
      </el-icon>
    </div>
    <el-aside :width="isCollapse ? '0px' : '200px'" class="folder-tree">
      <el-header height="50px" class="content-header" @click="toggleCollapse">
        <div class="tree-header">
          <el-icon>
            <FolderOpened/>
          </el-icon>
          <span>File Browser</span>
        </div>
      </el-header>

      <el-tree
          :lazy="true"
          :data="folderTree"
          :props="defaultProps"
          node-key="filePath"
          :highlight-current="true"
          @node-click="handleNodeClick"
      >
        <template #default="{ node }">
          <div class="custom-tree-node">
            <el-icon>
              <Folder/>
            </el-icon>
            <span>{{ node.label }}</span>
          </div>
        </template>
      </el-tree>
    </el-aside>

    <el-container>
      <el-header height="50px" class="content-header" @click="toggleCollapse">
        <div class="breadcrumb">
          <el-icon>
            <FolderOpened/>
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>Root</el-breadcrumb-item>
            <el-breadcrumb-item v-for="path in currentPath" :key="path">
              {{ path }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-header>

      <el-main class="content-main">
        <!-- Add mode switch if needed -->
        <div class="mode-switch" v-if="selectable">
          <el-radio-group v-model="viewMode">
            <el-radio-button value="grid">Grid View</el-radio-button>
            <el-radio-button value="upload">Upload View</el-radio-button>
          </el-radio-group>
        </div>

        <!-- Grid view for selection mode -->
        <div v-if="selectable && viewMode === 'grid'" class="file-grid">
          <div v-for="file in fileList"
               :key="file.name"
               class="file-item"
               :class="{ 'selected': selectedFile === file }"
               @click="selectFile(file)">
            <img :src="file.url" :alt="file.name">
            <div class="file-name">{{ file.name }}</div>
          </div>
          <el-empty v-if="fileList.length === 0"
                    :image-size="60"
                    description="No files found"
                    class="mx-auto flex flex-col items-center justify-center"
          />
        </div>

        <!-- Upload view for file upload -->
        <el-upload
            v-else
            class="file-uploader"
            list-type="picture-card"
            v-model:file-list="fileList"
            :http-request="handleUploadFile"
            :on-preview="handleFilePreview"
            :before-remove="handleConfirmRemove"
            :on-remove="handleFileRemove"
            accept=".jpg,.png"
        >
          <template #default>
            <el-icon>
              <Plus/>
            </el-icon>
          </template>
        </el-upload>
      </el-main>
    </el-container>
  </el-container>

  <!-- Dialog for image preview -->
  <el-dialog v-model="dialogVisible"
             class="preview-dialog"
             :modal-class="'preview-dialog-modal'"
  >
    <img :src="dialogImageUrl" alt="Preview Image" class="preview-image"/>
  </el-dialog>

  <!-- Footer for selection mode -->
  <div v-if="selectable" class="dialog-footer">
    <el-button @click="$emit('cancel')">Cancel</el-button>
    <el-button type="primary" @click="confirmSelection" :disabled="!selectedFile">
      Select
    </el-button>
  </div>
</template>
<script>
import {deleteFile, getFiles, uploadFile} from "@/api/minio.js";
import {hideLoading, showLoading} from "@/utils/LoadingService.js";
import {Expand, Fold, Folder, FolderOpened, Plus, UploadFilled} from "@element-plus/icons-vue";
import {Constant} from "@/utils/Constant.js";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  emits: ['select', 'cancel'],
  components: {Fold, Expand, FolderOpened, Folder, Plus, UploadFilled},
  props: {
    selectable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPath() {
      return this.folderPath
          .split('/')
          .filter(p => p)
    }
  },
  data() {
    return {
      isCollapse: false,
      folderPath: '',
      folderTree: [],
      defaultProps: {
        label: 'fileName',
        isLeaf: 'isLeaf',
        children: 'children',
      },
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      selectedFile: null,
      viewMode: 'grid'
    };
  },
  methods: {
    async fetchFiles() {
      const response = await getFiles(this.folderPath === '/' ? '' : this.folderPath);

      this.folderTree = response.data.data
          .filter(item => !item.isLeaf)
          .map(item => {
            return {
              fileName: item.filePath.replace(this.folderPath, ''),
              filePath: item.filePath,
              isLeaf: item.isLeaf,
              children: null,
            };
          });

      if (this.folderPath !== '') {
        this.folderTree.unshift({
          fileName: '..',
          filePath: this.folderPath.split('/').slice(0, -2).join('/') + '/',
          isLeaf: false,
          children: null,
        });
      }

      this.fileList = response.data.data
          .filter(item => item.isLeaf)
          .map(item => ({
            name: item.fileName.replace(this.folderPath, ''),
            url: Constant.DOWNLOAD_FILE_URL + item.filePath,
          }));
    },
    handleNodeClick(node) {
      this.folderPath = node.filePath;
      if (!node.isLeaf) {
        this.fetchFiles();
      }
    },
    handleFilePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleUploadFile({file}) {
      const path = this.folderPath;
      const form = new FormData();
      form.append('file', file);
      uploadFile(form, path)
          .then(result => {
            ElMessage.success(result.data.message);
          })
          .catch(error => {
            console.log(error);
            ElMessage.error("Oops!");
          });
    },
    handleFileRemove(file) {
      deleteFile(`${this.folderPath}${file.name}`)
          .then(result => {
            ElMessage.success(result.data.message);
          })
          .catch(error => {
            console.log(error);
            ElMessage.error("Oops!");
          });
    },
    async handleConfirmRemove(file, files) {
      return ElMessageBox.confirm(
          'It will permanently delete the file. Continue?',
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
          })
          .then(() => {
            return true;
          })
          .catch(() => {
            return false;
          });
    },
    selectFile(file) {
      this.selectedFile = file;
    },
    confirmSelection() {
      if (this.selectedFile) {
        this.$emit('select', this.selectedFile);
      }
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
  mounted() {
    showLoading();
    this.fetchFiles();
    hideLoading();
  }
}
</script>

<style scoped>
.minio-container {
  height: 100%;
}

.folder-tree {
  border-right: 1px solid #e6e6e6;
}

.tree-header {
  height: 50px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid #e6e6e6;
  background: #fff;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
}

:deep(.el-tree-node__content) {
  height: 40px;
}

:deep(.el-tree-node:focus>.el-tree-node__content) {
  background-color: #e6f4ff;
  color: #0052d9;
}

.content-header {
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 16px;
  display: flex;
  align-items: center;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}

.content-main {
  padding: 20px;
  background: #fff;
}

.file-uploader {
  :deep(.el-upload--picture-card) {
    width: 148px;
    height: 148px;
    line-height: 148px;
  }
}

.mode-switch {
  margin-bottom: 16px;
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  padding: 16px;
}

.file-item {
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px;
  text-align: center;
  transition: all 0.3s;
}

.file-item:hover {
  background-color: #f5f7fa;
}

.file-item.selected {
  border-color: #409EFF;
  background-color: #ecf5ff;
}

.file-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}

.dialog-footer {
  padding: 16px;
  text-align: right;
  border-top: 1px solid #e6e6e6;
}

.preview-dialog {
  :deep(.el-dialog) {
    max-height: 80vh;
    margin-top: 10vh !important;
  }

  :deep(.el-dialog__body) {
    padding: 10px;
    max-height: calc(80vh - 100px);
    overflow: auto;
  }
}

.preview-image {
  max-width: 100%;
  max-height: calc(80vh - 100px);
  object-fit: contain;
  display: block;
  margin: 0 auto;
}

.collapse-button {
  margin-top: 15px;
}
</style>