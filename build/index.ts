import delPath from "./delPath"
import { series, parallel } from "gulp"
import { buildDir, componentsDir } from "./paths"
import { dest, src } from 'gulp'
import gulpSass from 'gulp-sass'
import sass from 'sass'
import run from "./run"
 
export const removeDist = () => {
  return delPath(buildDir)
}

export const buildStyle = () => {
  return src(`${componentsDir}/**/*.scss`).pipe(gulpSass(sass)()).pipe(dest(buildDir))
}

export const buildComponents = () => {
  run('yarn build:components', componentsDir)
}
 
export default series(
  removeDist,
  parallel(
    async () => buildStyle(),
    async () => buildComponents()
  )
)
