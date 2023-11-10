import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from "vite-plugin-dts"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: "src/components",
      outDir: 'package',
      //指定使用的tsconfig.json为我们整个项目根目录下,如果不配置,你也可以在components下新建tsconfig.json
      tsconfigPath: "tsconfig.json"
    }),
    {
      name: 'style',
      generateBundle(config, bundle) {
        const keys = Object.keys(bundle);
        for (const key of keys) {
          const bundler: any = bundle[key as any];
          this.emitFile({
            type: "asset",
            fileName: key, //文件名名不变
            source: bundler.code?.replace(/\.scss/g, ".css"),
          });
        }
      }
    }
  ],
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/components/tino-design-ui.ts',
      name: 'tino-design-ui',
      fileName: 'tino-design-ui',
      formats: ['es']
    },
    outDir: 'package',
    rollupOptions: {
      external: ['vue', /\.scss/]
    }
  }
})
