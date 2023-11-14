### Tino-Design-UI

这是一个vue3的UI框架，官网在努力制作中。

目前，已经上线的组件已经有四个：`Space`、`AdaptiveInput`、`AdaptiveTextarea`、`Upload`。为了支持更多的功能模块，其中Upload组件仍在升级中。

后续会不断增加好用且实用的组件，拖拽和悬浮组件也已经在后续上传组件完成后陆续追加，劳烦耐心等待！

一、安装
```bash
# npm
npm install tino-design-ui

# yarn
yarn add tino-design-ui
```

二、使用
```js
// 加载所有组件
import UiComponents from 'tino-design-ui'
app.use(UiComponents)

// 按需加载 【推荐】
import { Upload } from 'tino-design-ui'
app.component(Upload.name, Upload)
```
