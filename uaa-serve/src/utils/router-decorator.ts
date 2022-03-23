import * as Router from 'koa-router'
const router = new Router()

enum RequestMethod {
  get = 'get',
  post = 'post',
  put = 'put',
  delete = 'delete'
}

export interface IRouterWrapper {
  prefix: string;
  router: Router<any, {}>
}

export const Controller = (url: string) => {
  //对 类 class 进行拦截操作，返回一个函数，该函数实际接受三个参数（拦截目标targer,目标的key，key 的描述）
  return (target: any) => {
    //把路由router 挂载在拦截目标，作为静态属性
    const prefix = url ? url.replace(/\/+$/g, "") : ''
    const rw: IRouterWrapper = {
      prefix,
      router
    }
    target.rw = rw
    //实例化该类 class
    let obj = new target()
    // 获取该实例下的所有实例方法，进行 迭代调用，除了构造函数 和一个前置函数（后面会说得如何实现和作用）
    let actionList = Object.getOwnPropertyDescriptors(target.prototype);
    for (let key in actionList) {
      if (key !== "constructor") {
        var fn = actionList[key].value;
        fn.call(obj, rw);//保证在类中能正确访问this,调用该方法是用call,还有两个参数是 router 和 obj 实例
      }
    }
  }
}

//该装饰函数接受两个参数，请求url 和请求方式
const Request = (option: { url: string; method: RequestMethod }) => {
  //拦截该实例方法，参数三个
  return (target: any, methodName: string, dec: any) => {
    //声明fn 缓存原来的 函数体 dev.value
    let fn = dec.value
    //然后重写该函数，参数两个，在 controller 装饰类的时候自动调用转入的两个参数
    dec.value = (rw: IRouterWrapper, controller: any) => {
      //这里，才是真正调用koa-router 路由的时候
      rw.router[option.method](rw.prefix + option.url, fn)
    }
  }
}

// post 请求
export const Post = (url: string) => {
  return Request({ url, method: RequestMethod.post })
}
//get 请求
export const Get = (url: string) => {
  return Request({ url, method: RequestMethod.get })
}
//PUT 请求
export const Put = (url: string) => {
  return Request({ url, method: RequestMethod.put })
}
//DEL请求
export const Delete = (url: string) => {
  return Request({ url, method: RequestMethod.delete })
}

