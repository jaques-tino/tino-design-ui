<script lang="ts" setup>
import { ref } from 'vue'
const text = ref('（珠海市经济特区）盛诺网络科技有限责任公司')
</script>

<template>
  <div id="#app">
    <t-adaptive-input
      v-model="text"
      typeface="msyh"
      :size="20"
    />
    <t-adaptive-textarea
      v-model="text"
      typeface="msyh"
      :size="12"
    />
  </div>
</template>
