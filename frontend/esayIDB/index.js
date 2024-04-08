// 定义变量存储数据库
let db;
// 打开数据库
const request = indexedDB.open('myDB');
// 打开IndexedDB成功回调
request.onsuccess = (e) => {
    // 结果e.target.result  - IDBDatabase 实例对象
    console.log(e.target.result);
    db = e.target.result;
    // 针对此数据库的请求的所有错误的通用处理器
    db.onerror = (e) => {
        console.error(`数据库错误：${e.target.errorCode}`);
    };
};
// 打开IndexedDB错误回调
request.onerror = (e) => {
    console.log(e.target.error);
};
// 数据库版本变化事件
request.onupgradeneeded = (e) => {
    console.log(`数据库版本发生变化`);
    db = e.target.result
}
// console.log(request)
