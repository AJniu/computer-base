// 快速diff算法特点：
// 1. 快速diff算法包含预处理步骤
// 2. 根据最长递增子序列移动dom

// 最长递增子序列:简单来说，给定一个数值序列，找到它的一个子序列，并且该子序列中的值是递增的，子序列中的元素在原序列中不一定连续。
// 一个序列可能有多个递增子序列，其中最长的那个被称为最长递增子序列。
// 如：[0, 8, 4, 12],它的最长递增子序列可以是[0, 8, 12] 和 [0, 4, 12]
// 文本节点标识：
const Text = Symbol();
// 注释节点标识
const Comment = Symbol();

// 定义Fragment节点标识：
const Fragment = Symbol();

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
  // 封装patchKeyedChildren 函数，处理两组子节点
  function patchKeyedChildren(n1, n2, container) {
    const oldChildren = n1.children;
    const newChildren = n2.children;

    // 处理相同的前置节点
    // 定义索引 j 指向新旧两组子节点的开头
    let j = 0;
    let osv = oldChildren[j];
    let nsv = newChildren[j];

    // while循环向后遍历，直到新旧节点不可复用为止（key不同）
    while (osv.key === nsv.key) {
      // 由于位置相同，不需要移动真实dom，只需要调用patch更新内容
      patch(osv, nsv, container);
      // 更新 j 索引及新旧vnode
      j++;
      osv = oldChildren[j];
      nsv = newChildren[j];
    }

    // 处理后置节点：由于新旧子节点数量可能不同，所以使用两个索引分别指向新旧尾节点
    let oei = oldChildren.length - 1;
    let nei = newChildren.length - 1;

    let oev = oldChildren[oei];
    let nev = newChildren[nei];
    while (oev.key === nev.key) {
      patch(oev, nev, container);
      oev = oldChildren[--oei];
      nev = oldChildren[--nei];
    }

    // 预处理完毕后，还有几种情况需处理：
    // 1. j > oei && j <= nei 说明旧子节点处理完毕，而新子节点 j - nei 还有新节点需挂载
    if (j > oni && j <= nei) {
      // 因为nei此时指向的是已处理完毕的上一个节点，所以锚点应是nei + 1处的节点（即最后处理完毕的节点）
      const anchorIndex = nei + 1;
      // 获取锚点元素
      const anchor =
        anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null;
      // 逐个挂载 j - nei 处的新增节点
      while (j <= nei) {
        patch(null, newChildren[j++], container, anchor);
      }
    } else if (j > nei && j <= oei) {
      // 2. j > nei && j <= oei 说明新子节点处理完毕，而旧子节点 j - oei 还有多余节点需卸载
      while (j <= oei) {
        unmount(oldChildren[j++]);
      }
    } else {
      // 3. 经过预处理后，不满足上述两种条件，仍有部分节点需要单独处理
      // 构造source数组，它的长度是新子节点中剩余未处理节点的数量,并将其属性初始化为 -1.
      // source数组的作用：用来存储新子节点在旧子节点中的位置的索引，用它计算出一个最长递增子序列，并用于辅助完成dom移动的操作。
      const count = nei - j + 1;
      const source = new Array(count);
      source.fill(-1);

      // 完成source数组的填充
      // 定义新旧子节点未处理节点的起始索引
      let osi = j;
      let nsi = j;
      // 定义变量moved和pos,判断是否需要移动dom
      let moved = false;
      // pos 代表遍历旧的一组子节点的过程中遇到的最大索引值
      // 简单diff时可知,在遍历过程中遇到的索引值呈现递增趋势,则说明不需要移动节点,反之则需要.
      let pos = 0;
      // 构建新子节点中未处理节点的key: index 的索引表
      // 这样可以将填充source数组的过程的复杂度从新旧子节点的双层遍历的O(n^2)变成O(n)
      const keyIndex = {};
      for (let i = nsi; i <= nei; i++) {
        keyIndex[newChildren[i].key] = i;
      }
      // 定义patched变量，代表更新过的节点数量
      let patched = 0;

      // 遍历旧子节点中未处理的节点
      for (let i = osi; i < oei; i++) {
        const ov = oldChildren[i];
        // 遍历新子节点（未建立keyIndex前）
        // for (let j = nsi; j < nei; j++) {
        //   const nv = newChildren[i];
        //   // 找到可复用的节点
        //   if (ov.key === nv.key) {
        //     patch(ov, nv, container);
        //     // 最后将新子节点在旧子节点的索引放到source对应位置中
        //     source[j - osi] = i;
        //   }
        // }

        // 建立keyIndex后
        // 如果更新过的节点数量小于新子节点未处理的数量
        if (patched < count) {
          // 通过索引表快速找到新子节点在旧子节点中可复用的节点
          const iInNewChildren = keyIndex[ov.key];

          if (iInNewChildren !== undefined) {
            // 如果iInNewChildren不等于undefined，说明当前ov可复用
            const nv = newChildren[iInNewChildren];
            patch(ov, nv, container);
            // 每更新一个节点，将patched计数加1
            patched++;
            // 将nv在旧子节点的索引填充到source对应位置
            source[iInNewChildren - nsi] = i;

            if (iInNewChildren < pos) {
              // 判断节点是否需要移动
              moved = true;
            } else {
              pos = iInNewChildren;
            }
          } else {
            // 如果没找到，说明当前ov不可复用，需要卸载
            unmount(ov);
          }
        } else {
          // 否则代表未处理的新子节点已处理完毕,多余的旧子节点需卸载
          unmount(ov);
        }
      }

      // 当需要移动dom时
      if (moved) {
      }
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
      // 调用patchKeyedChildren 函数
      patchKeyedChildren(n1, n2, container);
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
  function mountElement(vnode, container, anchor = null) {
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
    container.insertBefore(el, anchor);
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

    // 由于Fragment节点的特殊性，单独处理
    if (vnode.type === Fragment) {
      // Fragment不渲染，所以只需逐个卸载子节点
      vnode.children.forEach((c) => unmount(c));
      return;
    }
    // 根据vnode获取真实dom
    const el = vnode.el;
    // 获取el的父元素
    const parent = el.parentNode;
    // 调用dom原生方法
    if (parent) parent.removeChild(el);
  };
  // patch 函数：渲染器核心入口，渲染逻辑的封装
  const patch = (n1, n2, container, anchor) => {
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
        mountElement(n2, container, anchor);
      } else {
        // 如果oldVNode存在，则对比n1，n2找出变更点并更新（patch操作）
        patchElement(n1, n2);
      }
    } else if (typeVal === Text) {
      // 如果为文本节点 (注释节点和文本节点处理方式基本一致，除了使用createComment(ctx)创建注释节点)

      if (!n1) {
        // 如果不存在旧节点, 创建文本节点
        const el = (n2.el = document.createTextNode(n2.children));
        container.innerHTML = el;
      } else {
        // 如果旧节点存在，且新旧文本内存不同，则跟新文本
        const el = (n2.el = n1.el);
        if (n2.children !== n1.children) {
          el.nodeValue = n2.children;
        }
      }
    } else if (typeVal === Fragment) {
      // 处理Fragment节点 - 特殊点：Fragment本身不会渲染，它包裹了多个根节点
      if (!n1) {
        // 旧节点不存在，将Fragment节点的children逐个挂载
        n2.children.forEach((c) => patch(null, c, container));
      } else {
        // 旧节点存在，则对比Fragment节点的children并更新
        patchChildren(n1, n2, container);
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
