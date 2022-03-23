// 排序配置
export interface Sort {
  // 排序的属性
  prop: string | null;
  // 排序的方式
  order: string | null;
}

export interface SortSetting {
  // 排序的属性参数名
  sortProp: string;
  // 排序的方式参数名
  orderProp: string;
  // 顺序方式名称
  ascending: string;
  // 倒叙方式名称
  descending: string;
  // 排序方法
  sortMethod: (sort: Sort) => void
}

export { default } from './Sorter.vue'
