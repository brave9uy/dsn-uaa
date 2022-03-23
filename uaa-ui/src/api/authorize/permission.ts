import { ITabularResult } from '@/components/Table'
import request from '@/utils/request'

export const getPermissions = (params: { [key: string]: any }): Promise<ITabularResult> => {
  return request({
    url: '/authorize/permission/getPermissions',
    method: 'GET',
    params
  }).then((res: any) => Promise.resolve({
    rows: res.data,
    total: res.total
  }))
}

export const getPermission = (id: string): Promise<any> => {
  return request({
    url: `/authorize/permission/getPermission/${id}`,
    method: 'GET'
  })
}
