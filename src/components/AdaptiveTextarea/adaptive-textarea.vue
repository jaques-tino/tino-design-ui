<script lang="ts" setup>
import css from './adaptive-textarea.module.scss'
import { ref, onMounted, watchEffect, withDefaults, nextTick } from 'vue'

export interface AdaptiveTextarea {
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

const props = withDefaults(defineProps<AdaptiveTextarea>(), {
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
const size = ref(props.size)
const handleKeyup = (event: KeyboardEvent) => {
  const value = (event.target as HTMLInputElement).value
  emits('update:modelValue', value)
}

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')

const getZoom = () => {
  context!.font = `${props.italic ? 'italic' : 'normal'} ${props.weight ? 'bold' : 'normal'} ${props.size}px ${props.typeface}`
  let measureText = context!.measureText(props.modelValue)
  let width = measureText.width
  let height = (measureText.actualBoundingBoxAscent + measureText.actualBoundingBoxDescent) * props.lineHeight
  while(size.value > 0) {
    let row = 1
    if (props.h > height) {
      row = Math.floor(props.h / height)
    }
    
    if ((width / row) <= props.w && (height * row) <= props.h) {
      break
    }
    size.value -= 0.1
    context!.font = `${props.italic ? 'italic' : 'normal'} ${props.weight ? 'bold' : 'normal'} ${size.value}px ${props.typeface}`
    measureText = context!.measureText(props.modelValue)
    width = measureText.width
    height = (measureText.actualBoundingBoxAscent + measureText.actualBoundingBoxDescent) * props.lineHeight
  }
  
  zoom.value = size.value / props.size
  emits('current-zoom', zoom.value)
}

onMounted(getZoom)
watchEffect(() => {
  props.w, props.h, props.italic, props.modelValue, props.size, props.typeface, props.weight, props.lineHeight
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
  </div>
</template>

<script lang="ts">
export default {
  name: 'TAdaptiveTextarea'
}
</script>