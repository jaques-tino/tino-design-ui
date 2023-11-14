<script lang="ts" setup>
import css from './adaptive-input.module.scss'
import { ref, onMounted, watchEffect, withDefaults, nextTick } from 'vue'

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
}

const zoom = ref(1)
const emits = defineEmits(['update:modelValue', 'current-zoom'])

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
  textColor: '#000000'
})

const classPrefix = ref(props.customClassPrefix)
const handleKeyup = (event: KeyboardEvent) => {
  const value = (event.target as HTMLInputElement).value
  emits('update:modelValue', value)
}

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')

const getZoom = () => {
  context!.font = `${props.italic ? 'italic' : 'normal'} ${props.weight ? 'bold' : 'normal'} ${props.size}px ${props.typeface}`
  const width = context!.measureText(props.modelValue).width
  const offset = props.italic ? 2 : 0
  const myZoom = (props.w - offset) / width
  zoom.value = myZoom < 1 ? myZoom : 1
  emits('current-zoom', zoom.value)
}

onMounted(getZoom)
watchEffect(() => {
  props.w, props.h, props.italic, props.modelValue, props.size, props.typeface, props.weight
  nextTick(getZoom)
})
</script>

<template>
  <div
    :class="[`${classPrefix}-adaptive-input`, css['adaptive-input']]"
    :style="{
      width: w + 'px',
      height: h + 'px'
    }"
  >
    <input
      :value="modelValue"
      :disabled="disabled"
      :placeholder="placeholder"
      :style="{
        zoom,
        textAlign: align,
        color: textColor,
        fontSize: size + 'px',
        fontFamily: typeface,
        fontWeight: weight ? 600 : 400,
        fontStyle: italic ? 'italic' : 'normal'
      }"
      @keyup="handleKeyup"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'TAdaptiveInput'
}
</script>
