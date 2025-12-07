<template>
  <div class="list-container">
    <el-table
        :data="weddingInvites.content"
        v-loading="isListLoading"
        style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" #default="{row}" min-width="50">
        <span>{{ row.id }}</span>
      </el-table-column>
      <el-table-column label="Họ tên" prop="fullName" #default="{row}" min-width="120" show-overflow-tooltip>
        <span>{{ row.fullName }}</span>
      </el-table-column>
      <el-table-column label="Tham dự" prop="isInvite" #default="{row}" min-width="120">
        <el-tag type="success" effect="dark" v-if="row.isInvite">Có</el-tag>
        <el-tag type="info" effect="dark" v-else>Không</el-tag>
      </el-table-column>
      <el-table-column label="Số người" prop="attendeesNo" min-width="120"/>
      <el-table-column label="SĐT/Zalo" prop="phone" min-width="120"/>
      <el-table-column label="Lời chúc" prop="wish" min-width="120" show-overflow-tooltip/>
      <el-table-column label="Ngày gửi" prop="createdDate" min-width="120">
        <template #default="{ row }">
          {{ formatDate(row.createdDate) }}
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
        :total="weddingInvites.totalElements">
    </el-pagination>
  </div>
</template>

<script>
import {getInvites} from "@/api/weddingInvite.js";
import {ElMessage} from "element-plus";
import {formatDate} from "@/utils/Utils.js";

const defaultWeddingInvitePage = {
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
  pageSize: 10,
  sort: "DESC",
}

export default {
  components: {},
  data() {
    return {
      weddingInvites: Object.assign({}, defaultWeddingInvitePage),
      pageRequest: Object.assign({}, defaultPageRequest),
      isListLoading: true,
    }
  },
  created() {
    this.getList(this.pageRequest);
  },
  methods: {
    formatDate,
    getList(pageRequest) {
      this.isListLoading = true;
      getInvites(pageRequest).then(result => {
        this.isListLoading = false;
        this.weddingInvites = result.data.data;
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
  }
}
</script>

<style scoped>
</style>
