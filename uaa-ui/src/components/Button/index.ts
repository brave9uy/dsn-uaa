import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { Component, defineAsyncComponent } from 'vue'

// 按钮设置
export interface IButton {
  // 按钮名称
  name?: string;
  // 按钮图标
  icon?: string | IconDefinition;
  // 按钮尺寸
  size?: 'small' | 'large' | 'default';
  // 按钮种类
  type?: 'primary' | 'success' | 'info' | 'warning' | 'danger';
  // 是否反色
  plain?: boolean;
  // 点击方法
  click?: (row: any) => (void | ((row: any) => void));
}

interface SimpleIButton {
  // 按钮名称
  name: string;
  // 点击方法
  click: (row: any) => (void | ((row: any) => void));
}

// 根据传入字符串返回按钮设置
export const makeBtn = (name: string): IButton | undefined => {
  if (name === 'add') {
    return {
      name: '添加',
      type: 'primary',
      icon: faPlus
    }
  } else if (name === 'delete') {
    return {
      name: '删除',
      type: 'danger',
      icon: faTrashAlt
    }
  } else {
    return undefined
  }
}

// 根据简单的按钮设置，返回预设的按钮组设置
export const makeBtnGroup = (btns: SimpleIButton[]): IButton[] | undefined => {
  const buttonGroup: IButton[] = []
  for (let i = 0; i < btns.length; i++) {
    const btn: IButton = {
      size: 'small',
      click: btns[i].click
    }
    if (btns[i].name === 'edit') {
      btn.type = 'primary'
      btn.icon = 'solid.edit'
    } else if (btns[i].name === 'delete') {
      btn.type = 'danger'
      btn.icon = 'solid.trash-alt'
    }
    buttonGroup.push(btn)
  }
  return buttonGroup.length > 0 ? buttonGroup : undefined
}

export const btnGroupComponent = (): Component => {
  return defineAsyncComponent(() => import('@/components/Button/ButtonGroup.vue'))
}

export { default as ButtonGroup } from './ButtonGroup.vue'

export { default as Button } from './Button.vue'
