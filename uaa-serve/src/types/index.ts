export interface IResult {
  code: number;
  data: any
  msg: string,
  total: number
}

export enum Order {
  DESC = 'desc',
  ASC = 'asc'
}

export class Page<T> {
  page: number;
  offset: number;
  start: number;
  total: number;
  list: T[];

  static of(page: number, size: number) {
    const p = new Page()
    p.page = page;
    p.offset = size
    p.start = (page - 1) * size
    return p
  }

  paging(list: T[]) {
    this.list = list.filter((o: T, i: number) => i >= this.start && i < this.start + this.offset)
    return this
  }

  withTotal(total: number) {
    this.total = total
    return this
  }
}

export const buildResult = (data: any, code: number) => {
  const result: IResult = {
    code,
    msg: null,
    total: 0,
    data: null
  }
  if (Array.isArray(data)) {
    result.total = data.length
  } else {
    if (typeof data === 'string') {
      result.msg = data
    }
    result.total = 1
    if (data instanceof Page) {
      result.total = data.total
      data = data.list
    }
  }
  result.data = data
  return result
}

export const returnSuccess = <T>(data: T) => {
  return buildResult(data, 200)
}

export interface User {
  id: number;
  username: string;
  mobile: string;
  email: string;
  name: string;
  enabled: number;
}

export interface Permission {
  id: number;
  parent: number;
  authority: string;
  displayName: string;
  icon: string;
  uri: string;
  enabled: number;
  permissions?: Array<Permission>;
}

export interface Log {
  id: number;
  operationName: string;
  username: string;
  operationTime: string;
}