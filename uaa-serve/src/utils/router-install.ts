import * as path from 'path'
import * as fs from 'fs'
import * as Koa from 'koa'
import * as Router from 'koa-router'
import { IRouterWrapper } from './router-decorator'
import { jwtFilter } from '@/filter'

let controllerPath = path.resolve('src', 'controller')

export const installRouters = (app: Koa<Koa.DefaultState, Koa.DefaultContext>) => {

  // 对于任何请求，app将调用该异步函数处理请求：
  app.use(async (ctx: Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: () => Promise<any>) => {
    jwtFilter(ctx)
    await next();
  })

  const files = fs.readdirSync(controllerPath)  // 加载目录下的所有文件进行遍历
  files.forEach((file) => {
    const filePath = path.resolve(controllerPath, file)
    const controller = require(filePath)
    const routerWrapper = controller.rw as IRouterWrapper
    try {
      app.use(routerWrapper.router.routes())
    } catch (error) {
      console.log(filePath)
    }
  })
}