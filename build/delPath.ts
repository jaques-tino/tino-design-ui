import fs from 'fs'
import { resolve } from 'path'
import { buildDir } from './paths'

// 保留的文件
const stayFile = ['package.json', 'README.md']
const delPath = async (path: string) => {
  let files: string[] = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach(async (file) => {
      let curPath = resolve(path, file)
      if (fs.statSync(curPath).isDirectory()) {
        if (file != "node_modules") await delPath(curPath)
      } else {
        if (!stayFile.includes(file)) {
          fs.unlinkSync(curPath)
        }
      }
    })
    if (path != `${buildDir}`) fs.rmdirSync(path)
  }
}
export default delPath