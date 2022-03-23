import { LoginProp } from '@/types/authorize'
import request from '@/utils/request'

export const claimToken = (loginProp: LoginProp) => {
  return request({
    url: '/authorize/claimToken',
    method: 'POST',
    data: loginProp
  })
}

export const logout = () => {
  return request({
    url: '/authorize/logout',
    method: 'GET'
  })
}
