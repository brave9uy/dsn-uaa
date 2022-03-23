
import { getUsersDao, getPermissionsDao, getPermissionDao } from '@/dao/authorize'
import { Order } from '@/types'

export const getUsers = (page: number, size: number, sortColumn: string, orderBy: Order, username: string, enabled: number) => {
  return getUsersDao(page, size, sortColumn, orderBy, username, enabled)
}

export const getPermissions = () => {
  return getPermissionsDao()
}

export const getPermission = (id: number) => {
  return getPermissionDao(id)
}