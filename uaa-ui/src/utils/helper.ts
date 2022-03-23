export const arrToObj = <T extends { _id?: string }> (arr: Array<T>): { [key: string]: T } => {
  // reduce是归并，第一个方法有两个参数：prev是之前的结果，current是当前遍历的元素，第二个参数是初始值
  // 在这里初始值就是{}
  return arr.reduce((prev, current) => {
    if (current._id) {
      prev[current._id] = current
    }
    return prev
  }, {} as { [key: string]: T })
}

export const objToArr = <V> (obj: {[key: string]: V}): V[] => {
  return Object.keys(obj).map(key => obj[key])
}

export const camelCaseToSpinalCase = (value:string): string => {
  return value.replace(/([A-Z])/g, '-$1').toLocaleLowerCase()
}

export const spinalCaseToCamelCase = (value:string): string => {
  return value.split('-').reduce((prev, current) => {
    return `${prev}${current.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())}`
  }, '')
}

export const joinParamsWithURL = (url: string, params: Record<string, unknown> | undefined): string => {
  if (!params || Object.keys(params).length === 0) {
    return url
  }
  url += '?'
  for (const key in params) {
    if (params[key]) {
      url += `${key}=${params[key]}&`
    }
  }
  return url.substring(0, url.length - 1)
}

export const scrollElMainToTop = (): void => {
  const elMain: HTMLElement | null = document.querySelector('.el-main')
  if (elMain) {
    elMain.scrollTo(0, 0)
  }
}

// 这里使用debounce防抖处理，防抖的延时时间可以通过自定义指令的参数传过来
export const debounce = (fn: (...args: any) => void, delay: number): (args: any) => void => {
  let timer: any = null
  return (args: any) => {
    const vm = this
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.call(vm, args)
    }, delay)
  }
}

// 节流
export const throttle = (fn: (...args: any) => void, delay: number): (args: any) => void => {
  let lastCall = 0
  return (args: any) => {
    const now = new Date().getTime()
    if (now - lastCall < delay) {
      return
    }
    lastCall = now
    const vm = this
    fn.call(vm, args)
  }
}

export { default as Message } from './message'
