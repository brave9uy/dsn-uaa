import { NavigationGuardNext, RouteLocationNormalized, RouteRecordNormalized } from 'vue-router'
import router, { addRoute, asyncRoute } from './router'
import useGlobalStore from './stores/global'
import { getToken } from './utils/cookie'

const whitelist = ['/login'] // no redirect whitelist

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // start progress loading
  const globalStore = useGlobalStore()
  globalStore.useLoading()
  // set page title
  setPageTitle(to)
  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      location.href = '/'
      globalStore.endLoading()
      return false
    } else {
      // dynamically add accessible routes
      await addRoute(asyncRoute)
      if (!to.name) {
        let paramName, param
        const r: RouteRecordNormalized = router.getRoutes().filter(r => {
          if (r.path.includes(':')) {
            const path = r.path.split(':')[0]
            paramName = r.path.split(':')[1]
            param = to.path.split(path)[1]
            return to.path.includes(path) && r.components
          } else {
            return r.path === to.path && r.components
          }
        })[0]
        if (paramName && param) {
          next({ name: r.name, params: { [paramName]: param } })
        } else {
          next(r)
        }
      } else {
        next()
      }
      globalStore.endLoading()
    }
  } else {
    if (whitelist.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
      globalStore.endLoading()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      location.href = '/login'
      globalStore.endLoading()
      return false
    }
  }
})

router.afterEach(() => {
  const globalStore = useGlobalStore()
  globalStore.endLoading()
})

const setPageTitle = (route: RouteLocationNormalized | string): void => {
  if (typeof route === 'string') {
    document.title = route
  } else {
    if (route.meta.title) {
      document.title = route.meta.title as string
    }
  }
}
