// // h函数，返回VNode对象
// const h = (tag, props, children) => {
//     return {
//         tag,
//         props,
//         children,
//     };
// };

// // mount函数，将VNode挂着到节点
// const mount = (VNode, container) => {
//     // 1.创建元素
//     const el = (VNode.el = document.createElement(VNode.tag));
//     // 2. 将props的属性添加到元素上
//     if (VNode.props) {
//         for (const key in VNode.props) {
//             const val = VNode.props[key];
//             // 判断是否为事件
//             if (key.startsWith('on')) {
//                 el.addEventListener(key.slice(2).toLowerCase(), val);
//             } else {
//                 el.setAttribute(key, val);
//             }
//         }
//     }

//     // 3. 处理children
//     if (VNode.children) {
//         // 当children为字符串时，直接将文本内容填充到el
//         if (typeof VNode.children === 'string') {
//             el.textContent = VNode.children;
//         } else {
//             // 当children为数组时，递归处理item，将子节点插入
//             for (const item of VNode.children) {
//                 mount(item, el);
//             }
//         }
//     }
//     // console.log('container', container);

//     // 4.将el挂载到真实节点上
//     container.appendChild(el);
// };

// // patch 函数：当VNode发生改变时，比较前后VNode, nv -> 表示新VNode, ov 表示旧VNode
// const patch = (ov, nv) => {
//     // 第一步，判断标签是否发生变化
//     // 标签发生变化后，直接移除原有VNode
//     if (nv.tag !== ov.tag) {
//         // 获取挂载节点
//         const ovParent = ov.el.parentElement;
//         // 移除原有元素
//         ovParent.removeChild(ov.el);
//         // 重新挂载新
//         mount(nv, ovParent);
//     } else {
//         // 当标签相同时，再对比子元素
//         // 1.取出element元素，并在新的VNode进行保存
//         const el = (nv.el = ov.el);

//         // 2. 处理props
//         const oProps = ov.props || {};
//         const nProps = nv.props || {};

//         // 2.1 将nProps添加到el
//         for (const key in nProps) {
//             const oVal = ov.props[key];
//             const nVal = nv.props[key];

//             if (oVal !== nVal) {
//                 // 判断是否为事件
//                 if (key.startsWith('on')) {
//                     el.addEventListener(key.slice(2).toLowerCase(), nVal);
//                 } else {
//                     el.setAttribute(key, nVal);
//                 }
//             }
//         }

//         // 2.2 删除旧的props
//         for (const key in oProps) {
//             // 为解决mini-vue每次patch都会认为事件是一个新的事件，所以先将所有都直接移除处理
//             // if (!(key in nProps)) {
//             //     if (key.startsWith('on')) {
//             //         const oVal = nProps[key];
//             //         el.removeEventListener(key.slice(2).toLowerCase(), oVal);
//             //     } else {
//             //         el.removeAttribute(key);
//             //     }
//             // }

//             if (key.startsWith('on')) {
//                 const oVal = nProps[key];
//                 el.removeEventListener(key.slice(2).toLowerCase(), oVal);
//             }

//             if (!(key in nProps)) {
//                 el.removeAttribute(key);
//             }
//         }

//         // 3.处理children
//         const oC = ov.children || [];
//         const nC = nv.children || [];

//         // 情况一：新虚拟节点是一个文本节点
//         if (typeof nC === 'string') {
//             // 边界情况（edag case)
//             if (typeof oC === 'string') {
//                 if (nC !== oC) {
//                     el.textContent = nC;
//                 }
//             } else {
//                 el.innerHTML = nC;
//             }
//         } else {
//             // 情况二：新虚拟节点有多个子节点

//             // 当旧节点是文本节点时
//             if (typeof oC === 'string') {
//                 // 首先清空父节点内容
//                 el.innerHTML = '';

//                 // 然后将新节点依次挂载到父节点
//                 for (const item of nC) {
//                     mount(item, el);
//                 }
//             } else {
//                 // 当新旧节点都有多个子节点：以下方为例
//                 // oC: [v1. v2. v3. v8. v9]
//                 // nC: [v1, v4, v5]

//                 // 获取新旧节点的公共长度
//                 const commonLength = Math.min(oC.length, nC.length);

//                 // 以公共长度为界限遍历
//                 // 1. 前面有公共长度的节点时，递归patch对应位置的节点
//                 for (let i = 0; i < commonLength; i++) {
//                     patch(oC[i], nC[i]);
//                 }

//                 // 2. 根据新旧节点长度判断是移除还是新增操作
//                 if (nC.length > oC.length) {
//                     for (const item of nC.slice(commonLength)) {
//                         mount(item, el);
//                     }
//                 }

//                 if (nC.length < oC.length) {
//                     for (const item of nC.slice(commonLength)) {
//                         el.removeChild(item.el);
//                     }
//                 }
//             }
//         }
//     }
// };

// vue组件到渲染成真实dom步骤如下
// 1. vue会在构建阶段将 .vue组件 编译成render函数（如果未编译，可以在运行阶段使用vue编译器编译）
// 2. 需要渲染组件时，vue会调用组件的render函数，返回组件的vnode
// 3. vue使用渲染器，将vnode转换为真实dom，并插入到对应的container
// v3 设计与实现renderer
// 根据情况判断vnode.tag是否是普通元素
// 1. 是普通元素，调用mountElement()方法挂载
// 2. 是组件函数，调用mountComponent()方法挂载
const renderer = (vnode, container) => {
    if (typeof vnode.tag === 'string') {
        mountElement(vnode, container);
    } else {
        mountComponent(vnode, container);
    }
};

// 挂载普通dom元素
const mountElement = (vnode, container) => {
    // 1. 根据vnode创建真实dom元素
    const el = document.createElement(vnode.tag);
    // 2. 遍历props
    for (const key in vnode.props) {
        // 2.1 判断传入的prop是否为事件，若是，添加对应的事件监听器
        if (key.startsWith('on')) {
            el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key]);
        } else {
            // 2.2 否则，将属性添加到元素上
            el.setAttribute(key, vnode.props[key]);
        }
    }
    // 3. 处理children
    if (typeof vnode.children === 'string') {
        // 3.1 如果是文本节点，直接添加到元素上
        el.textContent = vnode.children;
    } else {
        // 3.2 如果是子节点，遍历子节点，递归调用renderer挂载到元素上
        vnode.children.forEach((child) => {
            renderer(child, el);
        });
    }

    // 4. 将元素添加到container上
    container.appendChild(el);
};

// 组件的返回值也是虚拟DOM
const mountComponent = (vnode, container) => {
  // 调用组件函数，获取组件的vnode
    const subTree = vnode.tag();
    renderer(subTree, container);
};
// 渲染器的精髓在于：当vnode更改时，它需要精准地找到 vnode 对象的变更点，并且只更新变更的内容。
