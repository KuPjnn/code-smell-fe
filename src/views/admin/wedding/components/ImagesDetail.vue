<template>
  <el-form
      :inline="false"
      @keydown.enter.prevent
      label-width="auto"
  >
    <template v-for="item in componentImages" :key="item.id">
      <el-form-item :label="item.title">
        <div class="thumbnail-container">
          <el-image
              v-if="item.url"
              :src="item.url"
              class="thumbnail-preview"
              fit="cover"
              @click="openMinIoDialog(item)"
          />
          <el-button @click="openMinIoDialog(item)">
            <el-icon>
              <PictureFilled/>
            </el-icon>
          </el-button>
        </div>
      </el-form-item>
    </template>
    <el-form-item label="Gallery Images">
      <el-button @click="addNewGalleryImage">
        <el-icon>
          <Plus/>
        </el-icon>
      </el-button>
      <el-button type="primary" @click="updateGalleryImages">
        Save
      </el-button>
    </el-form-item>
  </el-form>
  <div class="gallery-section">
    <Draggable
        v-model="galleryImages"
        tag="div"
        class="gallery-grid"
        item-key="id"
        @end="onDragEnd"
    >
      <template #item="{ element }">
        <div class="gallery-item">
          <el-image
              v-if="element.url"
              :src="element.url"
              class="gallery-thumbnail"
              fit="cover"
          />
          <div class="gallery-order">{{ element.orders }}</div>
          <div class="gallery-actions">
            <el-button
                circle
                size="small"
                type="danger"
                @click.stop="removeGalleryImage(element)"
            >
              <el-icon>
                <Delete/>
              </el-icon>
            </el-button>
          </div>
        </div>
      </template>
    </Draggable>
  </div>

  <!-- Dialog show for Thumbnail -->
  <el-dialog v-model="isShowMinio" width="80%">
    <Minio
        :selectable="true"
        @select="handleImageSelect"
        @cancel="isShowMinio = false"
    />
  </el-dialog>
</template>

<script>
import {hideLoading, showLoading} from "@/utils/LoadingService.js";
import {getComponentImages, updateComponentImage} from "@/api/weddingComponentImages.js";
import {deleteGalleryImage, getGalleryImages, saveAllGalleryImages} from "@/api/weddingGalleryImages.js";
import {ElMessage} from "element-plus";
import {Delete, PictureFilled, Plus, Search} from "@element-plus/icons-vue";
import Minio from "@/components/Minio.vue";
import Draggable from 'vuedraggable';
import {updatePost} from "@/api/post.js";

const defaultPageRequest = {
  pageNum: 1,
  pageSize: 25,
  sort: "ASC",
  sortField: "orders"
}

export default {
  components: {
    Delete,
    Plus,
    PictureFilled,
    Search,
    Minio,
    Draggable
  },
  data() {
    return {
      componentImages: [],
      galleryImages: [],
      pageRequest: Object.assign({}, defaultPageRequest),
      selectedItem: null,
      isShowMinio: false,
      isAddingGalleryImage: false,
    }
  },
  created() {
    showLoading();
    this.getComponentImages();
    this.getGalleryImages();
    hideLoading();
  },
  methods: {
    getComponentImages() {
      getComponentImages(this.pageRequest).then(result => {
        this.componentImages = result.data.data.content;
      }).catch(error => {
        console.log(error);
        ElMessage.error("Oops!");
      })
    },
    getGalleryImages() {
      getGalleryImages(this.pageRequest).then(result => {
        this.galleryImages = result.data.data.content;
      }).catch(error => {
        console.log(error);
        ElMessage.error("Oops!");
      })
    },
    openMinIoDialog(component) {
      this.selectedItem = component;
      this.isShowMinio = true;
    },
    handleImageSelect(file) {
      if (this.selectedItem) {
        this.selectedItem.url = file.url;
        this.updateComponentImage(this.selectedItem);
        this.selectedItem = null;
      } else if (this.isAddingGalleryImage) {
        const newImage = {
          url: file.url,
          title: file.name,
          orders: this.galleryImages.length + 1,
        };
        this.galleryImages.push(newImage);
        this.isAddingGalleryImage = false;
      }
      this.isShowMinio = false;
    },
    addNewGalleryImage() {
      this.isAddingGalleryImage = true;
      this.isShowMinio = true;
    },
    onDragEnd() {
      this.galleryImages.forEach((item, index) => {
        item.orders = index + 1;
      });
    },
    updateComponentImage(data) {
      updateComponentImage(data).then(result => {
        ElMessage.success(result.data.message);
      }).catch(error => {
        console.log(error);
        ElMessage.error("Oops!");
      });
    },
    updateGalleryImages() {
      saveAllGalleryImages(this.galleryImages).then(result => {
        this.galleryImages = result.data.data;
        ElMessage.success(result.data.message);
      }).catch(error => {
        console.log(error);
        ElMessage.error("Oops!");
      });
    },
    removeGalleryImage(image) {
      this.$confirm('Are you sure you want to delete this image?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        const index = this.galleryImages.indexOf(image)
        if (index > -1) {
          if (image.id) {
            deleteGalleryImage([image.id]).then(result => {
              ElMessage.success(result.data.message);
            });
          }
          this.galleryImages.splice(index, 1);
          this.onDragEnd();
        }
      }).catch(error => {
        console.log(error);
        ElMessage.info('Deletion canceled')
      })
    }
  },
}
</script>

<style scoped>
.thumbnail-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.thumbnail-preview {
  width: 130px;
  height: 130px;
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

/*DRAG*/
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
}

.gallery-item {
  position: relative;
  cursor: move;
  border: 2px solid #dcdfe6;
  border-radius: 8px;
  padding: 5px;
  transition: all 0.3s ease;
}

.gallery-item:hover {
  border-color: #409eff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.gallery-item:hover .gallery-actions {
  opacity: 1;
}

.gallery-thumbnail {
  width: 100%;
  height: 120px;
  border-radius: 4px;
}

.gallery-order {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #409eff;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.gallery-actions {
  position: absolute;
  top: 5px;
  left: 5px;
  opacity: 0;
  transition: opacity .5s ease;
}
</style>
