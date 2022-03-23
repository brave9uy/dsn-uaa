// 树结构配置
export interface ITreeProps {
  // 构造树结构的关键属性的属性名，通常以id进行构造
  keyProp: string;
  // 父节点关键属性属性名
  parentProp: string;
  // 子节点属性名
  childrenProp: string;
  // 根节点的关键属性的值
  rootKey: number;
}

export type PartialITreeProps = Partial<ITreeProps>

export { default as TreeTable } from './TreeTable.vue'

export { default } from './TreeTableKit.vue'
