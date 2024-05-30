// 渲染器：
//  功能：执行渲染任务，将vnode渲染为真实dom。（渲染器将虚拟dom渲染为真实dom的过程叫做挂载）

// 定义挂载元素函数
function mountElement(vnode, container) {
    const el = document.createElement(vnode.type);
    // 如果是字符串，则是文本节点
    if (typeof vnode.children === 'string') {
        // 将文本元素添加到元素中
        el.textContent = vnode.children;
    }
    // 将元素添加到容器中
    container.appendChild(el);
}

// 1. 定义创建渲染器函数
function createRenderer() {
    return {
        render(vnode, container) {
            if (vnode) {
                // 新的vnode存在。将其与旧vnode一起传递给patch函数，进行补丁操作
                patch(container._vnode, vnode, container);
            } else {
                // 旧的vnode存在，且新的vnode不存在，说明是卸载（unMount）操作
                // 只需要将 container 内的dom清空
                if (container._vnode) {
                    container.innerHTML = '';
                }
            }
            // 将vnode存储到 container._vnode 下，即后续渲染中的旧vnode
            container._vnode = vnode;
        },
        // 定义patch函数 - 打补丁，并执行挂载
        patch(oldnode, newnode, container) {
            // 编写渲染逻辑
            // 如果oldnode不存在，意味着挂载，调用mountElement函数完成挂载
            if (!oldnode) {
                mountElement(newnode, container);
            } else {
                // oldnode存在，意味着打补丁
            }
        },
    };
}
