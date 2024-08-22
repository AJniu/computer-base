// 静态提升：能够减少更新时创建虚拟dom带来的性能开销和内存消耗
// 静态提升就是将 纯静态节点提升到渲染函数之外。

// 注意点：静态提升是以（dom）树为单位的。一个dom树种有动态节点，则整个dom树都不会提升。

// 如下：
// <div>
// <p>static text</p>
// <p>{{ dynamicText }}</p>
// </div>;

// 未使用静态提升的渲染函数
function render() {
  return (
    openBlock(),
    createBlock('div', null, [
      createVNode('p', null, 'static text'),
      createVNode('p', null, ctx.dynamicText, patchFlags.Text),
    ])
  );
}

// 静态提升后（提升到渲染函数之外）
const hoist1 = createVNode('p', null, 'static text');
function render() {
  return (
    openBlock(),
    createBlock('div', null, [
      hoist1, // 静态节点，从而避免了重新创建虚拟节点的开销
      createVNode('p', null, ctx.dynamicText, patchFlags.Text),
    ])
  );
}

// 如果动态节点上有纯静态属性，虽然动态节点本身不会提升，但静态属性也可被提升
// 如下
// <div>
//  <p id="static" a="b">
//    {{ dynamicText }}
//  </p>
// </div>;

// 静态属性提升：
const hositProp = { id: 'static', a: 'b' };
function render() {
  return (
    openBlock(),
    createBlock('div', null, [
      // 引用静态属性
      createVNode('p', hositProp, ctx.dynamicText, patchFlags.Text),
    ])
  );
}
