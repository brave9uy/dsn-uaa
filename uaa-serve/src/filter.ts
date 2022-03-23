import * as Koa from 'koa'
import * as Router from 'koa-router'

const whitelist = ['/authorize/claimToken']

export const jwtFilter = (ctx: Koa.ParameterizedContext<any, Router.IRouterParamContext<any, {}>>) => {
  if (whitelist.indexOf(ctx.originalUrl) === -1) {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  }
}