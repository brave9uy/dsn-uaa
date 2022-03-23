export interface IMenu {
  // 菜单名称属性名
  name: string;
  // 菜单index，在router模式下会用做url
  index: string;
  // 菜单图标属性名
  icon: string;
  // 子菜单属性名
  children: string
}

export type PartialIMenu = Partial<IMenu>

export interface PageArgs<P> {
  condition: P;
  page: number;
  size: number;
}

export type PartialPageArgs<P> = Partial<PageArgs<P>>
