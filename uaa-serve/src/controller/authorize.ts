import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as Jwt from 'jsonwebtoken'

import { Controller, Get, Post } from '@/utils/router-decorator'
import { Order, returnSuccess } from '@/types'
import { getUsers, getPermissions, getPermission } from '@/service/authorize'

@Controller('/authorize')
class AuthorizeController {

  // 登录接口，请求token
  @Post('/claimToken')
  async claimToken(ctx: Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: () => Promise<any>) {
    const { username, password } = ctx.request.body
    try {
      if (username !== 'admin' || password !== '123456') {
        ctx.throw(401)
      } else {
        // 1分钟有效
        const accessToken = Jwt.sign(
          { jti: 'dsn', authorities: [], sub: username },
          'dsn',
          { expiresIn: 60 }
        )
        // 2小时有效
        const refreshToken = Jwt.sign(
          { jti: 'dsn', authorities: [], sub: username },
          'dsn',
          { expiresIn: 7200 }
        )
        ctx.response.body = returnSuccess({ accessToken, refreshToken })
      }
    } catch (e) {
      ctx.response.status = e.status
      ctx.response.body = { title: "Unauthorized", status: e.code, detail: '用户名或密码错误' }
    }
  }

  @Get('/logout')
  async logout(ctx: Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: () => Promise<any>) {
    ctx.response.body = returnSuccess('登出成功')
  }

  @Get('/user/getUsers')
  async getUsers(ctx: Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: () => Promise<any>) {
    const page: number = ctx.request.query.page ? Number(ctx.request.query.page) : 1
    const size: number = ctx.request.query.size ? Number(ctx.request.query.size) : 10
    const sortColumn: string = ctx.request.query.sortColumn ? ctx.request.query.sortColumn as string : undefined
    const orderBy: Order = ctx.request.query.orderBy ? ctx.request.query.orderBy as Order : undefined
    const username = ctx.request.query.username ? ctx.request.query.username as string : undefined
    const enabled = ctx.request.query.enabled ? Number(ctx.request.query.enabled) : undefined
    ctx.response.body = returnSuccess(getUsers(page, size, sortColumn, orderBy, username, enabled))
  }

  @Get('/permission/getPermissions')
  async getPermissions(ctx: Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: () => Promise<any>) {
    ctx.response.body = returnSuccess(getPermissions())
  }

  @Get('/permission/getPermission/:id')
  async getPermission(ctx: Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: () => Promise<any>) {
    const id = Number(ctx.params.id)
    ctx.response.body = returnSuccess(getPermission(id))
  }
}

module.exports = AuthorizeController