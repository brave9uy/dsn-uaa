import { computed, defineComponent, PropType, useAttrs } from 'vue'

import { IMenu, PartialIMenu } from '@/types/common'
import { FaIcon } from '@/components/Icon'

import styles from '@/assets/css/theme.module.scss'

export default defineComponent({
  name: 'InfMenu',
  components: {
    FaIcon
  },
  props: {
    data: {
      type: Array as PropType<any[]>,
      required: true
    },
    // 默认选中的菜单的index, 可以把id设置成index
    defaultActive: {
      type: String,
      default: ''
    },
    // 是否启用路由模式
    router: {
      type: Boolean,
      default: false
    },
    menuProps: {
      type: Object as PropType<PartialIMenu>
    }
  },
  setup(props) {
    const menuProperties = computed<IMenu>(() => Object.assign({
      name: 'name',
      index: 'index',
      icon: 'icon',
      children: 'children'
    }, props.menuProps))
    // 返回jsx代码
    const renderMenu = (data: any[]): JSX.Element[] => {
      return data.map((item: any) => {
        // 处理sub-menu的插槽
        const slots = {
          title: () => {
            if (item[menuProperties.value.icon]) {
              return <>
                <FaIcon icon={item[menuProperties.value.icon]} class={styles['fa-icon']}/>
                <span>{ item[menuProperties.value.name] }</span>
              </>
            } else {
              return <>
                <span>{ item[menuProperties.value.name] }</span>
              </>
            }
          }
        }
        // 递归渲染children菜单
        if (item[menuProperties.value.children]?.length) {
          return (
            <el-sub-menu index={item[menuProperties.value.index]} v-slots={slots}>
              { renderMenu(item[menuProperties.value.children]) }
            </el-sub-menu>
          )
        }
        // 正常渲染普通菜单
        return (
          <el-menu-item index={item[menuProperties.value.index]}>
            { slots.title() }
          </el-menu-item>
        )
      })
    }
    const attrs = useAttrs()
    return () => {
      return (
        <el-menu
          default-active={props.defaultActive}
          router={props.router}
          { ...attrs }
          class={['el-menu', 'el-menu-infinite']}
        >
          { renderMenu(props.data) }
        </el-menu>
      )
    }
  }
})
