<script lang="ts" setup>
import Crypto from 'crypto-js'
import css from './upload.module.scss'
import { UploadFileStatu } from '../types'
import { ref, withDefaults, onMounted } from 'vue'

export interface UploadFile {
  id: string
  raw: File
  url?: string
  name: string
  size: number
  percentage: number
  status: UploadFileStatu
}

export interface ResponseSuccess<T = unknown> {
  data: T
  code: number
  status: boolean
  headers?: Headers
}

export interface ResponseError {
  code: number
  status: boolean
  errmsg?: string
}

export interface Upload {
  /**
   * 自定义类名前缀
   */
  customClassPrefix?: string
  /**
   * 限制上传的文件数量
   */
  limit?: number
  /**
   * 上传之前的钩子函数
   */
  beforeUpload?: (files: FileList) => boolean
  /**
   * 上传地址
   */
  url?: string
  /**
   * 自定义上传
   */
  customRequest?: () => void
  /**
   * 文件列表
   */
  files: UploadFile[]
  /**
   * 上传的字段名
   */
  name?: string
  /**
   * 上传按钮以何种形式展示
   */
  type?: 'button' | 'card'
  /**
   * 限制上传的文件格式
   */
   accept?: string
   /**
    * 是否允许拖拽上传，仅在type值为card时有效
    */
   draggable?: boolean
   /**
   * 是否显示文件列表
   */
  showFileList?: boolean
}

const Card = ref<HTMLDivElement>()
const Upload = ref<HTMLInputElement>()
const emits = defineEmits<{
  /**
   * 检验文件不通过时触发
   */
   'check-failure': [reason: 'size' | 'format']
  /**
   * 文件上传失败时触发
   */
   'upload-Error': [response: ResponseError]
  /**
   * 上传文件成功时触发
   */
   'upload-success': [response: ResponseSuccess]
  /**
   * 更新文件列表
   */
  'update:files': [files: UploadFile[]]
}>()

const props = withDefaults(defineProps<Upload>(), {
  customClassPrefix: 't',
  name: 'file',
  type: 'button',
  draggable: true,
  accept: '*',
  beforeUpload: () => true,
  showFileList: true
})

const tempFiles = ref(props.files)
const classPrefix = ref(props.customClassPrefix)

const upload = async () => {
  if (props.url) {
    let i = 0
    for (const file of tempFiles.value) {
      if (file.status === UploadFileStatu.READY) {
        file.status = UploadFileStatu.UPLOADING
        emits('update:files', tempFiles.value)
        const formData = new FormData()
        formData.append('file', file.raw)
        try {
          const http = new XMLHttpRequest()
          http.open('post', props.url, true)
          http.onreadystatechange = () => {
            // 请求成功完成，并且响应状态码为 200
            if (http.readyState === 4 && http.status === 200) {
              emits('upload-success', { code: 200, status: true, data: http.response })
              file.status = UploadFileStatu.SUCCESS
              emits('update:files', tempFiles.value)
            }
            // 请求失败
            else if (http.readyState === 4 && http.status !== 200) {
              emits('upload-Error', { status: false, code: http.status, errmsg: http.statusText })
              file.status = UploadFileStatu.DANGER
              emits('update:files', tempFiles.value)
            }
          }
          http.upload.onprogress = (event) => {
            file.percentage = Math.round((event.loaded / event.total) * 100)
            emits('update:files', tempFiles.value)
          }
          http.send(formData)
        } catch(err) {
          emits('upload-Error', { status: false, code: (err as any).response.status, errmsg: (err as any).response.statusText })
          file.status = UploadFileStatu.DANGER
          emits('update:files', tempFiles.value)
        }
        continue
      }
      i ++
    }
    return
  }
  if (props.customRequest) {
    props.customRequest()
    return
  }
  throw new Error('At least one of the terms url and customRequest have a value')
}

const handleUpload = () => {
  Upload.value!.click()
}

const validateFiles = (files: FileList, event?: Event) => {
  if (props.limit && files.length > props.limit) {
    emits('check-failure', 'size')
    event?.preventDefault()
    return false
  }
  const bool = props.beforeUpload(files)
  if (!bool) {
    return false
  }
  const isAccept = Array.from(files).every((file) => checkFileType(file.type))
  if (!isAccept) {
    event?.preventDefault()
    emits('check-failure', 'format')
    return false
  }
  return true
}

