import { createApp } from 'vue'
import App from './App.vue'
import TinoDesignUI from '../package/tino-design-ui'

const app = createApp(App)

app.use(TinoDesignUI)
app.mount('#app')
