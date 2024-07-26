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
  // 定义比较属性函数patchProps
  function patchProps(el, key, preValue, nextValue) {
    // 处理属性,属性有一些注意事项：
    // 1. HTML Attributes 和 DOM Properties是不同的,可以简单概括为：
    //  1.1: 核心原则：HTML Attributes 的作用是 设置与之对应的 DOM Properties 的初始值。
    //  即HTML Attributes 获得的一般是初始值，而DOM Properties 获取的是属性的当前值。
    //  1.2：HTML Attributes 的一个属性可能对应 DOM Properties 的多个属性。（如html 的 value,与 el.value 和 el.defaultValue都有关联）
    //  1.3：HTML Attributes 的属性名与 DOM Properties 的属性名可能不同（如class 和 DOM的className）。
    //  1.4：HTML Attributes 中有的属性DOM Properties 不存在。DOM Properties中某些属性 即HTML Attributes也不存在。

    // vue的事件绑定：
    // 1. vue是将事件作为一种特殊的props处理，当props属性以 on 开头，则认为它是事件。
    // 2. 普通的逻辑是当事件更新时，先移除旧的处理函数(removeEventListener(event, fn))，再绑定新的处理函数(addEventListener(event, fn))
    // 3. 但vue为了省去移除和绑定的性能消耗，所以它将事件处理函数存储到invokers中，以el._vei存储到el中.
    // 4. 为了监听多个事件,每个事件多个处理函数,所以 invokers 是一个对象,key是事件名, 值是一个存储一个或多个事件处理函数的数组.
    // 5. 挂载时直接添加事件,卸载时直接移除事件,更新时将新的处理函数替换旧的处理函数.

    // 事件绑定的隐患：当一个事件做响应式绑定时，它的触发时间可能早于绑定时间。
    // 解决方法：在invoker中添加属性attached记录绑定时间（使用performance.now()高精度时间记录），与e.timeStamp（事件触发时间）作比较
    // 当触发时间早于绑定时间时，不执行此处理函数。

    // 1.优先设置DOM Properties，判断key是否在el上
    // 注：还有一些只读属性（如form等）需要直接用setAttribute设置，这里不做考虑
    if (key in el) {
      // 获取该 DOM Properties 的类型
      const type = typeof el[key];
      if (type === 'boolean' && value === '') {
        // 当type为布尔类型且value是空字符串，则矫正为true
        el[key] = true;
      } else {
        el[key] = nextValue;
      }
    } else {
      // 2.如果key 在 DOM Properties 不存在，则使用 setAttribute 将属性设置到元素上
      el.setAttribute(key, nextValue);
    }
  }

  // 定义对比新旧子节点的函数patchChild
  function patchChildren(n1, n2, container) {
    // 如果新子节点类型是文本节点
    if (typeof n2.children === 'string') {
      // 则只有当旧子节点是一组子节点时，才需要逐个卸载
      if (Array.isArray(n1.children)) {
        n1.children.forEach((c) => unmount(c));
      }
      // 否则直接将新文本设置给容器元素
      container.textContent = n2.children;
    } else if (Array.isArray(n2.children)) {
      // 如果新子节点是一组子节点
      if (Array.isArray(n1.children)) {
        // 如果旧子节点也是一组子节点（diff算法比较处）
        // 先简单实现 - 卸载所有旧子节点，挂载所有新子节点

      } else {
        // 否则，旧子节点的子节点要么不存在，要么是文本节点
        // 清空container内容
        container.textContent = '';
        // 将新子节点的一组子节点使用patch挂载到container上
        n2.children.forEach((c) => patch(null, c, container));
      }
    }
  }

  // 定义比较新旧子节点的函数
  function patchElement(n1, n2) {
    const el = (n2.el = n1.el); // 将真实dom引用到新vnode

    // 一：更新props
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    // 1.1 将oldVnode与newVnode不相等的props更新为newVnode的props的值
    for (const key in newProps) {
      if (newProps[key] !== oldProps[key]) {
        patchProps(el, key, oldProps[key], newProps[key]);
      }
    }
    // 1.2 移除newVnode不存在的props
    for (const key in oldProps) {
      if (!(key in newProps)) {
        patchProps(el, key, oldProps[key], null);
      }
    }

    // 二：更新子节点
    patchChildren(n1, n2, el);
  }
  // 定义挂载元素函数
  function mountElement(vnode, container) {
    // 创建dom元素，并让vnode.el引用真实dom（让vnode与真实dom建立联系，方便卸载）
    const el = (vnode.el = document.createElement(vnode.type));

    if (vnode.props) {
      for (const key in vnode.props) {
        // 直接调用patchProps更新属性
        patchProps(el, key, null, vnode.props[key]);
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

  // unmount 函数：处理卸载逻辑
  const unmount = (vnode) => {
    // container.innerHTML = ''; //
    // 不能直接使用innerHTML清空的原因：
    // 1.容器中可能有某个或多个子组件渲染，卸载时，应先正确调用组件的beforeUnmount，unmounted等生命周期函数
    // 2.容器中某些元素可能有自定义指令，卸载时，应正确执行对应的指令钩子函数。
    // 3.使用innerHTML不会移除绑定在dom元素上的事件处理函数

    // 正确的卸载方式：
    // 根据vnode对象获取与其相关联的真实dom元素(vnode.el存储真实dom)，然后使用原生dom操作方法将该dom移除。

    // 根据vnode获取真实dom
    const el = vnode.el;
    // 获取el的父元素
    const parent = el.parentNode;
    // 调用dom原生方法
    if (parent) parent.removeChild(el);
  };
  // patch 函数：渲染器核心入口，渲染逻辑的封装
  const patch = (n1, n2, container) => {
    // n1: oldVNode      n2: newVNode

    // 1.判断新旧子节点是否为同一类型，若不是则卸载旧子节点，挂载新子节点(同类型才patch)
    if (n1 && n1.type !== n2.type) {
      unmount(n1);
      n1 = null;
    }

    const { type } = n2;
    const typeVal = typeof type;
    // 如果typeVal值为字符串，则它描述的是普通标签元素
    if (typeof typeVal === 'string') {
      if (!n1) {
        // 如果oldVNode不存在，说明是mount操作
        mountElement(n2, container);
      } else {
        // 如果oldVNode存在，则对比n1，n2找出变更点并更新（patch操作）
        patchElement(n1, n2);
      }
    } else if (typeVal === 'object') {
      // 如果typeVal的值为对象，则它描述的是组件
      // 调用组件相关的挂载和更新方法
    } else {
      // 处理其他类型
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
        unmount(container._vnode);
      }
    }
    // 更新oldVNode，将vnode存储到 container._vnode 下
    container._vnode = vnode;
  };
  return {
    render,
  };
}

// 更新子节点的九种可能：以下为 old -> new （null为空，string代表文本节点，array代表一组子节点）
// null -> null
// null -> string
// null -> array

// string -> null
// string -> string
// string -> array

// array -> null
// array -> string
// array -> array
// 具体情况参考：https://www.yuque.com/polarbear-z8s9p/yukhdk/wnkio6qlox9w19ge