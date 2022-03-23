import { createRouter, createWebHistory, RouteRecordName, RouteRecordRaw } from 'vue-router'

import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Container from '@/components/Layout/Container.vue'
import Shim from '@/components/Layout/Shim.vue'
import UserProfile from '@/views/authorize/user/profile.vue'

const routes: RouteRecordRaw[] = [
  {
    name: 'Login',
    path: '/login',
    component: Login,
    meta: {
      title: '登录'
    }
  },
  {
    name: 'Root',
    path: '/',
    component: Container,
    children: [
      {
        name: 'Home',
        path: '/',
        component: Home,
        meta: {
          title: '首页'
        }
      },
      {
        name: 'UserProfile',
        path: '/authorize/user/profile',
        component: UserProfile,
        meta: {
          title: '用户详情'
        }
      }
    ]
  }
]

const router = createRouter({
  routes,
  history: createWebHistory()
})

export const asyncRoute: RouteRecordRaw = {
  name: 'Root',
  path: '/',
  component: Container,
  children: [
    {
      name: 'Authorize',
      path: '/authorize',
      component: Shim,
      meta: {
        title: '权限管理'
      },
      children: [
        {
          name: 'AuthorizeUser',
          path: '/authorize/user',
          component: () => import('@/views/authorize/user/index.vue'),
          meta: {
            title: '用户',
            accessible: true
          }
        },
        {
          name: 'AuthorizePermission',
          path: '/authorize/permission',
          component: Shim,
          meta: {
            title: '权限',
            accessible: true
          },
          children: [
            {
              name: 'AuthorizePermissionIndex',
              path: '/authorize/permission',
              component: () => import('@/views/authorize/permission/index.vue'),
              meta: {
                accessible: true
              }
            },
            {
              name: 'AuthorizePermissionCreate',
              path: '/authorize/permission/create',
              component: () => import('@/views/authorize/permission/detail.vue'),
              meta: {
                title: '新增权限',
                accessible: true
              }
            },
            {
              name: 'AuthorizePermissionUpdate',
              path: '/authorize/permission/update/:id',
              component: () => import('@/views/authorize/permission/detail.vue'),
              meta: {
                title: '修改权限',
                accessible: true
              }
            }
          ]
        }
      ]
    },
    {
      name: 'AccessLog',
      path: '/log/access',
      component: Shim,
      meta: {
        title: '访问日志'
      },
      children: [
        {
          name: 'AccessLogIndex',
          path: '/log/access',
          component: () => import('@/views/log/access.vue'),
          meta: {
            accessible: true
          }
        }
      ]
    }
  ]
}

export const addRoute = async (route: RouteRecordRaw): Promise<void> => {
  if (route.name && route.children) {
    route.children.forEach(r => {
      router.addRoute(route.name as RouteRecordName, r)
    })
  }
}

export const resetRouter = (): void => {
  const currRouteNames: RouteRecordName[] = router.getRoutes().map(r => r.name).filter(n => n !== undefined) as RouteRecordName[]
  const defaultRouteNames: RouteRecordName[] = createRouter({
    routes,
    history: createWebHistory()
  }).getRoutes().map(r => r.name).filter(n => n !== undefined) as RouteRecordName[]
  const removeRouteNames = currRouteNames.filter(r => defaultRouteNames.indexOf(r) === -1)
  removeRouteNames.forEach(name => {
    router.removeRoute(name)
  })
}

export default router
