import { defineStore } from 'pinia'
import request from '@/utils/request'
import { joinParamsWithURL } from '@/utils/helper'

export const useAuthorizePermissionStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'authorize-permission',
  actions: {
    async getPermissions(params: { [key: string]: any }) {
      return await request(joinParamsWithURL('/authorize/permission/getPermissions', params)).then((res: any) => Promise.resolve({
        rows: res.data,
        total: res.total
      }))
    }
  }
})
