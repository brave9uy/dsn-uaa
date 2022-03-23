/**
 * / 将数组递归成树
 * @param arr 数组
 * @param key 关键字段的字段名
 * @param parentKey 父节点关键字段的值
 * @param parent 父节点关键字段值的字段名
 * @param children 子节点字段字段名
 * @return {*}
 */
export const arrToTree = (arr: any[],
  parentKey = 0,
  key = 'id',
  parent = 'parent',
  children = 'children'): any => {
  let node: any = { [key]: parentKey }
  // 1. 根据传入id，从数组remove节点，避免遍历时重新计算
  if (parentKey !== 0) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][key] === parentKey) {
        node = arr.splice(i, 1)[0]
        break
      }
    }
  }
  // 2. 遍历剩余的节点，如果有节点的pid跟这个节点的id相等，即为这个节点的子节点
  for (let j = 0; j < arr.length; j++) {
    if (arr[j][key] === undefined) {
      throw new Error(`属性${key}在node中不存在`)
    }
    if (arr[j] === undefined && arr.length > 0) {
      j = 0
    }
    if (arr[j][parent] === node[key]) {
      const n = arrToTree(arr, arr[j][key], key, parent, children)
      if (node[children] === undefined) {
        node[children] = []
      }
      node[children].push(n)
      // 下标变成-1，是因为remove元素后希望重新计算有无子元素
      j = -1
    }
  }
  return node
}

/**
 * 广度优先算法 - 查找
 * 凭借条件找出对应的节点。查找到第一个吻合的节点立即返回。建议用id作为条件
 * @param condition { name: '超级管理员' }
 * @param sourceNode 传入被查找的节点，第一层可以是root.也可以是nodes
 * @return {*}
 */
export const breadthFirstSearch = (condition: Record<string, unknown>, sourceNode: Record<string, unknown> | any[]): Record<string, any> | null => {
  let key = ''
  let value: null | any = null
  let returnNode: null | Record<string, unknown> = null
  for (const k in condition) {
    key = k
    value = condition[k]
  }
  if (key !== null && value !== null) {
    let queue: any[] = []
    if (Object.prototype.toString.call(sourceNode) === '[object Array]') {
      queue = JSON.parse(JSON.stringify(sourceNode))
    } else {
      queue = [JSON.parse(JSON.stringify(sourceNode))]
    }
    while (queue.length > 0) {
      [...queue].forEach(child => {
        queue.shift()
        if (child[key] !== undefined && child[key] === value) {
          returnNode = child
          return false
        }
        child.children && (queue.push(...child.children))
      })
    }
  }
  return returnNode
}

/**
   * 向父方向遍历树，执行方法. Promise保证执行顺序
   * @param sourceNode 整个节点树
   * @param keyProp 关键字段
   * @param parentKey 父节点关键字段值
   * @param func 执行方法
   * @param parent 父节点关键字段值的字段名
   * @param children 子节点字段名
   */
export const breadthFirstExecuteUpwards = (
  sourceNode: Record<string, unknown> | any[],
  keyProp: string,
  parentKey: number | string,
  func: (node: Record<string, any>, resolve: (value: unknown) => void) => void,
  parent = 'parent',
  children = 'children'): void => {
  // 1. 找到父节点
  const node = breadthFirstSearch({ [keyProp]: parentKey }, sourceNode)
  // 2. 父节点执行方法
  let promise: Promise<unknown> | null = null
  if (node && node[children] && Array.isArray(node[children])) {
    if (func !== undefined) {
      promise = new Promise((resolve: (value: unknown) => void) => {
        func(node, resolve)
      })
    }
  }
  // 3. 继续向上遍历
  if (node && node[parent] !== undefined && promise !== null) {
    promise.then(() => {
      breadthFirstExecuteUpwards(sourceNode, keyProp, node[parent], func, parent, children)
    })
  }
}

/**
 * 深度优先算法 - 执行
 */
export const depthFirstExecute = (tree: any[] | any, func: (node: any) => void, children = 'children'): void => {
  if (!Array.isArray(tree)) {
    tree = [tree]
  }
  tree.forEach((node: any) => {
    node[children] && depthFirstExecute(node[children], func, children) // 遍历子树
    func && func(node)
  })
}
