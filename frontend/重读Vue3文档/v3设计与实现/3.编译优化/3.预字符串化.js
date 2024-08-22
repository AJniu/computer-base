// 预字符串化：一种基于静态提升的优化策略
// 当一个模板上含有大量连续的标签节点，使用静态提升策略时，如下：
// <div>
//  <p></p>
//  <p></p>
//  ... 17个
//  <p></p>
// </div >

// 这就需要20个静态提升对象
const hosit1 = createVNode('p', null, null, patchFlags.HOISTED);
// ... hosit1 ~ 20
function render() {
  return (
    openBlock(),
    createElementBlock('div', null, [
      hosit1, // ...hosit 2~20
    ])
  );
}

// 预字符串化，将这些静态节点序列化为标签字符串，并生成一个Static类型的VNode
const hositStatic = createStaticVNode('<p></p><p></p>...共20个...<p></p>');

// 预字符串化的优势：
// 1. 可以直接用innerHTML设置大块静态内存，性能上具有一定优势
// 2. 减少创建虚拟节点的性能开销
// 3. 减少内存占用
