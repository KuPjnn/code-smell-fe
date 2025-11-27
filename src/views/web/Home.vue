<template>
  <div class="common-layout">
    <el-row :gutter="10">
      <!-- Left spacing column -->
      <el-col :xs="24" :sm="24" :md="2" :lg="4" :xl="4"/>

      <!-- Main content column -->
      <el-col :xs="24" :sm="24" :md="14" :lg="12" :xl="12">
        <router-link v-for="post in posts.content"
                     :key="post.id"
                     :to="`/posts/${post.id}/${encodeURIComponent(post.slug)}`"
                     class="post-link">
          <div class="post-card mb-6">
            <article class="post-item transition-all hover:transform hover:translate-y-[-2px]">
              <!-- Thumbnail -->
              <div class="post-thumbnail flex-shrink-0">
                <img v-lazy="post.thumbnail" :alt="post.title" class="thumbnail-image"/>
              </div>

              <!-- Existing post content -->
              <!-- Post Content -->
              <div class="post-content flex-grow">
                <div class="post-header mb-2">
                  <el-tag size="small" type="success" class="category-tag">
                    {{ post.category.name }}
                  </el-tag>
                  <span class="text-gray-500 text-sm ml-2">
        <el-icon><Calendar/></el-icon>
        {{ formatFromNow(post.updatedDate) }}
      </span>
                </div>
                <h2 class="text-xl font-medium hover:text-primary-500 mb-2">
                  {{ post.title }}
                </h2>
                <div class="post-tags">
                  <el-tag v-for="tag in post.tags"
                          :key="tag.id"
                          size="small"
                          effect="plain"
                          class="mr-2">
                    <el-icon>
                      <CollectionTag/>
                    </el-icon>
                    {{ tag.name }}
                  </el-tag>
                </div>
              </div>
            </article>
          </div>
        </router-link>
      </el-col>

      <!-- Top posts sidebar -->
      <el-col :xs="24" :sm="24" :md="6" :lg="4" :xl="4">
        <div class="post-card mb-6">
          <h3 class="text-lg font-medium mb-4 flex items-center">
            <el-icon class="mr-2">
              <Star/>
            </el-icon>
            Top Posts
          </h3>
          <router-link v-for="(post, index) in topPosts"
                       :key="post.id"
                       :to="`/posts/${post.id}/${encodeURIComponent(post.slug)}`"
                       class="post-link">
            <article class="top-post-item transition-all hover:transform hover:translate-y-[-2px]">
              <div class="top-post-content">
                <h4 class="text-base font-medium hover:text-primary-500">{{ post.title }}</h4>
                <div class="text-sm text-gray-500 mt-2 flex items-center">
                  <el-icon class="mr-1">
                    <Calendar/>
                  </el-icon>
                  {{ formatFromNow(post.updatedDate) }}
                </div>
              </div>
            </article>
          </router-link>
        </div>
      </el-col>

      <!-- Right spacing column -->
      <el-col :xs="24" :sm="24" :md="2" :lg="4" :xl="4"/>
    </el-row>
  </div>
</template>

<script>
import {getPosts} from "@/api/post.js";
import {ElMessage} from "element-plus";
import {Calendar, CollectionTag, Star} from "@element-plus/icons-vue";
import {formatFromNow} from "@/utils/Utils.js";

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
  pageSize: 10,
  sort: "DESC",
}

export default {
  components: {Star, Calendar, CollectionTag},
  created() {
    this.getPosts(this.pageRequest);
    this.getTopPosts();
  },
  data() {
    return {
      posts: Object.assign({}, defaultPostPage),
      pageRequest: Object.assign({}, defaultPageRequest),
      topPosts: []
    }
  },
  methods: {
    formatFromNow,
    getPosts(pageRequest) {
      getPosts(pageRequest).then(result => {
        this.posts = result.data.data;
      }).catch(error => {
        ElMessage.error('Oops!');
      });
    },
    getTopPosts(pageRequest) {
      getPosts(pageRequest).then(result => {
        this.topPosts = result.data.data.content;
      }).catch(error => {
        ElMessage.error('Oops!');
      });
    }
  }
}
</script>

<style scoped>
.post-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.post-card {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.post-item {
  cursor: pointer;
  display: flex;
  align-items: flex-start;
}

.category-tag {
  font-weight: 500;
}

.post-tags {
  margin-top: 8px;
}

.top-post-item {
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.top-post-content {
  flex: 1;
}

.post-thumbnail {
  width: 150px; /* Fixed width */
  max-height: 100px; /* Fixed height */
  overflow: clip;
  border-radius: 5px;
  margin-right: 1rem;
  flex-shrink: 0;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the image fills the space without distortion */
  display: block;
}

.post-content {
  flex-grow: 1;
}

</style>
