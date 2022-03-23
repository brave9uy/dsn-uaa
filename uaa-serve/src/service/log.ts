
import { getLogsDao } from '@/dao/log'

export const getLogs = (page: number, size: number, username: string) => {
  return getLogsDao(page, size, username)
}