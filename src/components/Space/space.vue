<script lang="ts" setup>
import { CSSProperties, ref } from 'vue'
import css from './space.module.scss'

export interface Space {
  /**
   * 自定义类名前缀
   */
  customClassPrefix?: string
  /**
   * 是否存在包裹子元素的容器，false 值只会对支持 flex gap 的浏览器生效
   */
  wrapItem?: boolean
  /**
   * 是否垂直布局
   */
  vertical?: boolean
  /**
   * 为数字时，是水平和垂直间距；为数组时，是 [水平间距, 垂直间距]
   */
  size?: number | [number, number]
  /**
   * 是否为行内元素
   */
  inline?: boolean
  /**
   * 水平排列方式
   */
  justify?: CSSProperties['justify-content']
  /**
   * 垂直排列方式
   */
  align?: CSSProperties['align-items']
  /**
   * 是否溢出换行
   */
  wrap?: boolean
  /**
   * 是否倒叙
   */
  reverse?: boolean
}

const props = withDefaults(defineProps<Space>(), {
  customClassPrefix: 't',
  wrapItem: true,
  vertical: false,
  size: 12,
  inline: false,
  justify: 'flex-start',
  align: 'flex-start',
  wrap: true
})

const classPrefix = ref(props.customClassPrefix)
</script>

<template>
  <div
    :class="[`${classPrefix}-space`, css['space'], vertical ? css['vertical'] : '', inline ? css['inline'] : '', wrap ? css['wrap'] : '', reverse ? css['reverse'] : '']"
    :style="{
      alignItems: align,
      justifyContent: justify,
      gap: wrapItem ? 0 : typeof size === 'number' ? `${size}px` : `${size[0]}px ${size[1]}px`
    }"
  >
    <div
      v-if="wrapItem"
      v-for="(slot, i) in $slots.default!()"
      :key="i"
      :class="[`${classPrefix}-space-item`]"
      :style="{
        margin: typeof size === 'number' ? `0 ${size}px ${size}px 0` : vertical ? `0 ${size[1]}px ${size[0]}px 0` : `0 ${size[0]}px ${size[1]}px 0`
      }"
    >
      <component :is="slot" />
    </div>
    <slot v-else />
  </div>
</template>

<script lang="ts">
export default {
  name: 'TSpace'
}
</script>
