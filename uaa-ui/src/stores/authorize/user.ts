import { defineStore } from 'pinia'
import request from '@/utils/request'
import { joinParamsWithURL } from '@/utils/helper'

export const useAuthorizeUserStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'authorize-user',
  actions: {
    async getUsers(params: { [key: string]: any }) {
      return await request(joinParamsWithURL('/authorize/user/getUsers', params)).then((res: any) => Promise.resolve({
        rows: res.data,
        total: res.total
      }))
    }
  }
})
