<template>
  <div class="admin-footer">
    <div class="footer-right"></div>
    <div class="footer-right">
              <span class="copyright">
                © {{ currentYear }} Code Smell. All rights reserved.
              </span>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.admin-footer {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.03);
}

.footer-right {
  color: #909399;
  font-size: 13px;
}

.copyright {
  opacity: 0.8;
}

</style>