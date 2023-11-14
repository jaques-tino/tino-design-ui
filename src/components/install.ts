import type { App as Application } from 'vue'
import Space from './Space/space.vue'
import Upload from './Upload/upload.vue'
import AdaptiveInput from './AdaptiveInput/adaptive-input.vue'
import AdaptiveTextarea from './AdaptiveTextarea/adaptive-textarea.vue'

const components = [
  Space,
  Upload,
  AdaptiveInput,
  AdaptiveTextarea
]

export default (app: Application) => {
  components.forEach((component) => {
    app.component(component.name, component)
  })
}