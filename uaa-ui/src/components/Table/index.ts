import { IComponent } from '@/components'

// 表格列设置
export interface IColumn {
  // 表头名称
  label: string;
  // 属性名称
  prop: string;
  // 单元格对齐方式
  align?: 'left' | 'center' | 'right';
  // 单元格宽度
  width?: number;
  // 是否可排序
  sortable?: boolean;
  // 超出了是否直接省略
  showOverflowTooltip?: boolean;
  // 渲染单元格使用的方法，根据行属性渲染的组件和组件属性
  formatter?: (attrs: Record<string, any>) => IComponent | undefined;
  // 是否可展示
  visible?: boolean;
  // 永远可见
  alwaysVisible?: boolean;
  // 用于树形表格多，在视图切换时默认是展示的
  defaultToShow?: boolean;
  // 是否可拖拽
  draggable?: boolean;
}

export class Column implements IColumn {
  public label: string;
  public prop: string;
  public align?: 'left' | 'center' | 'right';
  public width?: number;
  public sortable?: boolean;
  public showOverflowTooltip?: boolean;
  public formatter?: (attrs: Record<string, any>) => IComponent | undefined;
  public visible: boolean;
  public alwaysVisible: boolean;
  public defaultToShow: boolean;
  public draggable: boolean;

  constructor(column: IColumn) {
    this.label = column.label
    this.prop = column.prop
    this.align = column.align
    this.width = column.width
    this.sortable = column.sortable
    this.showOverflowTooltip = column.showOverflowTooltip
    this.formatter = column.formatter
    // 除非设置列默认隐藏，否则默认列是展示的
    if (column.visible === false) {
      this.visible = false
    } else {
      this.visible = true
    }
    if (column.alwaysVisible === true) {
      this.alwaysVisible = true
      this.visible = true
    } else {
      this.alwaysVisible = false
    }
    if (column.defaultToShow === true) {
      this.defaultToShow = true
      this.visible = true
    } else {
      this.defaultToShow = false
    }
    if (column.draggable === false) {
      this.draggable = false
    } else {
      this.draggable = true
    }
  }
}

// 表格列设置
export interface ITabularResult {
  rows: any[];
  total: number;
}

// 通过简单配置初始化表格的列配置
export const initColumns = (columns: IColumn[]): Column[] => {
  return columns.map(column => new Column(column))
}

export { default as Sorter } from './Sorter'
export type { Sort, SortSetting } from './Sorter'
export { default as PageableTable } from './PageableTable'
export type { PaginationSetting } from './PageableTable'
export { default as TreeTable } from './TreeTable'
export { default as ScrollableTable } from './ScrollableTable'
