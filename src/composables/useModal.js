// 封装弹框

import { createVNode, render } from "vue";
let modalList = []
function addModal(closeFn) {
  const item = { close: closeFn }
  modalList.push(item)
  return () => {
    // 返回一个移除函数，供 close 内部调用
    const index = modalList.indexOf(item)
    if (index > -1) {
      modalList.splice(index, 1)
    }
  }
}
//全局关闭
export function closeAllModal() {
  // 从后往前关（避免索引错乱），或直接全部调用
  while (modalList.length) {
    const item = modalList.pop()
    try {
      item.close()
    } catch (e) {
      console.warn('Failed to close modal:', e)
    }
  }
}
/**
 * @desc 将组件渲染到那个元素下
 * @param {*} appendTo 想要绑定的元素位置 默认 document.body
 */
const getAppendToElement = (appendTo) => {
  let appendToEl = document.body;
  if (typeof appendTo === 'string') {
    const selectedEl = document.querySelector(appendTo)
    if (selectedEl) {
      appendToEl = selectedEl
    }
  } else if (appendTo instanceof HTMLElement) {
    appendToEl = appendTo
  }
  return appendToEl
}
/**
 * @desc 递归获取provides对象 [递归地收集 Vue 3 组件实例（或类似结构）从自身到根组件路径上所有祖先组件通过 provide 提供的依赖项（]
 * @param {*} instance 当前组件实例
 * @returns
 */
const getProvides = (instance) => {
  let provides = instance?.provides || {}
  if (instance?.parent) {
    provides = Object.assign(getProvides(instance.parent), provides) //子组件的 provide 优先 [即子组件的 provide 会覆盖父组件的同名 provide]
  }
  return provides
}
/**
 * @desc 获取真正属于弹窗组件的 props
 * @param {*} options 传参
 * @returns
 */
const extractProps = (options) => {
  const props = {}
  for (const key in options) {
    if (!['modalComponent', 'appendTo', 'isCustomStyle', 'slots'].includes(key)) props[key] = options[key]
  } //传递给模态框组件的属性
  return props
}

export function useModal() {
  const currentInstance = getCurrentInstance() // 获取当前组件实例  “仅限高阶/内部使用” 的 Composition API 工具函数，不推荐在普通业务代码中使用。
  if (!currentInstance) throw new Error('useModal must be called in setup')
  const provides = getProvides(currentInstance) //provides对象 provide inject 注入数据

  function showModal(options) {
    const isAsync = typeof options.modalComponent === 'function';//判断是否是函数，如果是将其视为异步组件【↓】
    const modalComponent = isAsync
      ? defineAsyncComponent(options.modalComponent)
      : options.modalComponent //组件

    const innerRef = ref() //当前组件的ref
    const props = extractProps(options) //传递给模态框组件的属性

    const component = defineComponent({
      setup() {
        const instance = getCurrentInstance() //获取当前组件实例
        if (instance) {
          instance.provides = Object.assign(instance.provides, provides)
        } //因为我们的组件是通过 appendTo挂载的，可能形不成上下级关系，所以需要手动将 provides 传递下去
        return () =>
          h(
            modalComponent,
            {
              ...props,
              ref: innerRef,
              'onUpdate:visible': () => nextTick(wrappedClose),
            },
            options.slots,
          )
      }
    })
    const vNode = createVNode(component)
    vNode.appContext = currentInstance.appContext // 用于确保虚拟节点（vnode）与其创建上下文共享同一个应用实例（App Context）

    let container = document.createElement('div') //容器

    //样式
    if (options.isCustomStyle === false) {
      container.style.position = 'fixed'
      container.style.top = '0'
      container.style.left = '0'
      container.style.width = '100%'
      container.style.height = '100%'
      container.style.zIndex = '999'
      container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
    }
    //将虚拟 DOM（VNode）挂载到真实 DOM 的核心 API
    render(vNode, container)
    const appendTo = options.appendTo || currentInstance.vnode.el;
    //将容器添加到指定的附加元素中
    getAppendToElement(appendTo).appendChild(container)
    //关闭弹框
    function close() {
      render(null, container) //卸载组件
      container.parentNode?.removeChild(container) //移除容器
      container = null //释放内存
    }

    const removeSelf = addModal(close)
    //确保先执行原逻辑，再触发移除
    const wrappedClose = () => {
      close()
      removeSelf() // 从栈中移除
    }
    //暴露出组件的ref
    if (!isAsync) {
      return {
        ref: innerRef.value, //暴露ref可以让调用者操作组件
        close: wrappedClose, //暴露关闭方法
      }
    } else {
      return new Promise((resolve) => {
        watch(
          innerRef,
          () => {
            resolve({
              ref: innerRef.value,
              close: removeSelf,
            })
          },
          {
            once: true,
          },
        )
      })
    }

  }

  return showModal
}
