import { Page, Log } from '@/types'

const logs: Log[] = require('./data/log.json')

export const getLogsDao = (page: number, size: number, username: string): Page<any> => {
  let list = logs
  if (username !== undefined) {
    list = list.filter(u => u.username.indexOf(username) !== -1)
  }
  const p = Page.of(page, size).paging(list).withTotal(list.length)
  return p
}