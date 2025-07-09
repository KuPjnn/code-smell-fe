<template>
  <div class="list-container">
    <el-table :data="categories.content"
              v-loading="isListLoading"
              style="width: 100%;">
      <el-table-column label="Name" prop="name" #default="{row}" min-width="150" fixed>
        <el-tag type="primary" effect="dark">{{ row.name }}</el-tag>
      </el-table-column>
      <el-table-column label="Created Date" prop="createdDate" min-width="120"/>
      <el-table-column label="Created By" prop="createdBy" min-width="120"/>
      <el-table-column label="Updated Date" prop="updatedDate" min-width="120"/>
      <el-table-column label="Updated By" prop="updatedBy" min-width="120"/>
      <el-table-column align="right" min-width="150" fixed="right">
        <template #default="{row}">
          <div class="flex gap-2">
            <router-link :to="`/admin/categories/${row.id}`">
              <el-button size="small"> Edit</el-button>
            </router-link>
            <el-button size="small" type="danger">
              Delete
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
        :total="categories.totalElements">
    </el-pagination>
  </div>
</template>

<script>
import {getCategories} from "@/api/category.js";
import {ElMessage} from "element-plus";

const defaultCategory = {
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
  data() {
    return {
      categories: Object.assign({}, defaultCategory),
      pageRequest: Object.assign({}, defaultPageRequest),
      isListLoading: true,
    }
  },
  created() {
    this.getList(this.pageRequest);
  },
  methods: {
    getList(pageRequest) {
      this.isListLoading = true;
      getCategories(pageRequest).then(result => {
        this.isListLoading = false;
        this.categories = result.data.data;
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
    }
  }
}
</script>

<style scoped>
</style>
