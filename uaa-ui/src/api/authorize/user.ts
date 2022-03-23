import { ITabularResult } from '@/components/Table'
import request from '@/utils/request'

export const getUsers = (params: { [key: string]: any }): Promise<ITabularResult> => {
  return request({
    url: '/authorize/user/getUsers',
    method: 'GET',
    params
  }).then((res: any) => Promise.resolve({
    rows: res.data,
    total: res.total
  }))
}
