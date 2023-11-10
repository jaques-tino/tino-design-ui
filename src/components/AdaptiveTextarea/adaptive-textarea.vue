<script lang="ts" setup>
import css from './adaptive-textarea.module.scss'
import { defineProps, ref, defineEmits, onMounted, watch, withDefaults, nextTick } from 'vue'

export interface AdaptiveInput {
  customClassPrefix?: string
  modelValue?: string
  w?: number
  h?:number
  size?: number
  typeface?: string
  align?: 'left' | 'center' | 'right'
  italic?: boolean
  weight?: boolean
  placeholder?: string
  disabled?: boolean
  textColor?: string
  lineHeight?: number
}

const zoom = ref(1)
const textContainer = ref<HTMLDivElement>()

const props = withDefaults(defineProps<AdaptiveInput>(), {
  customClassPrefix: 't',
  modelValue: '',
  w: 120,
  h: 40,
  size: 14,
  typeface: 'mysh',
  align: 'left',
  italic: false,
  weight: false,
  placeholder: '',
  disabled: false,
  textColor: '#000000',
  lineHeight: 1.5
})

const emits = defineEmits(['update:modelValue', 'current-zoom'])
const classPrefix = ref(props.customClassPrefix)
const handleKeyup = (event: KeyboardEvent) => {
  const value = (event.target as HTMLInputElement).value
  emits('update:modelValue', value)
}

const getZoom = () => {
  // 计算行
  const row = Math.floor(props.h / (props.size * props.lineHeight))
  const myZoom = +(props.w / (textContainer.value!.offsetWidth / row)).toString().split('.').map((chars) => chars[0]).join('.')
  zoom.value = myZoom < 1 ? myZoom : 1
  emits('current-zoom', zoom.value)
}

onMounted(getZoom)
watch(props, () => {
  nextTick(getZoom)
})
</script>

<template>
  <div
    :class="[`${classPrefix}-adaptive-textarea`, css['adaptive-textarea']]"
    :style="{
      width: w + 'px',
      height: h + 'px'
    }"
  >
    <textarea
      :value="modelValue"
      :disabled="disabled"
      :placeholder="placeholder"
      :style="{
        zoom,
        lineHeight,
        textAlign: align,
        color: textColor,
        fontFamily: typeface,
        fontSize: size + 'px',
        fontWeight: weight ? 600 : 400,
        fontStyle: italic ? 'italic' : 'normal'
      }"
      @keyup="handleKeyup"
    />
    <div
      ref="textContainer"
      :class="css['text-container']"
      :style="{
        fontFamily: typeface,
        fontStyle: italic ? 'italic' : 'normal',
        fontSize: size + 'px',
        fontWeight: weight ? 600 : 400,
        lineHeight
      }"
    >
      {{ modelValue }}
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TAdaptiveTextarea'
}
</script>