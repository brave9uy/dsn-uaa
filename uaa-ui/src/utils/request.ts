import useGlobalStore from '@/stores/global'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import Message from '@/utils/message'
import { ElMessageBox } from 'element-plus'
import { getToken } from './cookie'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

service.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const globalStore = useGlobalStore()
  globalStore.useLoading()
  if (config.headers) {
    if (getToken()) {
      config.headers.Authorization = `Bearer ${getToken()}`
    }
  }
  return config
})

service.interceptors.response.use((response: AxiosResponse) => {
  useGlobalStore().endLoading()
  return response.data
}, (e: AxiosError) => {
  useGlobalStore().endLoading()
  if (e.response && e.response.data) {
    if (typeof e.response.data === 'string') {
      Message.error(e.response.data)
    } else {
      let { message } = e.response.data
      if (e.response.data.violations && e.response.data.violations.length > 0) {
        message = e.response.data.violations[0].message
      } else if (e.response.data.detail) {
        message = e.response.data.detail
      }
      const { status } = e.response
      if (status !== 401 || e.request.responseURL.includes('/authorize/claimToken')) {
        Message.error(message)
      } else {
        ElMessageBox.alert(message || '请求失败', 'UnauthorizedAccess', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          location.href = '/'
        }).catch(() => {
          location.href = '/'
        })
      }
    }
  }
  return Promise.reject(e)
})

export interface ResultVO<P> {
  code: number;
  msg: string;
  total: number;
  data: P;
}

export default service
