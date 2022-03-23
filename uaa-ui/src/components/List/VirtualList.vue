<template>
  <div class="box" :style="`height:${viewH}px;overflow-y:scroll;`" @scroll="handleScroll">
    <div :style="`height:${scrollH}px;`">
      <ul>
          <li :style="`transform:translateY(${offsetY}px); height:${itemH}px;`" v-for='i in clist' :key="i">{{i}}</li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  props: {
    list: {
      type: Array as PropType<number[]>,
      default: () => {
        return []
      }
    }
  },
  setup(props) {
    // 单项高度
    const itemH = 60
    // 外部box高度
    const viewH = 500
    // 整个滚动列表高度
    const scrollH = computed(() => props.list.length * itemH)
    // 可视化高度一次能装几个列表, 多设置几个防止滚动时候直接替换
    const showNum = computed(() => Math.floor(viewH / itemH) + 4)
    // 页面展示数据
    const clist = ref<number[]>(props.list.slice(0, showNum.value))
    // 最后一次触发的时间标记
    const lastTime = ref(new Date().getTime())
    // 动态偏移量
    const offsetY = ref(0)
    // 监听滚动条执行的方法
    const handleScroll = (e: UIEvent) => {
      if (new Date().getTime() - lastTime.value > 10) {
        const target = e.target as HTMLElement
        const scrollTop = target.scrollTop // 滚去的高度
        // 每一次滚动后根据scrollTop值获取一个可以整除itemH结果进行偏移
        // 例如: 滚动的scrllTop = 1220  1220 % this.itemH = 20  offsetY = 1200
        offsetY.value = scrollTop - (scrollTop % itemH)
        // 上面卷掉了多少，就要往下平移多少，不然showNum滚出可视区外了
        console.log(scrollTop, scrollTop % itemH)
        clist.value = props.list.slice(
          Math.floor(scrollTop / itemH), // 计算卷入了多少条
          Math.floor(scrollTop / itemH) + showNum.value
        )
        lastTime.value = new Date().getTime()
      }
    }
    return {
      itemH,
      viewH,
      clist,
      offsetY,
      scrollH,
      handleScroll
    }
  }
})
</script>
<style scoped lang="scss">
* {
  padding: 0;
  margin: 0;
  list-style: none;
  box-sizing: border-box;
}
li {
  text-align: center;
  line-height: 60px;
  border-bottom: 1px solid red;
}
</style>
