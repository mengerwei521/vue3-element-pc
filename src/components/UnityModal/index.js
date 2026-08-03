import { createVNode, render } from 'vue'

//获取附加到元素
const getAppendToElement = (appendTo, currentInstanceVNodeEl) => {
  let appendToEl
  if (appendTo != undefined) {
    appendToEl = document.body
    if (typeof appendTo === 'string') {
      const selectedEl = document.querySelector(appendTo)
      if (selectedEl) {
        appendToEl = selectedEl
      }
    } else if (appendTo instanceof HTMLElement) {
      appendToEl = appendTo
    }
  } else {
    appendToEl = currentInstanceVNodeEl
  }
  return appendToEl
}
//递归获取provides对象 [递归地收集 Vue 3 组件实例（或类似结构）从自身到根组件路径上所有祖先组件通过 provide 提供的依赖项（]
function getProvides(instance) {
  let provides = instance?.provides || {}
  if (instance?.parent) {
    provides = Object.assign(getProvides(instance.parent), provides) //子组件的 provide 优先 [即子组件的 provide 会覆盖父组件的同名 provide]
  }
  return provides
}
export default function useShowModal() {
  const currentInstance = getCurrentInstance() // 获取当前组件实例  “仅限高阶/内部使用” 的 Composition API 工具函数，不推荐在普通业务代码中使用。
  const provides = getProvides(currentInstance) //provides对象 provide inject 注入数据
  console.log(
    currentInstance.parent.vnode.el,
    currentInstance.vnode.el,
    currentInstance,
    provides,
    'currentInstance1',
  )
  /**
   * options:{
   *  appendTo, //附加到元素 不传则默认添加到当前组件上
   *  modalComponent, //模态框组件
   *  slots: {}, //插槽内容
   *  ...其他属性 //传递给模态框组件的属性
   * }
   * @returns
   */
  function showModal(options) {
    console.log(options, currentInstance, provides, 'optionsoptionsoptions')
    console.log(currentInstance.parent.vnode.el, currentInstance.vnode.el, 'currentInstance2')
    let container = document.createElement('div') //容器

    const isAsync = typeof options.modalComponent === 'function' //判断是否是函数，如果是将其视为异步组件【↓】
    const modalComponent = isAsync
      ? defineAsyncComponent(options.modalComponent)
      : options.modalComponent //组件

    const innerRef = ref() //当前组件的ref

    const props = {}
    for (const key in options) {
      if (!['modalComponent', 'appendTo', 'slots'].includes(key)) props[key] = options[key]
    } //传递给模态框组件的属性
    console.log(props, 'propspropspropsprops')
    const vNode = createVNode({
      setup() {
        const instance = getCurrentInstance() //获取当前组件实例
        if (instance) {
          instance.provides = Object.assign(instance.provides, provides)
        } //因为我们的组件是通过 appendTo挂载的，可能形不成上下级关系，所以需要手动将 provides 传递下去
      },
      render: () => {
        return h(
          modalComponent,
          {
            visible: true,
            ...props,
            ref: innerRef,
            'onUpdate:visible': () => {
              nextTick(() => {
                close()
              })
            },
          },
          options.slots,
        )
      },
    })
    console.log(vNode, container, 'vNodevNodevNodevNode')

    vNode.appContext = currentInstance.appContext // 👈 让 View UI Plus 组件可用
    container.className = 'ivu-root'

    render(vNode, container) //将虚拟 DOM（VNode）挂载到真实 DOM 的核心 API
    getAppendToElement(options.appendTo, currentInstance.vnode.el).appendChild(container) //将容器添加到指定的附加元素中
    function close() {
      render(null, container) //卸载组件
      container.parentNode?.removeChild(container) //移除容器
      container = null //释放内存
    }
    //暴露出组件的ref
    if (!isAsync) {
      return {
        ref: innerRef.value, //暴露ref可以让调用者操作组件
        close: close, //暴露关闭方法
      }
    } else {
      return new Promise((resolve) => {
        watch(
          innerRef,
          () => {
            resolve({
              ref: innerRef.value,
              close: close,
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
