import { App } from 'vue'
import AdaptiveInput from './AdaptiveInput/adaptive-input.vue'
import AdaptiveTextarea from './AdaptiveTextarea/adaptive-textarea.vue'

const components = [
  AdaptiveInput,
  AdaptiveTextarea
]

export default (app: App) => {
  components.forEach((component) => {
    app.component(component.name, component)
  })
}