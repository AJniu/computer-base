// 编译优化：
// 作用:编译器将模板编译为渲染函数过程中,尽可能多地提取关键信息,并借此生成最优代码的过程.

// 一:动态节点收集与补丁标志
// 响应式dom-D1:
// <div id="root">
//   <p class="bar">{{ text }}</p>
// <div />;
// 1.diff算法的问题
// 以D1为例，当text发生更改时，diff算法会逐层遍历，修改响应式内容。
// 但实际唯一有可能变化的是p标签的文本子节点的内容，即当text发生变化时，直接修改p的文本内容最高效。
// 但diff算法做不到，而这可以通过编译优化做到。

// 直接更新可能变化的内容 的实现:
// 实际上模板的结构非常稳定。通过编译手段，可以分析出哪些节点是静态的(静态内容)，哪些节点是动态的(动态内容)。
// 结合这些关键信息,编译器可以直接生成原生dom操作的代码.
// (甚至能抛掉虚拟dom，避免虚拟dom的性能开销。-由于渲染函数的灵活性和vue版本兼容性，暂时没这么做，vueConf分享提到了想做无虚拟dom的vue)
// vue3的编译器将编译时得到的这些关键信息“附着”在它的生成的虚拟dom上，这些信息会随着虚拟dom传递给渲染器，
// 最终渲染器会根据这些关键信息执行"快捷操作",从而提升运行时性能.

// 2.Block 和 PatchFlags：
// 当运行时可以区分静态内容和动态内容时,即可实现极致的优化策略。如下：
// 响应式dom-D2:
// <div>
//   <span>静态内容</span>
//   <p>{{ text }}</p>
// <div />;
// 最效率变更：当text变化时，只更新p标签的文本内容

// D2 传统的虚拟dom
// const D2VNode = {
//   type: 'div',
//   children: [
//     { type: 'span', children: '静态内容' },
//     { type: 'p', children: ctx.text },
//   ],
// };
// D2 以patchFlag为动态标志的虚拟dom
// PatchFlags 运行时定义的补丁标志含义：
const PatchFlags = {
  TEXT: 1, // 动态文本节点
  CLASS: 2, // 动态class
  STYLE: 4, // 动态style
  PROPS: 8, // 动态props
  FULL_PROPS: 16, // 完整props
  HYDRATE_EVENTS: 32, // 触发事件
  STABLE_FRAGMENT: 64, //稳定fragment
};
// 将带有dynamicChildren属性的虚拟dom称为block节点。
const D2VNode = {
  type: 'div',
  children: [
    { type: 'span', children: '静态内容' },
    { type: 'p', children: ctx.text, patchFlag: PatchFlags.TEXT }, // patchFlag为1，代表动态内容
  ],
  // 将children中的动态节点提取到 dynamicChildren数组中
  // dynamicChildren 能将它所有后代节点的动态节点收集
  dynamicChildren: [
    // p标签有patchFlag属性，因此它是动态节点
    { type: 'p', children: ctx.text, patchFlag: PatchFlags.TEXT },
  ],
};

// 有了block这个概念之后，渲染器的更新操作将会以block为单位进行。
// 即当渲染器更新一个block时，会忽略vnode的children数组，直接找到该节点的dynamicChildren数组，并只更新该数组中的动态节点。
// 这样，在更新时就实现了跳过静态内容，只更新动态内容的优化。
// 同时，由于动态节点中存在对应的补丁标志，所以可以根据这些标志只更新对应的动态部分。

// v3中变为block的节点有：
// 1. 所有template 模板的根节点都会是一个block节点
// 2. 所有带有 v-for, v-if /v-else-if /v-else 等指令的节点都会作为block节点。

// 3. 渲染函数
// 编译器生成的渲染函数，并不是直接打vnode对象，而是包含着用来创建虚拟dom节点的辅助函数，如下：
// createVNode 辅助创建vnode的辅助函数
function createVNode(type, props, children, flags) {
  const key = props && props.key;
  props && delete props.key;
  // 返回一个虚拟dom节点
  const vnode = {
    type,
    props,
    children,
    key,
    PatchFlags: flags,
  };
  if (flags !== undefined && currentDynamicChildren) {
    // 动态节点，将其添加到当前动态节点集合中
    currentDynamicChildren.push(vnode);
  }
  return;
}
// 编译器在优化阶段提取的关键信息回影响最终生成的代码，具体体现在用于创建虚拟dom节点的辅助函数上：
// 编译器生成的一个节点的渲染函数
function render() {
  return createVNode('div', { id: 'root' }, [
    createVNode('span', null, '静态内容'),
    // 存在第四个参数patchFlages.TEXT
    createVNode('p', null, ctx.text, PatchFlags.TEXT),
  ]);
}

// 4.收集动态节点
// 即将一个根节点变为一个block，并将其子孙节点的动态子节点收集到block的dynamicChildren数组中

// 根据dom结构可知，渲染函数内对createVNode函数的调用是层层嵌套的结构，并且createVNode的执行顺序是“内层先执行，外层后执行”。
// 通过设计一个栈结构,存储子孙节点的动态子节点，最终将其都添加到block的dynamicChildren数组中。

// 5.渲染器的运行时支持
// 在编译优化有block和patchFlags后，渲染器进行相应的支持
// patchElement函数优化(简略版)
function patchElement(n1, n2) {
  const el = (n2.el = n1.el);

  // 有block和patchFlags之后的子节点对比 --- 细节实现
  if (n2.patchFlags) {
    if (n2.patchFlags === 1) {
      // 只更新class
    } else if (n2.patchFlags === 2) {
      // 只更新style
    } else if (n2.patchFlags === 8) {
      // 只更新props
    }
    // 省略部分标志对应的更新项
    // else if (n2.patchFlags === 16) {
    //   // 完整更新props
    // }
  } else {
    // 全量更新
    // ...省略patchProps代码
    patchChildren(n1, n2, el);
  }

  // 有block和patchFlags之后的子节点对比 --- 整体概览
  // if (n2.dynamicChildren) {
  //   // 如果节点的block节点，调用patchBlockChildren函数，只更新动态节点
  //   patchBlockChildren(n1.dynamicChildren, n2.dynamicChildren, el);
  // } else {
  //   patchChildren(n1, n2, el);
  // }
}
function patchBlockChildren(n1, n2) {
  // 只更新动态节点
  for (let i = 0; i < n2.dynamicChildren.length; i++) {
    patchElement(n1.dynamicChildren[i], n2.dynamicChildren[i]);
  }
}
