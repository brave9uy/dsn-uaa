import { Order, Page, User, Permission } from '@/types'

const users: User[] = require('./data/user.json')
const permissions: Permission[] = require('./data/permission.json')

export const getUsersDao = (page: number, size: number, sortColumn: string, orderBy: Order, username: string, enabled: number): Page<any> => {
  let list = users
  if (sortColumn && orderBy) {
    if (sortColumn === 'id') {
      if (orderBy === Order.ASC) {
        list.sort((a: User, b: User) => {
          if (a.id < b.id) {
            return -1
          } else {
            return 1
          }
        })
      } else if (orderBy === Order.DESC) {
        list.sort((a: User, b: User) => {
          if (a.id < b.id) {
            return 1
          } else {
            return -1
          }
        })
      }
    }
  } else if (orderBy === undefined) {
    list.sort((a: User, b: User) => {
      if (a.id < b.id) {
        return -1
      } else {
        return 1
      }
    })
  }
  if (username !== undefined) {
    list = list.filter(u => u.username.indexOf(username) !== -1)
  }
  if (enabled !== undefined) {
    list = list.filter(u => u.enabled === enabled)
  }
  const p = Page.of(page, size).paging(list).withTotal(list.length)
  return p
}

export const getPermissionsDao = (): Array<Permission> => {
  return permissions
}

export const getPermissionDao = (id: number): Permission => {
  const ps = JSON.parse(JSON.stringify(permissions))
  let permission: Permission
  for (let i = 0; i < permissions.length; i++) {
    const p = permissions[i]
    if (p.id === id && !permission) {
      permission = JSON.parse(JSON.stringify(p))
      permission.permissions = ps
      break
    }
  }
  return permission
}