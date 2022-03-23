import { ref, onMounted, onUnmounted, computed, ComputedRef, Ref } from 'vue'

export const useDocumentWidthObtainment = (dom: undefined | Ref<undefined> | Ref<HTMLElement> = undefined): ComputedRef<number> => {
  const width = ref(0)
  const handler = (): void => {
    if (dom && dom.value) {
      width.value = dom.value.clientWidth
    } else {
      width.value = document.documentElement.clientWidth
    }
  }
  onMounted(() => {
    handler()
    window.addEventListener('resize', handler)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', handler)
  })
  return computed<number>(() => width.value)
}

const useDocumentWidth = (fn: (width: number) => boolean, dom: undefined | Ref<undefined> | Ref<HTMLElement> = undefined): ComputedRef<boolean> => {
  const width = ref(0)
  const handler = (): void => {
    if (dom && dom.value) {
      width.value = dom.value.clientWidth
    } else {
      width.value = document.documentElement.clientWidth
    }
  }
  onMounted(() => {
    handler()
    window.addEventListener('resize', handler)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', handler)
  })
  return computed<boolean>(() => fn(width.value))
}

export default useDocumentWidth
