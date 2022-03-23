import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'

import { installRouters } from '@/utils/router-install'

const app = new Koa()

app.use(bodyParser())

installRouters(app)

app.listen(3000, () => {
  console.log('App running at: http://localhost:3000/')
})