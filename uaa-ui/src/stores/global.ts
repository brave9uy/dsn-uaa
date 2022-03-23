import { defineStore } from 'pinia'
import { ElLoading } from 'element-plus'
import { LoadingInstance } from 'element-plus/es/components/loading/src/loading'
import { claimToken, logout } from '@/api/authorize'
import { LoginProp } from '@/types/authorize'
import { removeRefreshToken, removeToken, setRefreshToken, setToken } from '@/utils/cookie'
import { resetRouter } from '@/router'

interface GlobalProps {
  loading: any;
  accessToken: string | undefined;
  refreshToken: string | undefined;
}

const useGlobalStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'global',
  // a function that returns a fresh state
  state: (): GlobalProps => ({
    loading: undefined,
    accessToken: undefined,
    refreshToken: undefined
  }),
  actions: {
    useLoading() {
      if (!this.loading) {
        this.loading = ElLoading.service({
          lock: true,
          text: 'Loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      }
      return this.loading
    },
    endLoading() {
      if (this.loading) {
        (this.loading as LoadingInstance).close()
      }
    },
    async claimToken(loginProp: LoginProp) {
      const { data } = await claimToken(loginProp)
      const { accessToken, refreshToken } = data
      if (accessToken && refreshToken) {
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        setToken(accessToken)
        setRefreshToken(refreshToken)
      }
    },
    async logout() {
      await logout()
      this.accessToken = undefined
      this.refreshToken = undefined
      removeToken()
      removeRefreshToken()
      resetRouter()
    }
  }
})

export default useGlobalStore
