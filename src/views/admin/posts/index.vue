<template>
  <div class="list-container">
    <el-table
        :data="posts.content"
        v-loading="isListLoading"
        style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" #default="{row}" min-width="50">
        <span>{{ row.id }}</span>
      </el-table-column>
      <el-table-column label="Title" prop="title" #default="{row}" min-width="150">
        <span>{{ row.title }}</span>
      </el-table-column>
      <el-table-column label="Slug" prop="slug" min-width="120"/>
      <el-table-column label="Category" prop="category.name" min-width="120"/>
      <el-table-column label="#Tags" min-width="120">
        <template #default="{ row }">
          <span>{{ row.tags.map(tag => '#'.concat(tag.name)).join(', ') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" #default="{row}" prop="status" min-width="120">
        <el-tag type="info" effect="dark" v-if="row.status === postStatus.DRAFT">Draft</el-tag>
        <el-tag type="primary" effect="dark" v-else-if="row.status === postStatus.PUBLISHED">Published</el-tag>
        <el-tag type="danger" effect="dark" v-else-if="row.status === postStatus.ARCHIVED">Archived</el-tag>
      </el-table-column>
      <el-table-column label="Created Date" prop="createdDate" min-width="120">
        <template #default="{ row }">
          {{ formatDate(row.createdDate) }}
        </template>
      </el-table-column>
      <el-table-column label="Created By" prop="createdBy" min-width="120"/>
      <el-table-column label="Updated Date" prop="updatedDate" min-width="120">
        <template #default="{ row }">
          {{ formatDate(row.updatedDate) }}
        </template>
      </el-table-column>
      <el-table-column label="Updated By" prop="updatedBy" min-width="120"/>
      <el-table-column align="right" min-width="150" fixed="right">
        <template #default="{row}">
          <div class="flex gap-2">
            <router-link :to="`/admin/posts/${row.id}`">
              <el-button size="small"> Edit</el-button>
            </router-link>
            <el-button size="small" type="primary" @click="handleOpenDrawer(row.id)">
              Preview
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="pagination-container">
    <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="pageRequest.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="pageRequest.pageNum"
        :total="posts.totalElements">
    </el-pagination>
  </div>

  <el-drawer
      v-model="drawer.visible"
      :title="drawer.title"
      :direction="drawer.direction"
      :size="800"
  >
    <MdCatalog
        :editorId="drawer.id"
        :scrollElement="drawer.scrollElement"
    />
    <el-divider/>
    <MdPreview
        :id="drawer.id"
        :modelValue="drawer.body"
        :language="'en-US'"
    />
  </el-drawer>
</template>

<script>
import {getPosts} from "@/api/post.js";
import {postStatus} from "@/utils/PostStatus.js";
import {ElMessage} from "element-plus";
import {MdPreview, MdCatalog} from "md-editor-v3";
import 'md-editor-v3/lib/preview.css';
import {formatDate} from "@/utils/Utils.js";

const defaultPostPage = {
  content: [],
  first: false,
  last: false,
  number: 0,
  numberOfElements: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
}

const defaultPageRequest = {
  pageNum: 1,
  pageSize: 5,
  sort: "DESC",
}

export default {
  components: {
    MdPreview, MdCatalog
  },
  data() {
    return {
      posts: Object.assign({}, defaultPostPage),
      pageRequest: Object.assign({}, defaultPageRequest),
      postStatus: Object.assign({}, postStatus),
      isListLoading: true,
      drawer: {
        visible: false,
        direction: 'rtl',
        id: 'preview-only',
        title: '',
        body: '',
        scroll: document.documentElement,
      }
    }
  },
  created() {
    this.getList(this.pageRequest);
  },
  methods: {
    formatDate,
    getList(pageRequest) {
      this.isListLoading = true;
      getPosts(pageRequest).then(result => {
        this.isListLoading = false;
        this.posts = result.data.data;
      }).catch(error => {
        this.isListLoading = false;
        console.log(error);
        ElMessage.error('Oops!');
      });
    },
    handleSizeChange(val) {
      this.pageRequest.pageNum = 1;
      this.pageRequest.pageSize = val;
      this.getList(this.pageRequest);
    },
    handleCurrentChange(val) {
      this.pageRequest.pageNum = val;
      this.getList(this.pageRequest);
    },
    handleOpenDrawer(id) {
      this.drawer.visible = true;
      this.posts.content.map(post => {
        if (post.id === id) {
          this.drawer.title = post.title;
          this.drawer.body = post.content;
        }
      });
    }
  }
}
</script>

<style scoped>
</style>
