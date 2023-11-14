<script lang="ts" setup>
import { ref } from 'vue'

const files = ref([])
</script>

<template>
  <t-upload
    :limit="10"
    v-model:files="files"
    accept=".mp4, image/*"
    type="card"
    response-type="text"
    url="http://localhost:3000/v1/api/utils/upload"
  />
  <!-- <t-space :size="[20, 30]" :wrapItem="false">
  </t-space> -->
</template>
