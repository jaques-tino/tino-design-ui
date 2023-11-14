import App from './App.vue'
import { createApp } from 'vue'
import TinoDesignUI from './components/tino-design-ui'

const app = createApp(App)

app.use(TinoDesignUI)
app.mount('#app')
