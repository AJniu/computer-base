// 渲染器：
//  功能：执行渲染任务，将vnode渲染为真实dom。（渲染器将虚拟dom渲染为真实dom的过程叫做挂载）

// render函数执行流程：
// 1.当首次调用render函数时，只需创建新的dom元素，这个过程只涉及挂载。
// 2.当再次或多次调用render函数时，渲染器除了要执行挂载外，还要执行更新操作，如下：

// const { render } = createRenderer();
// const container = document.getElementById('app');
// // 首次渲染
// render(oldVNode, container);
// // 再次或多次渲染
// render(newVNode, container);

// 如上所示：当再次调用render函数时，会使用 newVNode 与 oldVNode 进行比较，找到变更新变更点。
// 这个过程叫做“打补丁”（更新或patch）。

// 1. 定义创建渲染器函数(通过向createRenderer传递配置项，可以实现跨平台（mount不依赖DOM）的渲染器)
function createRenderer() {
  // 定义挂载元素函数
  function mountElement(vnode, container) {
    // 创建dom元素
    const el = document.createElement(vnode.type);
    // 处理属性,属性有一些注意事项：
    // 1. HTML Attributes 和 DOM Properties是不同的,可以简单概括为：
    //  1.1: 核心原则：HTML Attributes 的作用是 设置与之对应的 DOM Properties 的初始值。
    //  即HTML Attributes 获得的一般是初始值，而DOM Properties 获取的是属性的当前值。
    //  1.2：HTML Attributes 的一个属性可能对应 DOM Properties 的多个属性。（如html 的 value,与 el.value 和 el.defaultValue都有关联）
    //  1.3：HTML Attributes 的属性名与 DOM Properties 的属性名可能不同（如class 和 DOM的className）。
    //  1.4：HTML Attributes 中有的属性DOM Properties 不存在。DOM Properties中某些属性 即HTML Attributes也不存在。

    // 为解决这些问题，vue做了以下处理：
    if (vnode.props) {
      for (const key in vnode.props) {
        // 1.优先设置DOM Properties，判断key是否在el上
        // 注：还有一些只读属性（如form等）需要直接用setAttribute设置，这里不做考虑
        if (key in el) {
          // 获取该 DOM Properties 的类型
          const type = typeof el[key];
          // 获取props传值
          const value = vnode.props[key];
          if (type === 'boolean' && value === '') {
            // 当type为布尔类型且value是空字符串，则矫正为true
            el[key] = true;
          } else {
            el[key] = value;
          }
        } else {
          // 2.如果key 在 DOM Properties 不存在，则使用 setAttribute 将属性设置到元素上
          el.setAttribute(key, vnode.props[key]);
        }
      }
    }
    // 如果是字符串，则是文本节点
    if (typeof vnode.children === 'string') {
      // 将文本元素添加到元素中
      el.textContent = vnode.children;
    } else if (Array.isArray(vnode.children)) {
      // 如果children是数组类型，则遍历每一个子元素，并调用patch函数挂载子元素
      vnode.children.forEach((child) => {
        patch(null, child, el);
      });
    }
    // 将元素添加到容器中
    container.appendChild(el);
  }
  // patch 函数：渲染器核心入口，渲染逻辑的封装
  const patch = (n1, n2, container) => {
    // n1: oldVNode      n2: newVNode
    if (!n1) {
      // 如果oldVNode不存在，说明是mount操作

      mountElement(n2, container);
    } else {
      // 如果oldVNode存在，则对比n1，n2找出变更点并更新（patch操作）
    }
  };
  // render方法：以container为挂载点，将vnode渲染为真实dom并添加到挂载点下面
  const render = (vnode, container) => {
    // 如果vnode存在
    if (vnode) {
      // 将vnode（newVNode）与 container._vnode(oldVNode) 进行patch操作（对比新旧vnode，找出变更并更新变更点）
      patch(container._vnode, vnode, container);
    } else {
      // vnode不存在
      if (container._vnode) {
        // oldVNode 存在，说明是卸载操作（unmount）
        // container.innerHTML = ''; //
        // 不能直接使用innerHTML清空的原因：
        // 1.容器中可能有某个或多个子组件渲染，卸载时，应先正确调用组件的beforeUnmount，unmounted等生命周期函数
        // 2.容器中某些元素可能有自定义指令，卸载时，应正确执行对应的指令钩子函数。
        // 3.使用innerHTML不会移除绑定在dom元素上的事件处理函数
      }
    }
    // 更新oldVNode，将vnode存储到 container._vnode 下
    container._vnode = vnode;
  };
  return {
    render,
  };
}