const uploadChange = (event: Event) => {
  const files = (event.target as any).files as FileList
  if (files && validateFiles(files, event)) {
    const currentFiles = Array.from(files).map((file) => {
      return {
        raw: file,
        size: file.size,
        percentage: 0,
        name: file.name,
        status: UploadFileStatu.READY,
        url: URL.createObjectURL(file),
        id: Crypto.MD5(Date.now().toString()).toString()
      }
    })
    tempFiles.value = [...tempFiles.value, ...currentFiles]
    emits('update:files', tempFiles.value)
    // 上传文件
    upload()
  }
}

const checkFileType = (t: string) => {
  const fileTypes = [
    { extension: '.aac', type: 'audio/aac' },
    { extension: '.abw', type: 'application/x-abiword' },
    { extension: '.arc', type: 'application/x-freearc' },
    { extension: '.avif', type: 'image/avif' },
    { extension: '.avi', type: 'video/x-msvideo' },
    { extension: '.azw', type: 'application/vnd.amazon.ebook' },
    { extension: '.bin', type: 'application/octet-stream' },
    { extension: '.bmp', type: 'image/bmp' },
    { extension: '.bz', type: 'application/x-bzip' },
    { extension: '.bz2', type: 'application/x-bzip2' },
    { extension: '.cda', type: 'application/x-cdf' },
    { extension: '.csh', type: 'application/x-csh' },
    { extension: '.css', type: 'text/css' },
    { extension: '.csv', type: 'text/csv' },
    { extension: '.doc', type: 'application/msword' },
    { extension: '.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    { extension: '.eot', type: 'application/vnd.ms-fontobject' },
    { extension: '.epub', type: 'application/epub+zip' },
    { extension: '.gz', type: 'application/gzip' },
    { extension: '.gif', type: 'image/gif' },
    { extension: '.htm', type: 'text/html' },
    { extension: '.html', type: 'text/html' },
    { extension: '.ico', type: 'image/vnd.microsoft.icon' },
    { extension: '.ics', type: 'text/calendar' },
    { extension: '.jar', type: 'application/java-archive' },
    { extension: '.jpeg', type: 'image/jpeg' },
    { extension: '.jpg', type: 'image/jpeg' },
    { extension: '.js', type: 'text/javascript' },
    { extension: '.json', type: 'application/json' },
    { extension: '.jsonld', type: 'application/ld+json' },
    { extension: '.mid', type: 'audio/midi, audio/x-midi' },
    { extension: '.midi', type: 'audio/midi, audio/x-midi' },
    { extension: '.mjs', type: 'text/javascript' },
    { extension: '.mp3', type: 'audio/mpeg' },
    { extension: '.mp4', type: 'video/mp4' },
    { extension: '.mpeg', type: 'video/mpeg' },
    { extension: '.mpkg', type: 'application/vnd.apple.installer+xml' },
    { extension: '.odp', type: 'application/vnd.oasis.opendocument.presentation' },
    { extension: '.ods', type: 'application/vnd.oasis.opendocument.spreadsheet' },
    { extension: '.odt', type: 'application/vnd.oasis.opendocument.text' },
    { extension: '.oga', type: 'audio/ogg' },
    { extension: '.ogv', type: 'video/ogg' },
    { extension: '.ogx', type: 'application/ogg' },
    { extension: '.opus', type: 'audio/opus' },
    { extension: '.otf', type: 'font/otf' },
    { extension: '.png', type: 'image/png' },
    { extension: '.pdf', type: 'application/pdf' },
    { extension: '.php', type: 'application/x-httpd-php' },
    { extension: '.ppt', type: 'application/vnd.ms-powerpoint' },
    { extension: '.pptx', type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
    { extension: '.rar', type: 'application/vnd.rar' },
    { extension: '.rtf', type: 'application/rtf' },
    { extension: '.sh', type: 'application/x-sh' },
    { extension: '.svg', type: 'image/svg+xml' },
    { extension: '.tar', type: 'application/x-tar' },
    { extension: '.tif', type: 'image/tiff' },
    { extension: '.tiff', type: 'image/tiff' },
    { extension: '.ts', type: 'video/mp2t' },
    { extension: '.ttf', type: 'font/ttf' },
    { extension: '.txt', type: 'text/plain' },
    { extension: '.vsd', type: 'application/vnd.visio' },
    { extension: '.wav', type: 'audio/wav' },
    { extension: '.weba', type: 'audio/webm' },
    { extension: '.webm', type: 'video/webm' },
    { extension: '.webp', type: 'image/webp' },
    { extension: '.woff', type: 'font/woff' },
    { extension: '.woff2', type: 'font/woff2' },
    { extension: '.xhtml', type: 'application/xhtml+xml' },
    { extension: '.xls', type: 'application/vnd.ms-excel' },
    { extension: '.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    { extension: '.xml', type: 'application/xml' },
    { extension: '.xul', type: 'application/vnd.mozilla.xul+xml' },
    { extension: '.zip', type: 'application/zip' },
    { extension: '.3gp', type: 'video/3gpp; audio/3gpp' },
    { extension: '.3g2', type: 'video/3gpp2; audio/3gpp2' },
    { extension: '.7z', type: 'application/x-7z-compressed' }
  ]
  const types: string[] = []
  const accept = props.accept.split(',').map((a) => a.trim())
  accept.forEach((a) => {
    if (a === '*') {
      types.push(...fileTypes.map((fileType) => fileType.type))
      return
    }
    if (a.includes('*')) {
      types.push(...fileTypes.filter((fileType) => fileType.type.includes(a.replace('/*', ''))).map((fileType) => fileType.type))
      return
    }
    const fileType = fileTypes.find(({ extension }) => a === extension)
    if (fileType) {
      types.push(fileType.type)
    } else {
      types.push(a)
    }
  })
  return types.includes(t)
}

onMounted(() => {
  if (props.type === 'card' && props.draggable) {
    Card.value!.addEventListener('dragover', (e) => {
      e.preventDefault()
      Card.value!.classList.add(css['dragover'])
      Card.value!.getElementsByTagName('span')[1].textContent = '松开即可上传文件'
    })
  
    Card.value!.addEventListener('dragleave', () => {
      Card.value!.classList.remove(css['dragover'])
      Card.value!.getElementsByTagName('span')[1].textContent = '点击/拖拽文件到此处上传'
    })
  
    Card.value!.addEventListener('drop', (e) => {
      e.preventDefault();
      Card.value!.classList.remove(css['dragover'])
      Card.value!.getElementsByTagName('span')[1].textContent = '点击/拖拽文件到此处上传'
      const files = e.dataTransfer?.files
      if (files && validateFiles(files)) {
        const currentFiles = Array.from(files).map((file) => {
          return {
            raw: file,
            size: file.size,
            percentage: 0,
            name: file.name,
            status: UploadFileStatu.READY,
            url: URL.createObjectURL(file),
            id: Crypto.MD5(Date.now().toString()).toString()
          }
        })
        tempFiles.value = [...tempFiles.value, ...currentFiles]
        emits('update:files', tempFiles.value)
        // 上传文件
        upload()
      }
    })
  }
})
</script>

<template>
  <div :class="[`${classPrefix}-upload`, css['upload']]">
    <div v-show="!limit || (files.length < limit)" :class="['t-inline-flex', css['container']]" @click="handleUpload">
      <slot>
        <button
          v-if="type === 'button'"
          class="t-flex t-flex-row t-col-center"
        >
          <span class="t-icon t-icon-upload t-mr-5" />
          <span>点击上传</span>
        </button>
        <div
          v-else
          ref="Card"
          :class="[css['card'], 't-flex', 't-flex-col', 't-flex-center']"
        >
          <span class="t-icon t-icon-upload-card t-mb-12" />
          <span>点击/拖拽文件到此处上传</span>
        </div>
      </slot>
    </div>
    <div v-if="showFileList" :class="css['file-list']">
      <div
        v-for="file of files"
        :key="file.id"
        class="t-flex t-flex-col"
      >
        <div class="t-flex t-flex-row t-col-center">
          <span class="t-icon t-icon-file t-mr-5" style="font-size: 14px" />
          <span :class="css['name']">{{ file.name }}</span>
        </div>
        <div :class="css['progress']">
          <div :class="css['progress-bar']">
            <div :class="css['progress-graph-line-indicator']" :style="{ width: `${file.percentage}%`, backgroundColor: file.percentage === 100 ? '#00b42a' : '#2080f0' }"></div>
          </div>
        </div>
      </div>
    </div>
    <input
      type="file"
      ref="Upload"
      style="display: none;"
      :multiple="!limit || limit > 1"
      @change="uploadChange"
    >
  </div>
</template>

<script lang="ts">
export default {
  name: 'TUpload'
}
</script>
