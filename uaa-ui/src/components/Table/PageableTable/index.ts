// 分页配置
export interface PaginationSetting {
  // 是否启用分页
  pageable: boolean;
  // 每页条数
  pageSize: number;
  // 页码参数名
  pageProp: string;
  // 每页条数参数名
  pageSizeProp: string;
}

export { default as Table } from './Table.vue'
export { default as CardSet } from './CardSet.vue'
export { default as Pagination } from './Pagination.vue'

export { default } from './PageableTable.vue'
