import eventBus from './moduleA';
// 相当于main.js引入element-ui的css
import './base.css';

// 使用import()方法异步加载asyncModuleB
setTimeout(() => {
    // 魔法注释自定义打包名
    import(/*webpackChunkName:"moduleB"*/ './asyncModuleB.js').then((res) => {
        console.log(res);
    });
}, 2000);

(() => {
    console.log(eventBus);
})();
