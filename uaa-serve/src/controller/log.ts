import * as Koa from 'koa'
import * as Router from 'koa-router'

import { Controller, Get } from '@/utils/router-decorator'
import { returnSuccess } from '@/types'
import { getLogs } from '@/service/log'

@Controller('/log')
class LogController {

  @Get('/access/getLogs')
  async getLogs(ctx: Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: () => Promise<any>) {
    const page: number = ctx.request.query.page ? Number(ctx.request.query.page) : 1
    const size: number = ctx.request.query.size ? Number(ctx.request.query.size) : 10
    const username = ctx.request.query.username ? ctx.request.query.username as string : undefined
    ctx.response.body = returnSuccess(getLogs(page, size, username))
  }
}

module.exports = LogController