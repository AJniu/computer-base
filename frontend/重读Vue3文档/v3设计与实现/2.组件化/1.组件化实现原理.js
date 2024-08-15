// 一: 不同视角的组件
// 1. 程序员眼中，一个选项对象就可以是一个组件
// const myComp = {
//   name: 'MyComp',
//   data() {
//     return {
//       foo: 0,
//     };
//   },
// };
// 2.渲染器视角的组件 - 一个组件就是一个特殊类型(object)的虚拟dom节点
// 为了使渲染器方便处理组件，则要求组件必须符合要求,如下:
const myComponent = {
  // name - 可选
  name: 'myConponent',
  // 组件的渲染函数，其返回值必须为虚拟dom
  render() {
    // 返回虚拟dom
    return {
      type: 'div',
      children: `文本节点`,
    };
  },
};

// 渲染器完成组件渲染,过程如下:

// 1. 用来描述组件的vnode对象, type 属性值为组件的选项对象
const CompVNode = {
  type: myComponent,
};

// 2. 调用渲染器来渲染组件
renderer.render(CompVNode, document.querySelector('#app'));
