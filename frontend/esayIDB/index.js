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
// 新建数据库或数据库版本变化事件
request.onupgradeneeded = (e) => {
    console.log(`数据库版本发生变化`);
    db = e.target.result;

    // 如果是新建数据库,一般会在此事件中做一些处理
    // 1. 通常建库后，会首先新建对象仓库（表）

    let objStore;
    // 判断库中是否存在 person 表
    if (!db.objectStoreNames.contains('person')) {
        // 新增一张 person 表，主键是 id。
        // 主键是默认建立索引的属性。
        objStore = db.createObjectStore('person', { keyPath: 'id' });

        // 如果数据记录里面没有合适作为主键的属性，那么可以让 IndexedDB 自动生成主键。
        // objStore = db.createObjectStore('person', {
        //     autoIncrement: true,
        // });

        // 新建索引 - createIndex(indexName, indexProperty, configureObj) 接收三个参数
        // 1. indexName：索引名
        // 2. indexProperty：索引所在的属性
        // 3. configureObj: 配置对象（说明该属性是否包含重复的值）
        objStore.createIndex('name', 'name', { unique: false });
        objStore.createIndex('email', 'email', { unique: true });
    }
};

// 新增数据 - 通过事务向对象仓库写入数据记录。
function add() {
    const request = db
        .transaction(['person'], 'readwrite') // 新建事务：指定表格名称和操作模式（只读 或 读写）
        .objectStore('person') // 通过IDBTransaction.objectStore(name)方法，拿到 IDBObjectStore 对象(表)
        .add({ id: 1, name: '张三', age: 24, email: 'zhangsan@example.com' }); // 通过add方法写入数据记录
    // 监听写入成功回调
    request.onsuccess = function (event) {
        console.log('数据写入成功');
    };
    // 监听写入失败回调
    request.onerror = function (event) {
        console.log('数据写入失败');
    };
}
setTimeout(() => {
    add();
}, 3000);
