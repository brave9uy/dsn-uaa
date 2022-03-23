import { onUnmounted } from 'vue'

const useDOMCreate = (node: string | HTMLDivElement, appendTarget: HTMLElement | undefined = undefined): void => {
  if (typeof node === 'string') {
    const tmpNode = document.createElement('div')
    tmpNode.id = node
    appendChild(tmpNode, appendTarget)
    onUnmounted(() => {
      removeChild(tmpNode, appendTarget)
    })
  } else if (typeof node === 'object') {
    appendChild(node, appendTarget)
    onUnmounted(() => {
      removeChild(node, appendTarget)
    })
  }
}

const appendChild = (child: HTMLDivElement, target: HTMLElement | undefined) => {
  if (!target) {
    document.body.appendChild(child)
  } else {
    target.appendChild(child)
  }
}

const removeChild = (child: HTMLDivElement, target: HTMLElement | undefined) => {
  if (!target) {
    document.body.removeChild(child)
  } else {
    target.removeChild(child)
  }
}

export default useDOMCreate
