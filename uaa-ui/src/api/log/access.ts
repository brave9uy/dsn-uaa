import { ITabularResult } from '@/components/Table'
import request from '@/utils/request'

export const getLogs = (params: { [key: string]: any }): Promise<ITabularResult> => {
  return request({
    url: '/log/access/getLogs',
    method: 'GET',
    params
  }).then((res: any) => Promise.resolve({
    rows: res.data,
    total: res.total
  }))
}
